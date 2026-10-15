/* Tripwrights app: home port -> the globe -> a region (its yacht and islands) -> an island -> a place, added to your plan.
   Routes: #  (home), #globe, #r/<region>, #i/<island>. Prototype: sample hours, the plan is kept on this device. Plain ES5. */
(function () {
  'use strict';
  var U = UART, TW = window.TW, S = TW.scenes, scene = document.getElementById('scene'), sheet = document.getElementById('sheet'), veil = document.getElementById('veil'),
    $ = function (id) { return document.getElementById(id); }, last = null, view = { kind: 'home' }, boatAt = 'away', boatTimer = null, toastTimer = null;

  var DAY = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], DAYL = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
  var BLOCK = { m: ['Morning', 360, 720], a: ['Afternoon', 720, 1020], e: ['Evening', 1020, 1380] };
  var byId = {}; Object.keys(TW.PLACES).forEach(function (a) { TW.PLACES[a].forEach(function (p) { p.island = a; byId[p.id] = p; }); });

  /* plan: [{id, day, block}], kept on the device */
  var plan = []; try { plan = JSON.parse(localStorage.getItem('tw-plan') || '[]'); } catch (e) { plan = []; }
  plan = plan.filter(function (x) { return byId[x.id]; });
  var day = 'sat', showDays = false;
  /* the diver's card: a level on the shared ladder and the agency that issued it */
  var LADDER = ['none', 'ow', 'aow', 'rescue', 'pro'], LN = { none: 'No card', ow: 'Open Water', aow: 'Advanced', rescue: 'Rescue', pro: 'Divemaster+' };
  var cert = { level: 'none', agency: 'SSI' }; try { cert = JSON.parse(localStorage.getItem('tw-cert')) || cert; } catch (e) { }
  function saveCert() { try { localStorage.setItem('tw-cert', JSON.stringify(cert)); } catch (e) { } }
  function save() { try { localStorage.setItem('tw-plan', JSON.stringify(plan)); } catch (e) { } $('pn').textContent = plan.length; }
  function mins(s) { var a = s.split(':'); return +a[0] * 60 + +a[1]; }
  function clock(s) { var a = s.split(':'), h = +a[0]; return (h % 12 || 12) + (a[1] === '00' ? '' : ':' + a[1]) + (h >= 12 ? 'pm' : 'am'); }
  function openIn(p, d, b) { var v = p.hours[d]; if (v === 'closed') { return false; } var r = v.split('-'); return mins(r[0]) < BLOCK[b][2] && mins(r[1]) > BLOCK[b][1]; }
  function has(id, d, b) { return plan.some(function (x) { return x.id === id && x.day === d && x.block === b; }); }

  function toast(t, ms) { var el = $('toast'); el.textContent = t; el.classList.remove('off'); clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.add('off'); }, ms || 4200); }
  function openSheet(t, l, html) { $('st').textContent = t; $('sl').textContent = l || ''; $('sb').innerHTML = html; sheet.classList.add('on'); veil.classList.add('on'); sheet.setAttribute('aria-hidden', 'false'); $('close').focus(); }
  function shut() { sheet.classList.remove('on'); veil.classList.remove('on'); sheet.setAttribute('aria-hidden', 'true'); if (last && last.focus) { last.focus(); } }

  /* ---------- views ---------- */
  function setView(v, box, html, sub, back) {
    view = v; boatAt = 'away'; $('cap').style.background = v.kind === 'home' ? '#9CC48A' : '#5DB7D2'; scene.setAttribute('viewBox', box); scene.innerHTML = html; $('sub').textContent = sub || '';
    $('back').hidden = !back; if (back) { $('backl').textContent = back; }
    window.scrollTo(0, 0);
  }
  function showHome() {
    setView({ kind: 'home' }, '0 0 1000 1800', S.home(), '', null);
    scene.setAttribute('aria-label', 'Home port: a lodge on a bluff with the globe by the fire, a helicopter on the lawn, a seaplane and a yacht for each region at the pier.');
    toast('Tap the globe by the fire, or board a yacht at the pier.');
  }
  function showRegion(id) {
    var rg = TW.REGIONS[id];
    setView({ kind: 'region', id: id }, '0 0 1000 1700', S.region(id), rg.name, 'Home');
    scene.setAttribute('aria-label', rg.name + ': its islands, and its yacht with every activity on deck.');
    toast(rg.live ? 'Tap something on deck to see who offers it, or tap an island.' : rg.name + ' is coming. Have a look around the yacht.');
  }
  function showIsland(id) {
    var isl = TW.island(id), rg = TW.REGIONS[isl.region];
    setView({ kind: 'island', id: id, region: isl.region }, '0 0 1000 1100', S.island(id) + '<g id="arrive" class="arrive" style="transform:translate(' + S.DOCK[0] + 'px,1300px)">' + S.boat(isl.region) + '</g>', isl.name, rg.name);
    scene.setAttribute('aria-label', isl.name + ': its places, drawn as themselves.');
    setTimeout(function () { var b = $('arrive'); if (b) { b.style.transform = 'translate(' + S.DOCK[0] + 'px,1000px)'; } }, 60);
    if (isl.live) { toast('Tap a place to sail up to it.'); }
    else { toast(isl.name + ' fills in as shops join.'); openSheet(isl.name, rg.sub, '<div class="item"><b>Coming</b><span class="where">No shops on the map here yet. The flags are where the first ones go.</span></div><p class="note">Utila is open now.</p><button class="btn" data-isle="utila">Go to Utila</button>'); }
  }
  function openGlobe() { $('globe').classList.add('on'); $('globe').setAttribute('aria-hidden', 'false'); TW.globe.show(); if (location.hash !== '#globe') { history.pushState(null, '', '#globe'); } }
  function closeGlobe() { $('globe').classList.remove('on'); $('globe').setAttribute('aria-hidden', 'true'); TW.globe.hide(); }

  function route() {
    var h = location.hash.slice(1);
    if (h === 'globe') { if (view.kind !== 'home') { showHome(); } openGlobe(); return; }
    closeGlobe(); shut();
    if (h.indexOf('r/') === 0 && TW.REGIONS[h.slice(2)]) { showRegion(h.slice(2)); }
    else if (h.indexOf('i/') === 0 && TW.island(h.slice(2))) { showIsland(h.slice(2)); }
    else { showHome(); }
  }
  function go(hash) { if (location.hash === hash || (hash === '#' && !location.hash)) { route(); } else { location.hash = hash; } }

  /* ---------- sheets ---------- */
  function certBlock(p) {
    if (!p.offers) { return ''; }
    return '<p class="where" style="margin:12px 0 2px"><b>Your card</b></p><div class="days">' + LADDER.map(function (l) { return '<button data-cert="' + l + '" class="' + (cert.level === l ? 'on' : '') + '">' + LN[l] + '</button>'; }).join('') + '</div>' +
      (cert.level === 'none' ? '' : '<div class="days">' + ['SSI', 'PADI', 'Other'].map(function (g) { return '<button data-agency="' + g + '" class="' + (cert.agency === g ? 'on' : '') + '">' + g + '</button>'; }).join('') + '</div>') +
      p.offers.map(function (o) {
        var ok = LADDER.indexOf(cert.level) >= LADDER.indexOf(o.needs), done = o.needs === 'none' && o.name === 'Open Water' && LADDER.indexOf(cert.level) >= 1;
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-top:1px solid var(--line)"><span><b>' + o.name + '</b>' + (o.days ? ' <span class="where">· ' + o.days + ' days</span>' : '') + (o.agencies[0] !== 'any' ? ' <span class="where">· ' + o.agencies.join(' or ') + '</span>' : '') + '</span>' +
          '<span class="chip ' + (done ? 'off' : ok ? 'ok' : 'soon') + '">' + (done ? 'have it' : ok ? 'ready' : 'needs ' + LN[o.needs]) + '</span></div>';
      }).join('');
  }
  function placeSheet(p) {
    showDays = false;
    var today;
    function body() {
      today = p.hours[day];
      var rows = ['m', 'a', 'e'].map(function (b) {
        var ok = openIn(p, day, b), on = has(p.id, day, b);
        return ok ? '<button class="btn add' + (on ? ' done' : '') + '" data-add="' + b + '">' + (on ? '✓ ' : '+ ') + BLOCK[b][0] + '</button>' : '<span class="chip off" style="margin-right:6px">' + BLOCK[b][0] + '</span>';
      }).join('');
      return '<p class="where" style="margin:10px 0 2px"><b>' + DAYL[day] + '</b> · ' + (today === 'closed' ? 'closed' : clock(today.split('-')[0]) + ' – ' + clock(today.split('-')[1])) + ' <button class="pill" data-showdays="1" style="min-height:32px;padding:0 12px;font-size:13px;box-shadow:inset 0 0 0 2px var(--soft)">change day</button></p>' +
        (showDays ? '<div class="days">' + DAY.map(function (d) { return '<button data-day="' + d + '" class="' + (d === day ? 'on' : '') + '">' + DAYL[d] + '</button>'; }).join('') + '</div>' : '') + rows + certBlock(p);
    }
    var h = '<div data-place="' + p.pal + '" class="pcard" id="pc"><b style="font-family:var(--u-display);font-size:20px">' + p.kind + ' · ' + p.name + '</b><p style="margin:4px 0 0;color:var(--ink2)">' + p.blurb + '</p><div id="pcb">' + body() + '</div></div>';
    openSheet(p.name, p.offers ? 'Courses and dives match your card, SSI or PADI.' : 'In its own colors, open when it is really open.', h);
    $('pc').onclick = function (e) {
      var t = e.target, d = t.getAttribute('data-day'), b = t.getAttribute('data-add');
      if (t.getAttribute('data-showdays')) { showDays = !showDays; $('pcb').innerHTML = body(); }
      if (d) { day = d; showDays = false; $('pcb').innerHTML = body(); }
      if (t.getAttribute('data-cert')) { cert.level = t.getAttribute('data-cert'); saveCert(); $('pcb').innerHTML = body(); }
      if (t.getAttribute('data-agency')) { cert.agency = t.getAttribute('data-agency'); saveCert(); $('pcb').innerHTML = body(); }
      if (b) { if (has(p.id, day, b)) { plan = plan.filter(function (x) { return !(x.id === p.id && x.day === day && x.block === b); }); } else { plan.push({ id: p.id, day: day, block: b }); } save(); $('pcb').innerHTML = body(); }
    };
  }
  /* an activity on the yacht: who offers it across this region's islands */
  function actSheet(regionId, k) {
    var rg = TW.REGIONS[regionId], a = TW.ACTS[k], rows = '';
    rg.islands.forEach(function (isl) {
      (TW.PLACES[isl.id] || []).forEach(function (p) { if (p.acts.indexOf(k) > -1) { rows += '<button class="item" data-place="' + p.id + '"><b>' + p.name + '</b><span class="where">' + isl.name + ' · ' + p.kind + '</span></button>'; } });
    });
    openSheet(a.name, a.line, rows || '<div class="item"><b>No shop on the map for this yet</b><span class="where">' + rg.name + ' fills in as shops join. Places running the Utilitarian POS show up here with their real hours.</span></div>');
  }
  function planSheet() {
    var h = '', any = false;
    DAY.forEach(function (d) {
      var items = plan.filter(function (x) { return x.day === d; });
      if (!items.length) { return; } any = true; h += '<h3 style="font:800 18px var(--u-display);margin:10px 0 2px">' + DAYL[d] + '</h3>';
      ['m', 'a', 'e'].forEach(function (b) { items.filter(function (x) { return x.block === b; }).forEach(function (x) { var p = byId[x.id]; h += '<div data-place="' + p.pal + '" class="pcard" style="padding:8px 14px;margin:6px 0"><b>' + p.name + '</b> <span class="where">' + BLOCK[b][0] + '</span></div>'; }); });
    });
    openSheet('Your plan', any ? 'Saved on this device.' : 'Nothing yet.', any ? h : '<p class="note">Spin the globe, board a yacht, pick something to do.</p><button class="btn" data-globe="1">Open the globe</button>');
  }
  function coverSheet() {
    openSheet('Cover', 'The helicopter is for when things go sideways.', '<div class="item"><b>Travel and dive cover</b><span class="where">Insurance, medical evacuation and dive accident cover, arranged from here for the days you planned.</span><div class="chips"><span class="chip soon">Not available yet</span></div></div><p class="note">Until then, check your own travel insurance covers diving to the depth you plan.</p>');
  }
  function planeSheet() {
    var h = '';
    TW.ORDER.forEach(function (id) {
      var rg = TW.REGIONS[id]; h += '<h3 style="font:800 18px var(--u-display);margin:12px 0 2px">' + rg.name + '</h3>';
      rg.islands.forEach(function (isl) { h += '<button class="item" data-isle="' + isl.id + '"><b>' + isl.name + '</b><span class="where">' + (isl.live ? 'Open now' : 'Coming') + '</span></button>'; });
    });
    openSheet('Seaplane', 'Hop straight to an island.', h);
  }

  /* ---------- taps ---------- */
  function tap(k, el) {
    last = el;
    if (k === 'globe') { openGlobe(); }
    else if (k === 'heli') { coverSheet(); }
    else if (k === 'plane') { planeSheet(); }
    else if (k.indexOf('region:') === 0) { go('#r/' + k.slice(7)); }
    else if (k.indexOf('isle:') === 0) { go('#i/' + k.slice(5)); }
    else if (k.indexOf('act:') === 0) { actSheet(view.id, k.slice(4)); }
    else if (k.indexOf('place:') === 0) {
      var p = byId[k.slice(6)], b = $('arrive'), t = S.DOCK;
      if (boatAt === p.id || !b) { placeSheet(p); return; }
      b.style.transform = 'translate(' + t[0] + 'px,' + (t[1] + 30) + 'px)';
      boatAt = p.id; clearTimeout(boatTimer); boatTimer = setTimeout(function () { placeSheet(p); }, 1300);
    }
  }
  scene.addEventListener('click', function (e) { var n = e.target; while (n && n !== scene) { if (n.getAttribute && n.getAttribute('data-k')) { tap(n.getAttribute('data-k'), n); return; } n = n.parentNode; } });
  scene.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute && e.target.getAttribute('data-k')) { e.preventDefault(); tap(e.target.getAttribute('data-k'), e.target); } });
  $('sb').addEventListener('click', function (e) {
    var n = e.target; while (n && n !== this && !(n.getAttribute && (n.getAttribute('data-isle') || n.getAttribute('data-place') && n.tagName === 'BUTTON' || n.getAttribute('data-globe')))) { n = n.parentNode; }
    if (!n || n === this) { return; }
    if (n.getAttribute('data-isle')) { shut(); go('#i/' + n.getAttribute('data-isle')); }
    else if (n.getAttribute('data-globe')) { shut(); openGlobe(); }
    else { var p = byId[n.getAttribute('data-place')]; if (p) { placeSheet(p); } }
  });
  TW.globe.mount($('gsvg'), function (id) { go('#r/' + id); });
  $('gclose').addEventListener('click', function () { if (location.hash === '#globe') { history.back(); } else { closeGlobe(); } });
  $('back').addEventListener('click', function () { if (view.kind === 'island') { go('#r/' + view.region); } else { go('#'); } });
  $('brand').addEventListener('click', function () { go('#'); });
  $('planbtn').addEventListener('click', planSheet);
  $('close').addEventListener('click', shut); veil.addEventListener('click', shut);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if ($('globe').classList.contains('on')) { $('gclose').click(); } else { shut(); } } });
  window.addEventListener('hashchange', route);
  save(); route();
})();
