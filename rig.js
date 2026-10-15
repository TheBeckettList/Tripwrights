/* Tripwrights scenes: the sea habitat ("the rig") you start on, and an area's island map. Drawn with the shared island art kit
   (art/kit.js, Josie's style). Home is 1000 x 1500, an area is 1000 x 1100. Plain ES5. */
(function (w) {
  'use strict';
  var U = w.UART, P = U.props, W = U.palettes.world, TW = U.palettes.places.tripwrights.light, AREAS = U.palettes.areas, at = U.at;
  var ORDER = ['utila', 'roatan', 'guanaja', 'kohtao'];
  var SLOTS = { utila: [905, 930], roatan: [905, 1235], guanaja: [685, 930], kohtao: [685, 1235] };   /* where each area's boat is tied up */
  var BOATSCALE = .7;

  function obj(k, label, aria, ring, inner, tagX, tagY) {
    return '<g class="obj" tabindex="0" role="button" aria-label="' + aria + '" data-k="' + k + '"><rect class="ring" x="' + ring[0] + '" y="' + ring[1] + '" width="' + ring[2] + '" height="' + ring[3] + '" rx="30"/><g class="lift">' + inner + '</g>' +
      (label ? '<text class="tag" x="' + tagX + '" y="' + tagY + '" text-anchor="middle">' + label + '</text>' : '') + '</g>';
  }
  function chalkCliff() {
    return '<path d="M-20,-20 L250,-20 C240,60 210,120 170,170 C120,230 60,250 -20,250Z" fill="#EFEBE1"/><path d="M-20,-20 L228,-20 C220,50 190,100 150,142 C100,196 50,214 -20,214Z" fill="#A9CC8A"/><path d="M-20,-20 L190,-20 C170,40 130,86 80,112 C40,132 10,138 -20,140Z" fill="#8FBB72"/>' +
      at(70, 70, 0, 1, '<circle r="26" fill="#FFFFFF"/><circle r="17" fill="#D9483B"/><circle r="9" fill="#FFFFFF"/><circle r="4" fill="#FFE29A"/>') + at(150, 40, 0, 1, P.pot(12)) + at(210, 150, 0, 1, P.rock(14, 3)) + '<text x="86" y="204" font-family="Baloo 2,sans-serif" font-weight="800" font-size="22" fill="#FFFFFF" opacity=".9">England</text>';
  }

  function home() {
    var h = '', i, id, sl, a;
    h += '<rect width="1000" height="1500" fill="#8DB7C4"/><rect y="520" width="1000" height="520" fill="#6FA2B3"/><rect y="1040" width="1000" height="460" fill="#5A93A8"/>';
    h += at(300, 110, 0, 1, P.wave(110)) + at(680, 90, 0, 1, P.wave(90)) + at(60, 700, 0, 1, P.wave(100)) + at(940, 760, 0, 1, P.wave(80)) + at(80, 1150, 0, 1, P.wave(110)) + at(300, 1400, 0, 1, P.wave(100)) + at(900, 1470, 0, 1, P.wave(70));
    h += at(300, 760, -8, 1, P.whaleShadow(1.1)) + at(180, 1120, 0, 1, P.jelly(16)) + at(960, 600, 0, 1, P.jelly(12, '#9CE0E8')) + at(520, 1300, 0, 1, P.jelly(14, '#F5B5C8')) + at(870, 1440, 0, 1, P.jelly(11));
    h += chalkCliff();
    h += '<path d="M70,70 L420,330 L420,300Z" fill="#FFE9A8" opacity=".25"/>';
    /* legs and the pontoon ring: the platform stands on four round legs with foam round their feet */
    [[130, 190], [560, 190], [130, 960], [560, 960]].forEach(function (p) { h += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="64" fill="#9CE0E8" opacity=".22"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="46" fill="#FFFFFF" opacity=".4"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="34" fill="#4A6B80"/>'; });
    /* the platform: a pale blue-grey slab with a soft underside, a deck of sand-colored planks inside */
    h += '<rect x="86" y="146" width="528" height="888" rx="46" fill="#3F6A86"/><rect x="86" y="138" width="528" height="888" rx="46" fill="#C9DCE6"/><rect x="104" y="156" width="492" height="852" rx="34" fill="#EFE6D6"/>';
    for (i = 190; i < 1000; i += 28) { h += '<rect x="104" y="' + i + '" width="492" height="2.5" fill="' + W['deck-line'] + '" opacity=".5"/>'; }
    h += '<rect x="86" y="138" width="528" height="40" rx="22" fill="' + TW.accent + '"/><rect x="86" y="138" width="528" height="26" rx="13" fill="#FFFFFF" opacity=".25"/>';
    h += at(350, 158, 0, 1, '<rect x="-150" y="-17" width="300" height="34" rx="17" fill="#FFFFFF"/><text y="9" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="25" fill="' + TW.accent + '" letter-spacing="3">TRIPWRIGHTS</text>');
    /* helipad */
    h += obj('heli', '', 'Helicopter on the helipad: flights and tours', [190, 190, 320, 260],
      at(350, 320, 0, 1, '<circle r="112" fill="' + TW.soft + '"/><circle r="94" fill="#FFFFFF" opacity=".55"/><text y="40" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="120" fill="' + TW.accent + '" opacity=".22">H</text>') + at(350, 322, 8, .85, P.heli(TW)), 350, 468);
    /* globe hall */
    h += '<rect x="132" y="540" width="436" height="320" rx="40" fill="#A9CFE3"/><rect x="132" y="536" width="436" height="320" rx="40" fill="#E1EEF5"/><rect x="152" y="556" width="396" height="280" rx="30" fill="#FFFFFF"/>';
    for (i = 0; i < 4; i++) { h += '<rect x="' + (172 + i * 96) + '" y="570" width="84" height="22" rx="8" fill="#CFE6F0"/>'; }
    h += at(190, 760, 0, 1, '<rect x="-30" y="-24" width="60" height="48" rx="10" fill="' + TW.wash + '"/><path d="M-20,2 q10,-14 20,0 t20,0" stroke="' + TW.accent + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>') + at(510, 770, 0, 1, P.pot(18)) + at(190, 640, 0, 1, P.pot(16));
    h += obj('globe', 'The globe', 'Giant globe: where do you want to go', [210, 590, 280, 250], at(350, 710, 0, 1, P.globe(82, TW)), 350, 828);
    h += '<g pointer-events="none">' + at(350, 706, 0, 1, P.dome(190, 150)) + '</g>';
    /* container cabins in the area colors, the garden deck, the crane */
    h += at(210, 900, 0, 1, P.container(130, 54, AREAS.utila.light.accent)) + at(360, 900, 0, 1, P.container(130, 54, AREAS.roatan.light.accent)) + at(210, 966, 0, 1, P.container(130, 54, AREAS.guanaja.light.accent)) + at(360, 966, 0, 1, P.container(130, 54, AREAS.kohtao.light.accent));
    h += at(250, 872, 0, 1, '<rect x="0" y="0" width="0" height="0"/>') + at(210, 934, 90, 1, P.bridge(32)) + at(360, 934, 90, 1, P.bridge(32));
    h += P.lights(112, 530, 590, 530, 16, 18) + P.lights(112, 880, 590, 880, 16, 14);
    h += at(160, 600, 0, 1, P.lantern(8)) + at(540, 610, 0, 1, P.lantern(8)) + at(120, 820, 0, 1, P.lantern(8, '#F5B5C8')) + at(580, 820, 0, 1, P.lantern(8, '#BFE9F0')) + at(500, 470, 0, 1, P.lantern(7));
    h += at(510, 930, 0, 1, P.palm(58)) + at(540, 1000, 0, 1, P.pot(15)) + at(150, 500, 0, 1, P.pot(15)) + at(552, 500, 0, 1, P.pot(15)) + at(552, 580, 0, 1, P.pot(13));
    h += '<rect x="520" y="200" width="46" height="250" rx="10" fill="#4A6B80"/><rect x="527" y="207" width="32" height="236" rx="6" fill="#6C8DA3"/>';
    for (i = 220; i < 440; i += 28) { h += '<rect x="527" y="' + i + '" width="32" height="3" fill="#4A6B80"/>'; }
    h += at(543, 220, 0, 1, '<circle r="15" fill="' + TW.pop + '"/><circle r="8" fill="#FFE29A"/>');
    /* seaplane dock: a short jetty off the platform and the float plane */
    h += at(676, 330, 90, 1, P.dock(40, 150));
    h += obj('plane', '', 'Float plane at the jetty: flights between areas', [680, 180, 280, 300], at(830, 330, 0, .66, P.floatplane(TW)), 830, 470);
    /* pier with one boat per area */
    h += at(790, 1100, 0, 1, P.dock(70, 700));
    for (i = 0; i < ORDER.length; i++) {
      id = ORDER[i]; a = AREAS[id]; sl = SLOTS[id];
      h += obj('boat:' + id, a.name, a.name + ' boat: ' + (a.live ? 'open the area' : 'coming soon'), [sl[0] - 60, sl[1] - 130, 120, 270],
        '<g class="bob">' + at(sl[0], sl[1], 0, BOATSCALE, P.boatKind(a.boat, a.light)) + '</g>', sl[0], sl[1] + 168 + (a.boat === 'longtail' ? 30 : 0));
      if (!a.live) { h += '<g transform="translate(' + (sl[0] + 36) + ',' + (sl[1] - 100) + ')"><rect x="-26" y="-12" width="52" height="24" rx="12" fill="#FFFFFF"/><text y="5" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="14" fill="' + a.light['accent-deep'] + '">soon</text></g>'; }
    }
    return h;
  }


  function utilaIsland(places) {
    var h = '', i, p, pal, byId = {};
    places.forEach(function (q) { byId[q.id] = q; });
    h += P.sea(0, 0, 1000, 1100);
    h += at(150, 880, 0, 1, P.reef(150, 60, 3)) + at(870, 860, 0, 1, P.reef(110, 80, 9)) + at(90, 330, 0, 1, P.reef(80, 120, 5)) + at(920, 220, 0, 1, P.reef(70, 90, 6));
    h += '<path d="' + P.blobPath(500, 380, 460, 250, 11, .1) + '" fill="#FFFFFF" opacity=".45"/><path d="' + P.blobPath(500, 380, 430, 228, 11, .1) + '" fill="' + W.sand + '"/><path d="' + P.blobPath(500, 330, 340, 160, 14, .14) + '" fill="' + W['leaf-pale'] + '" opacity=".6"/>';
    /* the bay: a bite out of the south shore with a sandy rim */
    h += '<path d="' + P.blobPath(515, 560, 175, 150, 21, .1) + '" fill="' + W.sand + '"/><path d="' + P.blobPath(515, 565, 150, 128, 21, .1) + '" fill="' + W.sea + '"/><path d="' + P.blobPath(515, 600, 112, 78, 22, .08) + '" fill="' + W.sea + '"/><path d="' + P.blobPath(515, 700, 104, 96, 23, .08) + '" fill="' + W['sea-2'] + '"/>';
    h += at(470, 200, 0, 1, P.palm(66)) + at(150, 360, 0, 1, P.palm(52)) + at(860, 330, 0, 1, P.palm(56)) + at(640, 240, 0, 1, P.palm(46)) + at(300, 250, 0, 1, P.palm(42));
    h += at(105, 460, 0, 1, P.rock(26, 4)) + at(905, 470, 0, 1, P.rock(20, 6)) + at(940, 400, 0, 1, P.rock(14, 8));
    /* small houses along the north shore, the town */
    [[330, 178], [392, 152], [560, 152], [622, 178], [700, 198], [236, 214]].forEach(function (c, j) { h += at(c[0], c[1], j * 7 - 12, 1, '<rect x="-22" y="-16" width="44" height="32" rx="5" fill="#FFFFFF"/><rect x="-24" y="-16" width="48" height="13" fill="' + ['#F5B5C8', '#F2A66B', '#EAD9C5'][j % 3] + '"/>'); });
    /* the places, drawn as their own simplified selves, each on the bay shore with its own pier or dock */
    var D = byId['utila-dives'], J = byId['josies-cafe'];
    if (D) { h += obj('place:utila-dives', D.name, D.name + ': plan this stop', [D.x - 190, D.y - 90, 350, 250], at(D.x, D.y, 0, .62, P.placeDives()), D.x - 10, D.y + 150); }
    if (J) { h += obj('place:josies-cafe', J.name, J.name + ': plan this stop', [J.x - 150, J.y - 90, 330, 250], at(J.x, J.y, 0, .62, P.placeJosies()), J.x + 10, J.y + 150); }
    /* an open plot, ready for the next shop */
    h += '<g transform="translate(515,300)" opacity=".9"><circle r="44" fill="none" stroke="' + AREAS.utila.light.accent + '" stroke-width="4" stroke-dasharray="10 10" stroke-linecap="round"/><rect x="-2" y="-34" width="4" height="40" fill="' + W['wood-dk'] + '"/><path d="M2,-34 h28 l-8,10 8,10 h-28z" fill="' + AREAS.utila.light.accent + '"/></g>';
    return h;
  }
  /* an island map: the area's own sea, an island, its participating places drawn big in their own palettes, plots waiting for more */
  function area(id, places) {
    if (id === 'utila') { return utilaIsland(places); }
    var a = AREAS[id], L = a.light, h = '', i, p, pal;
    h += P.sea(0, 0, 1000, 1100);
    h += at(260, 880, 0, 1, P.reef(140, 60, 3)) + at(860, 760, 0, 1, P.reef(110, 80, 9)) + at(120, 300, 0, 1, P.reef(90, 120, 5));
    h += '<path d="' + P.blobPath(500, 430, 430, 300, 11, .12) + '" fill="#FFFFFF" opacity=".45"/><path d="' + P.blobPath(500, 430, 400, 276, 11, .12) + '" fill="' + W.sand + '"/><path d="' + P.blobPath(500, 410, 330, 210, 14, .16) + '" fill="' + W['leaf-pale'] + '" opacity=".55"/>';
    h += at(470, 235, 0, 1, P.palm(66)) + at(640, 560, 0, 1, P.palm(52)) + at(260, 560, 0, 1, P.palm(48)) + at(850, 470, 0, 1, P.palm(44));
    h += at(150, 440, 0, 1, P.rock(30, 4)) + at(800, 600, 0, 1, P.rock(22, 6)) + at(915, 450, 0, 1, P.rock(18, 8));
    h += at(540, 700, 0, 1, P.dock(60, 160));
    /* places */
    for (i = 0; i < places.length; i++) {
      p = places[i]; pal = U.palettes.places[p.pal].light;
      h += obj('place:' + p.id, p.name, p.name + ': plan this stop', [p.x - 125, p.y - 100, 250, 220], at(p.x, p.y, 0, 1, P.building(pal, 190, 130)) + at(p.x + 100, p.y + 70, 0, 1, P.pot(14)), p.x, p.y + 108);
    }
    /* open plots, ready for the next shop */
    [[350, 560], [660, 410]].forEach(function (s, j) {
      if (places.length > 1 && j === 1) { return; }
      h += '<g transform="translate(' + s[0] + ',' + s[1] + ')" opacity=".9"><circle r="44" fill="none" stroke="' + L.accent + '" stroke-width="4" stroke-dasharray="10 10" stroke-linecap="round"/><rect x="-2" y="-34" width="4" height="40" fill="' + W['wood-dk'] + '"/><path d="M2,-34 h28 l-8,10 8,10 h-28z" fill="' + L.accent + '"/></g>';
    });
    return h;
  }
  /* the arriving boat: bow up, scaled; the page moves it with a CSS transform */
  function boat(id) { var a = AREAS[id]; return at(0, 0, 0, .6, P.boatKind(a.boat, a.light)); }

  U.rig = { home: home, area: area, boat: boat, ORDER: ORDER, DOCK: [475, 640] };
})(window);
