/* The globe: a simplified real Earth (Natural Earth 110m, art/land.js) drawn in the island style — sea, green land with a sand
   beach edge, the ball's front face as a darker ledge, clouds — with the regions we sail to lit up in their own colors.
   Drag to spin; tap a region to sail there. Orthographic projection, points behind the horizon are pulled onto it. Plain ES5. */
(function (w) {
  'use strict';
  var J = w.UJ, C = J.C, R = 420, D2R = Math.PI / 180;
  var G = w.TW.globe = {};
  var svg, onPick, lam = 60, phi = 14, raf = null, dragging = false, moved = 0, auto = true, lastT = 0, reduce = false;

  function proj(lon, lat) {
    var l = (lon + lam) * D2R, p = lat * D2R, p0 = phi * D2R, cp = Math.cos(p);
    var x = cp * Math.sin(l), y = -(Math.cos(p0) * Math.sin(p) - Math.sin(p0) * cp * Math.cos(l)), z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * cp * Math.cos(l);
    if (z < 0) { var n = Math.sqrt(x * x + y * y) || 1; x /= n; y /= n; }
    return [x * R, y * R, z];
  }
  function landPath() {
    var d = '', i, j, ring, pt, vis, s;
    for (i = 0; i < w.TW_LAND.length; i++) {
      ring = w.TW_LAND[i]; vis = false; s = '';
      for (j = 0; j < ring.length; j += 2) { pt = proj(ring[j], ring[j + 1]); if (pt[2] > 0) { vis = true; } s += (j ? 'L' : 'M') + pt[0].toFixed(1) + ',' + pt[1].toFixed(1); }
      if (vis) { d += s + 'Z'; }
    }
    return d;
  }
  function clouds() {
    return '<g class="clouds" pointer-events="none">' + [[-300, -260, 1], [250, -330, .8], [330, 150, 1.1], [-360, 220, .9], [40, 360, .7]].map(function (c) {
      return '<g class="cloud" transform="translate(' + c[0] + ',' + c[1] + ') scale(' + c[2] + ')"><ellipse cx="6" cy="10" rx="64" ry="14" fill="' + C.plum + '" opacity=".08"/><ellipse cx="-28" cy="0" rx="34" ry="22" fill="#FFFFFF"/><ellipse cx="14" cy="-10" rx="40" ry="30" fill="#FFFFFF"/><ellipse cx="48" cy="2" rx="28" ry="20" fill="#FFFFFF"/></g>';
    }).join('') + '</g>';
  }
  function regions() {
    var h = '', id, rg, p, k = w.TW.ORDER, i;
    for (i = 0; i < k.length; i++) {
      id = k[i]; rg = w.TW.REGIONS[id]; p = proj(rg.lon, rg.lat);
      if (p[2] < .15) { continue; }
      var s = .6 + p[2] * .4, lw = (rg.name + (rg.live ? '' : ' · soon')).length * 19 + 56;
      h += '<g class="obj region" tabindex="0" role="button" aria-label="' + rg.name + ': sail there" data-r="' + id + '" transform="translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ') scale(' + s.toFixed(2) + ')">' +
        '<circle r="64" fill="' + rg.c.accent + '" opacity=".28"/><circle r="40" fill="' + rg.c.accent + '" opacity=".35"/>' +
        J.pin(0, -30, rg.c.accent) +
        '<g transform="translate(0,34)"><rect x="' + (-lw / 2) + '" y="-2" width="' + lw + '" height="58" rx="29" fill="' + rg.c.deep + '"/><rect x="' + (-lw / 2) + '" y="-8" width="' + lw + '" height="58" rx="29" fill="#FFFFFF"/>' +
        '<text y="31" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="34" fill="' + rg.c.deep + '">' + rg.name + (rg.live ? '' : ' · soon') + '</text></g></g>';
    }
    return h;
  }
  function draw() {
    if (!svg) { return; }
    var land = landPath();
    svg.innerHTML =
      '<ellipse cx="20" cy="' + (R + 40) + '" rx="' + (R * .8) + '" ry="34" fill="' + C.plum + '" opacity=".12"/>' +
      '<circle cx="0" cy="16" r="' + R + '" fill="' + C.deep + '"/><circle r="' + R + '" fill="' + C.water + '"/>' +
      '<clipPath id="gclip"><circle r="' + R + '"/></clipPath><g clip-path="url(#gclip)">' +
      '<path d="' + land + '" fill="' + C.wetSand + '" transform="translate(0,5)"/><path d="' + land + '" fill="' + C.grass + '" stroke="' + C.sand + '" stroke-width="7" stroke-linejoin="round"/>' +
      '<path d="M' + (-R) + ',0a' + R + ',' + R + ' 0 1 0 ' + (2 * R) + ',0a' + R + ',' + R + ' 0 1 0 ' + (-2 * R) + ',0Z M' + (-R * 1.3) + ',' + (-R * .28) + 'a' + (R * 1.06) + ',' + (R * 1.06) + ' 0 1 0 ' + (2.12 * R) + ',0a' + (R * 1.06) + ',' + (R * 1.06) + ' 0 1 0 ' + (-2.12 * R) + ',0Z" fill="' + C.plum + '" fill-rule="evenodd" opacity=".09"/>' +
      '<ellipse cx="' + (-R * .42) + '" cy="' + (-R * .48) + '" rx="' + (R * .2) + '" ry="' + (R * .1) + '" fill="#FFFFFF" opacity=".35" transform="rotate(-35 ' + (-R * .42) + ' ' + (-R * .48) + ')"/></g>' +
      regions() + clouds();
  }
  function tick(t) {
    raf = null;
    if (auto && !dragging && !reduce) { lam += Math.min(50, t - (lastT || t)) * .006; draw(); }
    lastT = t; if (auto && !reduce) { raf = w.requestAnimationFrame(tick); }
  }
  /* spin so a region faces you, then call back */
  function turnTo(rg, done) {
    auto = false; var l0 = lam, p0 = phi, l1 = -rg.lon, p1 = Math.max(-30, Math.min(30, rg.lat)) * .6, t0 = null, dl = ((l1 - l0 + 540) % 360) - 180;
    if (reduce) { lam = l1; phi = p1; draw(); done(); return; }
    function step(t) { if (t0 === null) { t0 = t; } var k = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - k, 3); lam = l0 + dl * e; phi = p0 + (p1 - p0) * e; draw(); if (k < 1) { w.requestAnimationFrame(step); } else { setTimeout(done, 180); } }
    w.requestAnimationFrame(step);
  }

  G.mount = function (el, pick) {
    svg = el; onPick = pick; reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sx, sy, l0, p0;
    function pt(e) { return e.touches ? e.touches[0] : e; }
    function down(e) { var q = pt(e); dragging = true; moved = 0; sx = q.clientX; sy = q.clientY; l0 = lam; p0 = phi; auto = false; }
    function move(e) { if (!dragging) { return; } var q = pt(e), k = 360 / Math.max(300, el.clientWidth * 1.2); moved = Math.abs(q.clientX - sx) + Math.abs(q.clientY - sy); lam = l0 + (q.clientX - sx) * k; phi = Math.max(-60, Math.min(60, p0 + (q.clientY - sy) * k)); draw(); if (moved > 6 && e.cancelable) { e.preventDefault(); } }
    function up() { dragging = false; }
    el.addEventListener('mousedown', down); w.addEventListener('mousemove', move); w.addEventListener('mouseup', up);
    el.addEventListener('touchstart', down, { passive: true }); el.addEventListener('touchmove', move, { passive: false }); el.addEventListener('touchend', up);
    function choose(n) { while (n && n !== el) { if (n.getAttribute && n.getAttribute('data-r')) { var id = n.getAttribute('data-r'); turnTo(w.TW.REGIONS[id], function () { onPick(id); }); return; } n = n.parentNode; } }
    el.addEventListener('click', function (e) { if (moved > 6) { return; } choose(e.target); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(e.target); } });
  };
  G.show = function () { auto = true; lastT = 0; draw(); if (!raf && !reduce) { raf = w.requestAnimationFrame(tick); } };
  G.hide = function () { auto = false; if (raf) { w.cancelAnimationFrame(raf); raf = null; } };
  G.focus = function (id) { var rg = w.TW.REGIONS[id]; lam = -rg.lon; phi = rg.lat * .6; draw(); };
})(window);
