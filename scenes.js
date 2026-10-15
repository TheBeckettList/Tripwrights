/* Tripwrights scenes, all in the universe kit (art/josie.js + art/world.js, synced from utilatarian/art):
   home()      the home port: a lodge on a grassy bluff with the globe by the fire, the helicopter on the lawn, a seaplane at the float
               dock and one adventure yacht per region at the pier. Anywhere your heart is. 1000 x 1800.
   region(id)  a region's sea: its islands in our style, and its yacht drawn huge, every station on deck an activity. 1000 x 1700.
   island(id)  one island: its real places as their simplified selves, plots for the next shops. 1000 x 1100.
   Plain ES5. */
(function (w) {
  'use strict';
  var U = w.UART, J = w.UJ, C = J.C, r = J.r, at = J.at, TW = w.TW, TP = U.palettes.places.tripwrights.light, P = 'tw';
  var TC = {
    accent: TP.accent, deep: TP.edge, soft: TP.soft, pale: TP.wash, pop: TP.pop, tank: TP.accent, tank2: '#F2F2EE',
    wallTop: TP.soft, shutter: TP.accent, wainscot: TP.wash, wainscotLine: '#C2DCEA', wallCream: '#FFFFFF', wallBase: '#E3EAF0',
    whiteWood: '#FBFAF7', whiteLine: '#E3E7EA', tile: '#F2F5F7', tile2: '#E3EDF3', wall: '#FFFFFF', wallEdge: '#D9E2E8'
  };
  var yachts = {};
  function yacht(id) { if (!yachts[id]) { yachts[id] = J.yacht(P, TW.REGIONS[id].c, id); } return yachts[id]; }
  function whole(id) { var y = yacht(id), k, h = y.base; for (k in y.parts) { h += y.parts[k].m; } return h; }

  function obj(k, label, aria, ring, inner, tagX, tagY) {
    return '<g class="obj" tabindex="0" role="button" aria-label="' + aria + '" data-k="' + k + '"><rect class="ring" x="' + ring[0] + '" y="' + ring[1] + '" width="' + ring[2] + '" height="' + ring[3] + '" rx="30"/><g class="lift">' + inner + '</g>' +
      (label ? '<text class="tag" x="' + tagX + '" y="' + tagY + '" text-anchor="middle">' + label + '</text>' : '') + '</g>';
  }
  function soon(x, y, col) { return '<g transform="translate(' + x + ',' + y + ')" pointer-events="none"><rect x="-30" y="-14" width="60" height="28" rx="14" fill="#FFFFFF"/><text y="6" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="16" fill="' + col + '">soon</text></g>'; }
  function scaleAround(cx, cy, s, m) { return '<g transform="translate(' + cx + ',' + cy + ') scale(' + s + ') translate(' + (-cx) + ',' + (-cy) + ')">' + m + '</g>'; }

  /* ---------------- home port ---------------- */
  function home() {
    var h = J.defs(P, TC), i;
    h += J.sea(0, 0, 1000, 1800, 5);
    /* the bluff: foam, wet sand, beach, then the lawn with its own little ledge */
    var shore = 'M0,0 H1000 V860 C900,900 820,930 700,930 C600,930 560,990 470,1010 C360,1036 240,1000 140,1020 C80,1032 30,1060 0,1080 Z';
    h += '<path d="' + shore + '" fill="' + C.foam + '" transform="translate(0,26)"/><path d="' + shore + '" fill="' + C.wetSand + '" transform="translate(0,13)"/><path d="' + shore + '" fill="' + C.sand + '"/>';
    var lawn = 'M0,0 H1000 V760 C880,800 760,820 650,800 C530,780 440,840 320,850 C210,860 100,850 0,880 Z';
    h += '<path d="' + lawn + '" fill="' + C.grassDk + '" transform="translate(0,12)"/><path d="' + lawn + '" fill="' + C.grass + '"/>';
    /* the path from the terrace steps down to the pier */
    h += '<path d="M375,790 C380,860 470,880 520,930 C545,955 560,975 565,1000" stroke="' + C.wetSand + '" stroke-width="66" fill="none" stroke-linecap="round"/><path d="M375,786 C380,856 470,876 520,926 C545,951 560,971 565,996" stroke="' + C.sand + '" stroke-width="56" fill="none" stroke-linecap="round"/>';
    for (i = 0; i < 5; i++) { h += '<circle cx="' + (392 + i * 36) + '" cy="' + (820 + i * 34) + '" r="5" fill="' + C.woodFront + '" opacity=".35"/>'; }
    /* trees and rocks round the edges */
    h += J.tree(940, 660, .38) + J.tree(60, 740, .34) + J.tree(960, 90, .3) + J.palm(120, 960, .5) + J.palm(880, 920, .46) + J.palm(700, 960, .36);
    h += J.rock(40, 1090, .55, 2) + J.rock(950, 950, .5, 3) + J.rock(660, 1010, .35, 4) + J.crab(300, 990) + J.crab(830, 990);

    /* the helicopter on the lawn: cover and insurance, later */
    h += J.helipad(810, 230, 118, TC) + J.windsock(950, 400);
    h += obj('heli', 'Cover', 'Helicopter on the lawn: travel and dive cover', [690, 110, 240, 260], at(810, 226, 10, .78, J.heli(TC)), 810, 400);

    /* the lodge, cut away: hearth on the back wall, books, gear drying, the globe on the rug between two armchairs, the cat */
    var X = 60, Y = 110, Wd = 600, Ht = 500;
    h += J.room(X, Y, Wd, Ht, 'url(#' + P + '-plank)', TC, { bottom: [X + Wd / 2 - 46, X + Wd / 2 + 46] }) + J.backWall(P, X, Y, Wd, TC, [X + 20, X + Wd - 156]);
    h += scaleAround(X + Wd / 2, Y + 108, .78, J.hearth(X + Wd / 2, Y + 108));
    h += J.lamp(X + 190, Y + 96, 18) + J.lamp(X + Wd - 190, Y + 96, 18);
    h += J.bookshelf(X + 16, Y + 222, 116, 112) + J.plant(X + 34, Y + Ht - 12, .7);
    h += r(X + Wd - 136, Y + 112, 118, 6, C.woodDark, 3) + J.wetsuit(X + Wd - 112, Y + 118, C.gear, TC.accent) + J.wetsuit(X + Wd - 64, Y + 118, TC.accent, TC.soft) + J.surfboard(X + Wd - 40, Y + 330, TC.soft, 6) + J.fins(X + Wd - 96, Y + 336, C.gear, TC.accent);
    h += J.rug(X + Wd / 2, Y + 360, 190, 100, TC) + J.armchair(X + 150, Y + 420, TC.accent, TC.soft) + J.armchair(X + Wd - 150, Y + 420, '#E9735C', '#F5B8A8') + J.cat(X + Wd / 2 - 110, Y + 440);
    h += J.plant(X + Wd - 34, Y + Ht - 12, .7) + r(X + 160, Y + Ht - 34, 120, 26, C.woodFront, 8) + r(X + 160, Y + Ht - 40, 120, 26, C.wood, 8) + J.pot(X + 220, Y + Ht - 30);
    h += obj('globe', 'The globe', 'The globe: where do you want to go', [X + Wd / 2 - 110, Y + 200, 220, 230], J.globe(X + Wd / 2, Y + 400, 82, TC), X + Wd / 2, Y + 450);

    /* the terrace: white deck, an umbrella, loungers, the telescope, string lights, lanterns */
    var TY = Y + Ht + 20;
    h += J.block(X + 30, TY, Wd - 60, 130, 'url(#' + P + '-white)', C.postEdge, 14, 18) + J.lights(X + 40, TY - 6, X + Wd - 40, TY - 6, 16, 8);
    h += J.umbrella(X + 140, TY + 64, 54, TC.accent, '#FFFFFF') + J.lounger(X + 220, TY + 24, TC.soft) + J.lounger(X + 290, TY + 24, TC.accent) + J.telescope(X + Wd - 110, TY + 104, TC.pop) + J.lantern(X + 60, TY + 116, .8) + J.lantern(X + Wd - 60, TY + 116, .8) + J.plant(X + Wd - 190, TY + 112, .55);

    /* the seaplane at its float dock */
    h += J.pier(P, 40, 1040, 190, 44, false);
    h += obj('plane', 'Seaplane', 'Seaplane: hop straight to an island', [60, 1100, 270, 230], at(170, 1210, -8, .52, J.floatplane(TC)), 175, 1340);

    /* the pier and the yachts, one per region */
    h += J.pier(P, 530, 990, 72, 760, true) + J.pelican(528, 1110);
    TW.ORDER.forEach(function (id, k) {
      var rg = TW.REGIONS[id], x = k ? 760 : 375, y = 1360;
      h += obj('region:' + id, rg.name, rg.name + ' yacht: ' + rg.blurb, [x - 90, y - 190, 180, 400], '<g class="bob">' + at(x, y, 0, .33, whole(id)) + '</g>', x, y + 238);
      if (!rg.live) { h += soon(x + 60, y - 168, rg.c.deep); }
    });
    /* under the water */
    h += J.reef(900, 1660, 130, 60, 3) + J.turtle(250, 1620, 1.1, 20) + at(920, 1180, 0, 1, J.jelly(1.2)) + at(120, 1500, 0, 1, J.jelly(1, '#CDBDE6')) + at(380, 1740, -6, 1, J.whale(1));
    return h;
  }

  /* ---------------- a region: its islands and its yacht ---------------- */
  function isle(rg, isl) {
    var h = '<g transform="translate(' + isl.x + ',' + isl.y + ') rotate(' + isl.rot + ')">' + J.land(0, 0, isl.rx, isl.ry, isl.seed, .14) +
      '<path d="' + J.blob(0, -isl.ry * .1, isl.rx * .72, isl.ry * .55, isl.seed + 2, .2) + '" fill="' + C.grass + '" opacity=".6"/>' +
      J.palm(-isl.rx * .45, -isl.ry * .1, .26) + J.palm(isl.rx * .35, isl.ry * .05, .22) + (isl.rx > 80 ? J.tree(0, -isl.ry * .15, .2) : '') + '</g>';
    var places = TW.PLACES[isl.id] || [], i;
    for (i = 0; i < places.length; i++) { var pal = U.palettes.places[places[i].pal].light; h += J.pin(isl.x - 40 + i * 70, isl.y - 14 + i * 6, pal.accent); }
    return obj('isle:' + isl.id, isl.name, isl.name + (isl.live ? ': open the island' : ': coming soon'), [isl.x - isl.rx - 20, isl.y - isl.ry - 40, isl.rx * 2 + 40, isl.ry * 2 + 80], h, isl.x, isl.y + isl.ry + 58) +
      (isl.live ? '' : soon(isl.x + isl.rx * .6, isl.y - isl.ry - 20, rg.c.deep));
  }
  function region(id) {
    var rg = TW.REGIONS[id], y = yacht(id), h = J.defs(P, TC) + J.sea(0, 0, 1000, 1700, 9), k, part, S = .9, YX = 500, YY = 1100;
    h += J.reef(120, 560, 90, 50, 5) + J.reef(900, 760, 80, 110, 6) + J.reef(110, 1500, 80, 120, 8) + at(880, 1500, 0, 1, J.jelly(1.2)) + J.turtle(140, 1000, 1, -20) + at(860, 1640, -8, 1, J.whale(.9));
    rg.islands.forEach(function (isl) { h += isle(rg, isl); });
    /* the yacht, huge, every station a button */
    h += '<g transform="translate(' + YX + ',' + YY + ') scale(' + S + ')">' + y.base;
    for (k in y.parts) { part = y.parts[k]; h += obj('act:' + k, TW.ACTS[k].name, TW.ACTS[k].name + ' aboard: ' + TW.ACTS[k].line, part.box, part.m, part.tag[0], part.tag[1]); }
    return h + '</g>';
  }

  /* ---------------- an island ---------------- */
  function island(id) {
    var isl = TW.island(id), rg = TW.REGIONS[isl.region], A = U.palettes.areas[id], ac = A ? A.light.accent : rg.c.accent, places = TW.PLACES[id] || [], byId = {}, h = J.defs(P, TC) + J.sea(0, 0, 1000, 1100, 9);
    places.forEach(function (q) { byId[q.id] = q; });
    h += J.reef(150, 880, 150, 60, 3) + J.reef(870, 860, 110, 80, 9) + J.reef(90, 330, 80, 120, 5) + J.reef(920, 220, 70, 90, 6);
    h += J.land(500, 380, 430, 228, isl.seed, .1) + '<path d="' + J.blob(500, 320, 320, 140, isl.seed + 3, .16) + '" fill="' + C.grass + '" opacity=".45"/>';
    h += J.palm(470, 200, .5) + J.palm(150, 370, .4) + J.palm(860, 330, .42) + J.tree(640, 230, .32) + J.tree(310, 250, .3) + J.rock(110, 470, .45, 4) + J.rock(900, 480, .4, 6) + J.crab(600, 600);
    if (id === 'utila') {
      /* the bay: a bite out of the south shore */
      h += '<path d="' + J.blob(515, 560, 178, 152, 21, .1) + '" fill="' + C.wetSand + '"/><path d="' + J.blob(515, 562, 164, 140, 21, .1) + '" fill="' + C.foam + '"/><path d="' + J.blob(515, 565, 150, 128, 21, .1) + '" fill="' + C.water + '"/><path d="' + J.blob(515, 720, 110, 110, 23, .08) + '" fill="' + C.water + '"/>' + J.dash(470, 610, 60) + J.dash(540, 680, 50);
      [[300, 150, '#F5B5C8', '#E98AA5'], [370, 128, '#F2A66B', '#D98A4E'], [560, 128, '#9CCBE6', '#6FA9CC'], [630, 150, '#F5B5C8', '#E98AA5'], [700, 172, '#EAD9C5', '#D3BFA8'], [230, 190, '#9CCBE6', '#6FA9CC']].forEach(function (c) { h += J.house(c[0] - 22, c[1] - 20, 44, c[2], c[3]); });
      var JS = byId['josies-cafe'], PD = byId.paradise, PC = U.paradise ? U.paradise.colors : { accent: '#3E86B8', soft: '#BFE0F2', tank: '#3E86B8', tank2: '#F2F2EE', wallTop: '#9CCBE6' };
      if (JS) { h += obj('place:josies-cafe', JS.name, JS.name + ': plan this stop', [JS.x - 140, JS.y - 110, 260, 230], at(JS.x, JS.y, 0, .72, J.mini.josies(P)), JS.x - 10, JS.y + 136); }
      if (PD) { h += obj('place:paradise', PD.name, PD.name + ': plan this stop', [PD.x - 120, PD.y - 130, 240, 320], at(PD.x, PD.y, 0, .72, J.mini.paradise(P, PC)), PD.x, PD.y - 124); }
      h += J.plot(515, 290, ac);
    } else {
      h += J.pier(P, 520, 590, 60, 170, true) + J.plot(350, 440, ac) + J.plot(660, 380, ac);
    }
    return h;
  }
  /* the region's yacht, small, for arriving at an island (the page moves it) */
  function boat(regionId) { return at(0, 0, 0, .17, whole(regionId)); }

  w.TW.scenes = { home: home, region: region, island: island, boat: boat, DOCK: [500, 660], colors: TC };
})(window);
