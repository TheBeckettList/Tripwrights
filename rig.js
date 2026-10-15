/* Tripwrights scenes: the sea habitat ("the rig") you start on, and an area's island map. Drawn entirely with the shared universe kit
   (art/josie.js + art/world.js, copied from utilatarian/art): the same white-wood decks, wood posts, plum shadows, tank racks and boats
   as Paradise and Josie's, so Tripwrights is one more place on the same island. Home is 1000 x 1500, an area is 1000 x 1100. Plain ES5. */
(function (w) {
  'use strict';
  var U = w.UART, J = w.UJ, C = J.C, r = J.r, at = J.at, AREAS = U.palettes.areas, TP = U.palettes.places.tripwrights.light;
  var P = 'tw';
  /* Tripwrights' own colors, in the shape every place passes to the kit */
  var TC = {
    accent: TP.accent, deep: TP.edge, soft: TP.soft, pale: TP.wash, pop: TP.pop, tank: TP.accent, tank2: '#F2F2EE',
    wallTop: TP.soft, shutter: TP.accent, wainscot: TP.wash, wainscotLine: '#C2DCEA', wallCream: '#FFFFFF', wallBase: '#E3EAF0',
    whiteWood: '#FBFAF7', whiteLine: '#E3E7EA', tile: '#F2F5F7', tile2: '#E3EDF3', wall: '#FFFFFF', wallEdge: '#D9E2E8'
  };
  function areaColors(id) { var L = AREAS[id].light; return { accent: L.accent, deep: L['accent-deep'], soft: L.soft, pop: L.pop, tank: L.accent, tank2: '#F2F2EE' }; }

  var ORDER = ['utila', 'roatan', 'guanaja', 'kohtao'];
  var SLOTS = { utila: [910, 1000], roatan: [910, 1300], guanaja: [690, 960], kohtao: [690, 1300] };   /* where each area's boat is tied up */
  var BOATSCALE = .7;
  var D = { x: 110, y: 250, w: 500, h: 870 };   /* the platform deck */

  function obj(k, label, aria, ring, inner, tagX, tagY) {
    return '<g class="obj" tabindex="0" role="button" aria-label="' + aria + '" data-k="' + k + '"><rect class="ring" x="' + ring[0] + '" y="' + ring[1] + '" width="' + ring[2] + '" height="' + ring[3] + '" rx="30"/><g class="lift">' + inner + '</g>' +
      (label ? '<text class="tag" x="' + tagX + '" y="' + tagY + '" text-anchor="middle">' + label + '</text>' : '') + '</g>';
  }
  function soon(x, y, col) { return '<g transform="translate(' + x + ',' + y + ')" pointer-events="none"><rect x="-28" y="-13" width="56" height="26" rx="13" fill="#FFFFFF"/><text y="6" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="15" fill="' + col + '">soon</text></g>'; }

  function home() {
    var h = J.defs(P, TC), i, id, a, sl, x0 = D.x, y0 = D.y, x1 = D.x + D.w, y1 = D.y + D.h;
    h += J.sea(0, 0, 1000, 1500, 5);
    h += at(320, 1300, -8, 1, J.whale(1.1)) + at(70, 1180, 0, 1, J.jelly(1.2)) + at(960, 640, 0, 1, J.jelly(1, '#BFE9F0')) + at(560, 1430, 0, 1, J.jelly(1.1)) + at(860, 180, 0, 1, J.jelly(.9, '#CDBDE6'));
    /* England: a chalk cliff with its lighthouse, top left */
    h += J.cliff('M-20,-20 H300 C292,50 262,104 210,140 C150,180 70,192 -20,196Z', 44) + J.tree(200, 40, .32) + J.lighthouse(92, 150, .8) + J.rock(270, 222, .5, 2) + J.rock(40, 262, .4, 3);
    /* the legs, with foam round their feet, under the corners of the deck */
    [[x0 + 24, y0 + 24], [x1 - 24, y0 + 24], [x0 + 24, y1 - 10], [x1 - 24, y1 - 10]].forEach(function (p) { h += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="64" fill="#FFFFFF" opacity=".25"/><circle cx="' + p[0] + '" cy="' + (p[1] + 8) + '" r="54" fill="' + C.steel + '"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="54" fill="' + C.steelLt + '"/>'; });
    /* the deck: steel front face, a pale rim, white-wood planks, the Tripwrights band along the top */
    h += r(x0, y0 + 18, D.w, D.h, C.steel, 40) + r(x0, y0, D.w, D.h, '#EEF2F5', 40) + r(x0 + 14, y0 + 14, D.w - 28, D.h - 28, 'url(#' + P + '-white)', 28) + r(x0 + 14, y0 + 14, D.w - 28, 16, TC.accent, 8);
    h += J.railH(x0 + 40, y0 + 34, D.w - 80) + J.post(x0 + 22, y0 + 30) + J.post(x1 - 44, y0 + 30);

    /* helipad, top left of the deck */
    h += J.helipad(x0 + 180, y0 + 190, 122, TC);
    h += obj('heli', 'Fly', 'Bubble helicopter on the helipad: flights and tours', [x0 + 50, y0 + 60, 260, 270], at(x0 + 180, y0 + 186, 8, .82, J.heli(TC)), x0 + 180, y0 + 352);
    /* the outfitter's deck, top right: tanks, crates, wetsuits drying, a life ring */
    h += J.tankRack(x0 + 340, y0 + 150, [TC.tank, TC.tank2, TC.tank, TC.tank]) + J.crate(x0 + 350, y0 + 190) + J.crate(x0 + 396, y0 + 200, .8) + J.crate(x0 + 360, y0 + 226, .9);
    h += r(x0 + 330, y0 + 262, 130, 6, C.woodDark, 3); for (i = 0; i < 3; i++) { h += J.wetsuit(x0 + 360 + i * 40, y0 + 268, i === 1 ? TC.accent : C.gear, i === 1 ? TC.soft : TC.accent); }
    h += J.lifeRing(x1 - 30, y0 + 120) + J.lantern(x0 + 450, y0 + 120, .8);

    /* the globe hall: a room in Josie's oblique view, back wall with windows, the globe in the middle, the desk, the chart, plants */
    var hx = x0 + 40, hy = y0 + 370, hw = D.w - 80, hh = 300;
    h += J.room(hx, hy, hw, hh, 'url(#' + P + '-tile)', TC, { bottom: [hx + hw / 2 - 40, hx + hw / 2 + 40] }) + J.backWall(P, hx, hy, hw, TC, [hx + 20, hx + hw - 156]);
    h += J.lamp(hx + 70, hy + 96, 16) + J.lamp(hx + hw - 70, hy + 96, 16);
    h += J.counter(hx + 14, hy + 196, 96, 46, '#FFFFFF', TC.accent) + J.screen(hx + 28, hy + 214, TC) + J.board(hx + hw - 104, hy + 120, 90, 56, TC) + J.plant(hx + hw - 30, hy + hh - 12, .7) + J.plant(hx + 30, hy + hh - 12, .6);
    h += obj('globe', 'The globe', 'Giant globe: where do you want to go', [hx + hw / 2 - 110, hy + 96, 220, 210], J.globe(hx + hw / 2, hy + hh - 24, 74, TC), hx + hw / 2, hy + hh + 44);
    h += J.lights(x0 + 30, hy - 30, x1 - 30, hy - 30, 14, 10);

    /* container cabins in each area's color, the garden corner, lanterns */
    for (i = 0; i < ORDER.length; i++) { a = areaColors(ORDER[i]); h += J.container(x0 + 34 + i * 110, y0 + 740, 98, 44, a.accent, a.deep); }
    h += J.lights(x0 + 30, y0 + 720, x1 - 30, y0 + 720, 14, 10);
    h += J.palm(x0 + 70, y1 - 34, .42) + J.plant(x1 - 50, y1 - 28, .7) + J.crate(x1 - 120, y1 - 60) + J.lantern(x0 + 250, y1 - 26, .8) + J.lifeRing(x0 + 40, y0 + 700);

    /* seaplane jetty off the right side */
    h += J.pier(P, x1 - 6, y0 + 160, 170, 52, false);
    h += obj('plane', 'Seaplane', 'Float plane at the jetty: flights between areas', [x1 + 110, y0 + 30, 280, 290], at(x1 + 250, y0 + 180, 0, .62, J.floatplane(TC)), x1 + 250, y0 + 304);

    /* the boat pier: a gangway off the deck, then the long pier with one boat per area */
    h += J.pier(P, x1 - 6, 760, 190, 56, false) + J.pier(P, 760, 760, 70, 700, true);
    for (i = 0; i < ORDER.length; i++) {
      id = ORDER[i]; a = AREAS[id]; sl = SLOTS[id];
      h += obj('boat:' + id, a.name, a.name + ' boat: ' + (a.live ? 'open the area' : 'coming soon'), [sl[0] - 70, sl[1] - 130, 140, 280],
        '<g class="bob">' + at(sl[0], sl[1], 0, BOATSCALE, J.boat(P, a.boat, areaColors(id))) + '</g>', sl[0], sl[1] + 150 + (a.boat === 'longtail' ? 40 : 0));
      if (!a.live) { h += soon(sl[0] + 38, sl[1] - 112, a.light['accent-deep']); }
    }
    return h;
  }

  /* an island: foam, wet sand, sand; a little grass inland; trees, rocks, the town along the north shore */
  function island(seed) {
    var h = J.land(500, 380, 430, 228, seed, .1) + '<path d="' + J.blob(500, 320, 320, 140, seed + 3, .16) + '" fill="' + C.grass + '" opacity=".45"/>';
    h += J.palm(470, 200, .5) + J.palm(150, 370, .4) + J.palm(860, 330, .42) + J.tree(640, 230, .32) + J.tree(310, 250, .3);
    h += J.rock(110, 470, .45, 4) + J.rock(900, 480, .4, 6) + J.rock(940, 410, .3, 8);
    return h;
  }
  function utilaIsland(places) {
    var h = '', byId = {}, ac = AREAS.utila.light.accent;
    places.forEach(function (q) { byId[q.id] = q; });
    h += J.reef(150, 880, 150, 60, 3) + J.reef(870, 860, 110, 80, 9) + J.reef(90, 330, 80, 120, 5) + J.reef(920, 220, 70, 90, 6);
    h += island(11);
    /* the bay: a bite out of the south shore, sand rim to foam to water */
    h += '<path d="' + J.blob(515, 560, 178, 152, 21, .1) + '" fill="' + C.wetSand + '"/><path d="' + J.blob(515, 562, 164, 140, 21, .1) + '" fill="' + C.foam + '"/><path d="' + J.blob(515, 565, 150, 128, 21, .1) + '" fill="' + C.water + '"/><path d="' + J.blob(515, 720, 110, 110, 23, .08) + '" fill="' + C.water + '"/>' + J.dash(470, 610, 60) + J.dash(540, 680, 50);
    /* the town along the north shore */
    [[300, 150, '#F5B5C8', '#E98AA5'], [370, 128, '#F2A66B', '#D98A4E'], [560, 128, '#9CCBE6', '#6FA9CC'], [630, 150, '#F5B5C8', '#E98AA5'], [700, 172, '#EAD9C5', '#D3BFA8'], [230, 190, '#9CCBE6', '#6FA9CC']].forEach(function (c) { h += J.house(c[0] - 22, c[1] - 20, 44, c[2], c[3]); });
    /* the places, as their own simplified selves, both on the bay shore */
    var JS = byId['josies-cafe'], PD = byId.paradise, PC = U.paradise ? U.paradise.colors : { accent: '#3E86B8', soft: '#BFE0F2', tank: '#3E86B8', tank2: '#F2F2EE', wallTop: '#9CCBE6' };
    if (JS) { h += obj('place:josies-cafe', JS.name, JS.name + ': plan this stop', [JS.x - 140, JS.y - 110, 260, 230], at(JS.x, JS.y, 0, .72, J.mini.josies(P)), JS.x - 10, JS.y + 136); }
    if (PD) { h += obj('place:paradise', PD.name, PD.name + ': plan this stop', [PD.x - 120, PD.y - 130, 240, 320], at(PD.x, PD.y, 0, .72, J.mini.paradise(P, PC)), PD.x, PD.y - 124); }
    h += J.plot(515, 290, ac);
    return h;
  }
  /* an island map: the area's own island, its participating places drawn as themselves, plots waiting for more */
  function area(id, places) {
    var h = J.defs(P, TC) + J.sea(0, 0, 1000, 1100, 9);
    if (id === 'utila') { return h + utilaIsland(places); }
    var L = AREAS[id].light;
    h += J.reef(260, 880, 140, 60, 3) + J.reef(860, 760, 110, 80, 9) + J.reef(120, 300, 90, 120, 5) + island(id.length * 3 + 2);
    h += J.pier(P, 520, 600, 60, 170, true) + J.plot(350, 470, L.accent) + J.plot(660, 400, L.accent);
    return h;
  }
  /* the arriving boat: bow up, scaled; the page moves it with a CSS transform */
  function boat(id) { var a = AREAS[id]; return at(0, 0, 0, .6, J.boat(P, a.boat, areaColors(id))); }

  U.rig = { home: home, area: area, boat: boat, ORDER: ORDER, DOCK: [475, 640] };
})(window);
