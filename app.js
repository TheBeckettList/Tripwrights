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
      { id: 'josies-cafe', name: 'Josie’s Cafe', kind: 'Eat', pal: 'josies-cafe', x: 290, y: 330, real: true, blurb: 'Coffee, breakfast and lunch on the bay. Order at the counter.',
        hours: { mon: '6:15-14:30', tue: '6:15-14:30', wed: '6:15-14:30', thu: '6:15-14:30', fri: '6:15-14:30', sat: '6:15-14:30', sun: 'closed' } },
      { id: 'utila-dives', name: 'Utila Dives', kind: 'Do', pal: 'utila-dives', x: 710, y: 330, blurb: 'Fun dives, first-time dives and courses off their own dock.',
        hours: (function () { var o = all('7:00-17:00'); o.sun = '7:00-12:00'; return o; })() }
    ]
  };
  var byId = {}; Object.keys(PLACES).forEach(function (a) { PLACES[a].forEach(function (p) { p.area = a; byId[p.id] = p; }); });

  /* plan: [{id, day, block}], kept on the device */
  var plan = []; try { plan = JSON.parse(localStorage.getItem('tw-plan') || '[]'); } catch (e) { plan = []; }
  var day = 'sat';
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
    $('sub').textContent = 'Off the coast of England'; $('hint').textContent = 'Tap the globe to pick where you are going, or walk down the pier to a boat.';
    window.scrollTo(0, 0);
  }
  function showArea(id) {
    var a = AREAS[id]; view = id; boatAt = 'away';
    scene.setAttribute('viewBox', '0 0 1000 1100'); scene.innerHTML = U.rig.area(id, PLACES[id] || []) +
      '<g id="areaBoat" class="areaboat" style="transform:translate(' + (U.rig.DOCK[0] + 40) + 'px,1320px)">' + U.rig.boat(id) + '</g>';
    $('back').hidden = false; location.hash = id; $('sub').textContent = a.name + ', ' + a.country;
    $('hint').textContent = a.live ? 'Tap a place to pull the boat up and plan your stop.' : a.name + ' is coming. The island fills in as shops join.';
    window.scrollTo(0, 0);
    setTimeout(function () { var b = $('areaBoat'); if (b) { b.style.transform = 'translate(' + (U.rig.DOCK[0] + 40) + 'px,1010px)'; } }, 60);
    if (!a.live) { openSheet(a.name, a.country, '<div class="item"><b>Coming</b><span class="where">' + a.blurb + '</span></div><p class="note">The more shops on the island, the more of it you can plan. Utila is open now.</p>'); }
  }

  function areaSheet() {
    openSheet('The globe', 'Where do you want to go?', U.rig.ORDER.map(function (id) {
      var a = AREAS[id]; return '<div class="item" data-area="' + id + '" style="background:var(--wash)"><b>' + a.name + ', ' + a.country + '</b><span class="where">' + a.blurb + '</span><div class="chips"><span class="chip ' + (a.live ? 'ok' : 'soon') + '">' + (a.live ? 'Live now' : 'Coming') + '</span></div>' +
        '<button class="btn go" data-go="' + id + '"' + '>' + (a.live ? 'Sail to ' + a.name : 'Look at ' + a.name) + '</button></div>';
    }).join(''));
  }
  function placeSheet(p) {
    var pal = U.palettes.places[p.pal].light, today = p.hours[day];
    function body() {
      var rows = ['m', 'a', 'e'].map(function (b) {
        var ok = openIn(p, day, b), on = has(p.id, day, b);
        return ok ? '<button class="btn add' + (on ? ' done' : '') + '" data-add="' + b + '">' + (on ? '✓ ' : '+ ') + BLOCK[b][0] + '</button>' : '<span class="chip off" style="margin-right:6px">' + BLOCK[b][0] + '</span>';
      }).join('');
      return '<div class="days">' + DAY.map(function (d) { return '<button data-day="' + d + '" class="' + (d === day ? 'on' : '') + '">' + DAYL[d] + '</button>'; }).join('') + '</div>' +
        '<p class="where" style="margin:8px 0">' + (today === 'closed' ? 'Closed this day.' : 'Open ' + clock(today.split('-')[0]) + ' – ' + clock(today.split('-')[1]) + '.') + '</p>' + rows;
    }
    var h = '<div data-place="' + p.pal + '" class="pcard" id="pc"><b style="font-family:var(--u-display);font-size:20px">' + p.kind + ' · ' + p.name + '</b><p style="margin:4px 0 0;color:var(--ink2)">' + p.blurb + '</p><div id="pcb">' + body() + '</div></div>';
    openSheet(p.name, p.real ? 'On the map, in its own colors.' : 'Sample place, in its own colors.', h);
    $('pc').onclick = function (e) {
      var t = e.target, d = t.getAttribute('data-day'), b = t.getAttribute('data-add'), i;
      if (d) { day = d; $('pcb').innerHTML = body(); }
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
