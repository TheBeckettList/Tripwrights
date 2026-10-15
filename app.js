/* Tripwrights app: the rig (home) -> an area (island map) -> a stop (shop, meal) added to your plan.
   Prototype: sample hours, plan kept on this device. Plain ES5. */
(function () {
  'use strict';
  var U = UART, AREAS = U.palettes.areas, scene = document.getElementById('scene'), sheet = document.getElementById('sheet'), veil = document.getElementById('veil'),
    $ = function (id) { return document.getElementById(id); }, last = null, view = 'home', boatAt = 'away', boatTimer = null;

  var DAY = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], DAYL = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
  var BLOCK = { m: ['Morning', 360, 720], a: ['Afternoon', 720, 1020], e: ['Evening', 1020, 1380] };
  var all = function (v) { var o = {}; DAY.forEach(function (d) { o[d] = v; }); return o; };
  var PLACES = {
    utila: [
      { id: 'josies-cafe', name: 'Josie’s Cafe', kind: 'Eat', pal: 'josies-cafe', x: 270, y: 425, real: true, blurb: 'Coffee, breakfast and lunch on the bay. Order at the counter.',
        hours: { mon: '6:15-14:30', tue: '6:15-14:30', wed: '6:15-14:30', thu: '6:15-14:30', fri: '6:15-14:30', sat: '6:15-14:30', sun: 'closed' } },
      { id: 'paradise', name: 'Paradise', kind: 'Dive \u00b7 Stay', pal: 'paradise', x: 740, y: 425, real: true, blurb: 'SSI and PADI dive shop and hostel on the bay, next to Josie\u2019s.',
        hours: (function () { var o = all('7:00-17:00'); o.sun = '7:00-12:00'; return o; })(),
        /* from Paradise's place card (utilatarian/places/paradise/place_card.json): courses, agencies, and the card each one needs */
        offers: [
          { name: 'Try scuba', agencies: ['SSI', 'PADI'], needs: 'none' }, { name: 'Open Water', agencies: ['SSI', 'PADI'], needs: 'none', days: 4 },
          { name: 'Advanced Open Water', agencies: ['SSI', 'PADI'], needs: 'ow', days: 2 }, { name: 'Rescue Diver', agencies: ['SSI', 'PADI'], needs: 'aow', days: 3 },
          { name: 'Fun dives', agencies: ['any'], needs: 'ow' }, { name: 'Night dive', agencies: ['any'], needs: 'ow' }
        ] }
    ]
  };
  var byId = {}; Object.keys(PLACES).forEach(function (a) { PLACES[a].forEach(function (p) { p.area = a; byId[p.id] = p; }); });

  /* plan: [{id, day, block}], kept on the device */
  var plan = []; try { plan = JSON.parse(localStorage.getItem('tw-plan') || '[]'); } catch (e) { plan = []; }
  var day = 'sat', showDays = false;
  /* the diver's card: a level on the shared ladder and the agency that issued it (SSI and PADI cards are both accepted for diving) */
  var LADDER = ['none', 'ow', 'aow', 'rescue', 'pro'], LN = { none: 'No card', ow: 'Open Water', aow: 'Advanced', rescue: 'Rescue', pro: 'Divemaster+' };
  var cert = { level: 'none', agency: 'SSI' }; try { cert = JSON.parse(localStorage.getItem('tw-cert')) || cert; } catch (e) { }
  function saveCert() { try { localStorage.setItem('tw-cert', JSON.stringify(cert)); } catch (e) { } }
  function certBlock(p) {
    if (!p.offers) { return ''; }
    return '<p class="where" style="margin:12px 0 2px"><b>Your card</b></p><div class="days">' + LADDER.map(function (l) { return '<button data-cert="' + l + '" class="' + (cert.level === l ? 'on' : '') + '">' + LN[l] + '</button>'; }).join('') + '</div>' +
      (cert.level === 'none' ? '' : '<div class="days">' + ['SSI', 'PADI', 'Other'].map(function (g) { return '<button data-agency="' + g + '" class="' + (cert.agency === g ? 'on' : '') + '">' + g + '</button>'; }).join('') + '</div>') +
      p.offers.map(function (o) {
        var ok = LADDER.indexOf(cert.level) >= LADDER.indexOf(o.needs), done = o.needs === 'none' && o.name === 'Open Water' && LADDER.indexOf(cert.level) >= 1;
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-top:1px solid var(--line)"><span><b>' + o.name + '</b>' + (o.days ? ' <span class="where">\u00b7 ' + o.days + ' days</span>' : '') + (o.agencies[0] !== 'any' ? ' <span class="where">\u00b7 ' + o.agencies.join(' or ') + '</span>' : '') + '</span>' +
          '<span class="chip ' + (done ? 'off' : ok ? 'ok' : 'soon') + '">' + (done ? 'have it' : ok ? 'ready' : 'needs ' + LN[o.needs]) + '</span></div>';
      }).join('');
  }
  function save() { try { localStorage.setItem('tw-plan', JSON.stringify(plan)); } catch (e) { } $('pn').textContent = plan.length; }
  function mins(s) { var a = s.split(':'); return +a[0] * 60 + +a[1]; }
  function clock(s) { var a = s.split(':'), h = +a[0]; return (h % 12 || 12) + (a[1] === '00' ? '' : ':' + a[1]) + (h >= 12 ? 'pm' : 'am'); }
  function openIn(p, d, b) { var v = p.hours[d]; if (v === 'closed') { return false; } var r = v.split('-'); return mins(r[0]) < BLOCK[b][2] && mins(r[1]) > BLOCK[b][1]; }
  function has(id, d, b) { return plan.some(function (x) { return x.id === id && x.day === d && x.block === b; }); }

  function openSheet(t, l, html) {
    $('st').textContent = t; $('sl').textContent = l || ''; $('sb').innerHTML = html;
    sheet.classList.add('on'); veil.classList.add('on'); sheet.setAttribute('aria-hidden', 'false'); $('close').focus();
  }
  function shut() { sheet.classList.remove('on'); veil.classList.remove('on'); sheet.setAttribute('aria-hidden', 'true'); if (last && last.focus) { last.focus(); } }

  function chips(o) { return '<div class="chips">' + ['m', 'a', 'e'].map(function (k) { return '<span class="chip ' + (o.indexOf(k) > -1 ? 'ok' : 'off') + '">' + BLOCK[k][0] + '</span>'; }).join('') + '</div>'; }
  function item(n, w, o) { return '<div class="item"><b>' + n + '</b><span class="where">' + w + '</span>' + chips(o) + '</div>'; }

  function showHome() {
    view = 'home'; scene.setAttribute('viewBox', '0 0 1000 1500'); scene.innerHTML = U.rig.home(); $('back').hidden = true; location.hash = '';
    $('sub').textContent = 'Off the coast of England'; $('hint').textContent = 'Tap the globe, or a boat on the pier.';
    window.scrollTo(0, 0);
  }
  function showArea(id) {
    var a = AREAS[id]; view = id; boatAt = 'away';
    scene.setAttribute('viewBox', '0 0 1000 1100'); scene.innerHTML = U.rig.area(id, PLACES[id] || []) +
      '<g id="areaBoat" class="areaboat" style="transform:translate(' + (U.rig.DOCK[0] + 40) + 'px,1320px)">' + U.rig.boat(id) + '</g>';
    $('back').hidden = false; location.hash = id; $('sub').textContent = a.name + ', ' + a.country;
    $('hint').textContent = a.live ? 'Tap a place to sail there.' : a.name + ' is coming. The island fills in as shops join.';
    window.scrollTo(0, 0);
    setTimeout(function () { var b = $('areaBoat'); if (b) { b.style.transform = 'translate(' + (U.rig.DOCK[0] + 40) + 'px,1010px)'; } }, 60);
    if (!a.live) { openSheet(a.name, a.country, '<div class="item"><b>Coming</b><span class="where">' + a.blurb + '</span></div><p class="note">The more shops on the island, the more of it you can plan. Utila is open now.</p>'); }
  }

  function areaSheet() {
    openSheet('Where to?', '', U.rig.ORDER.map(function (id) {
      var a = AREAS[id]; return '<button class="btn go" data-go="' + id + '" style="display:flex;width:100%;margin:8px 0;justify-content:space-between' + (a.live ? '' : ';background:var(--wash);color:var(--accent-deep);box-shadow:inset 0 0 0 2px var(--soft)') + '"><span>' + a.name + '</span><span style="font-family:var(--u-body);font-size:14px">' + (a.live ? 'open now' : 'soon') + '</span></button>';
    }).join(''));
  }
  function placeSheet(p) {
    showDays = false;
    var pal = U.palettes.places[p.pal].light, today = p.hours[day];
    function body() {
      var rows = ['m', 'a', 'e'].map(function (b) {
        var ok = openIn(p, day, b), on = has(p.id, day, b);
        return ok ? '<button class="btn add' + (on ? ' done' : '') + '" data-add="' + b + '">' + (on ? '✓ ' : '+ ') + BLOCK[b][0] + '</button>' : '<span class="chip off" style="margin-right:6px">' + BLOCK[b][0] + '</span>';
      }).join('');
      return '<p class="where" style="margin:10px 0 2px"><b>' + DAYL[day] + '</b> · ' + (today === 'closed' ? 'closed' : clock(today.split('-')[0]) + ' – ' + clock(today.split('-')[1])) + ' <button class="pillbtn" data-showdays="1" style="min-height:32px;padding:0 12px;font-size:13px">change day</button></p>' +
        (showDays ? '<div class="days">' + DAY.map(function (d) { return '<button data-day="' + d + '" class="' + (d === day ? 'on' : '') + '">' + DAYL[d] + '</button>'; }).join('') + '</div>' : '') + rows + certBlock(p);
    }
    var h = '<div data-place="' + p.pal + '" class="pcard" id="pc"><b style="font-family:var(--u-display);font-size:20px">' + p.kind + ' · ' + p.name + '</b><p style="margin:4px 0 0;color:var(--ink2)">' + p.blurb + '</p><div id="pcb">' + body() + '</div></div>';
    openSheet(p.name, p.offers ? 'Courses and dives match your card, SSI or PADI.' : 'On the map, in its own colors.', h);
    $('pc').onclick = function (e) {
      var t = e.target, d = t.getAttribute('data-day'), b = t.getAttribute('data-add'), i;
      if (t.getAttribute('data-showdays')) { showDays = !showDays; $('pcb').innerHTML = body(); }
      if (d) { day = d; showDays = false; $('pcb').innerHTML = body(); }
      if (t.getAttribute('data-cert')) { cert.level = t.getAttribute('data-cert'); saveCert(); $('pcb').innerHTML = body(); }
      if (t.getAttribute('data-agency')) { cert.agency = t.getAttribute('data-agency'); saveCert(); $('pcb').innerHTML = body(); }
      if (b) { if (has(p.id, day, b)) { plan = plan.filter(function (x) { return !(x.id === p.id && x.day === day && x.block === b); }); } else { plan.push({ id: p.id, day: day, block: b }); } save(); $('pcb').innerHTML = body(); }
    };
  }
  function planSheet() {
    var h = '', any = false;
    DAY.forEach(function (d) {
      var items = plan.filter(function (x) { return x.day === d; });
      if (!items.length) { return; } any = true; h += '<h3 style="font:800 18px var(--u-display);margin:10px 0 2px">' + DAYL[d] + '</h3>';
      ['m', 'a', 'e'].forEach(function (b) {
        items.filter(function (x) { return x.block === b; }).forEach(function (x) { var p = byId[x.id]; h += '<div data-place="' + p.pal + '" class="pcard" style="padding:8px 14px;margin:6px 0"><b>' + p.name + '</b> <span class="where">' + BLOCK[b][0] + '</span></div>'; });
      });
    });
    openSheet('Your plan', any ? 'Saved on this device.' : 'Nothing yet.', any ? h : '<p class="note">Sail to an island and pick a place to start.</p>');
  }
  function flySheet(k) {
    if (k === 'heli') { openSheet('Fly', 'Bubble-helicopter tours when you want the island from above.', item('Island loop flight', 'Sample · Utila', ['m', 'a'])); }
    else { openSheet('Seaplane', 'Hop between areas without the long boat ride.', item('Utila ↔ Roatán hop', 'Sample · coming', ['m', 'a'])); }
  }

  function go(k, el) {
    last = el;
    if (k === 'globe') { areaSheet(); }
    else if (k === 'heli' || k === 'plane') { flySheet(k); }
    else if (k.indexOf('boat:') === 0) { showArea(k.slice(5)); }
    else if (k.indexOf('place:') === 0) {
      var p = byId[k.slice(6)], b = $('areaBoat'), t = U.rig.DOCK;
      if (boatAt === p.id) { placeSheet(p); return; }
      /* the boat pulls up to the island dock, then the stop opens */
      if (b) { b.style.transform = 'translate(' + (t[0] + 40) + 'px,' + (t[1] + 20) + 'px)'; }
      boatAt = p.id; clearTimeout(boatTimer); boatTimer = setTimeout(function () { placeSheet(p); }, 1300);
    }
  }
  scene.addEventListener('click', function (e) { var n = e.target; while (n && n !== scene) { if (n.getAttribute && n.getAttribute('data-k')) { go(n.getAttribute('data-k'), n); return; } n = n.parentNode; } });
  scene.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute('data-k')) { e.preventDefault(); go(e.target.getAttribute('data-k'), e.target); } });
  $('sb').addEventListener('click', function (e) { var g = e.target.getAttribute('data-go'); if (g) { shut(); showArea(g); } });
  $('back').addEventListener('click', showHome); $('planbtn').addEventListener('click', planSheet);
  $('close').addEventListener('click', shut); veil.addEventListener('click', shut);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { shut(); } });
  save();
  var h = location.hash.slice(1); if (h && AREAS[h]) { showArea(h); } else { showHome(); }
})();
