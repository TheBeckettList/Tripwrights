/* Tripwrights' world: the regions we sail to, their islands, and the real places on them. Plain data, so the hub's place cards can
   replace it later. Map positions (x, y) are in each scene's own viewBox; lon/lat place things on the globe. Plain ES5. */
(function (w) {
  'use strict';
  var all = function (v) { var o = {}; ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(function (d) { o[d] = v; }); return o; };
  var TW = w.TW = {};

  /* what you can do aboard each region's yacht; each opens the places that offer it */
  TW.ACTS = {
    dive: { name: 'Dive', line: 'Reefs, walls and learning to dive, matched to your card.' },
    water: { name: 'Snorkel & paddle', line: 'Kayaks, paddleboards, a mask and a reef close by.' },
    sail: { name: 'Sail', line: 'Day sails, sunset sails and island hops.' },
    fish: { name: 'Fish', line: 'Trolling, fly fishing the flats, dinner you caught.' },
    rest: { name: 'Rest', line: 'Spa, massage, a hammock and nothing on the clock.' },
    eat: { name: 'Eat', line: 'Breakfast to late supper, open when they are really open.' },
    stay: { name: 'Stay', line: 'A bunk, a room, a cabin by the water.' }
  };

  TW.REGIONS = {
    caribbean: {
      name: 'Caribbean', sub: 'Bay Islands, Honduras', lon: -86.4, lat: 16.3, live: true,
      c: { accent: '#E9735C', deep: '#B8503B', soft: '#F5B8A8', pale: '#FDEAE4', pop: '#F2B632', tank: '#E9735C', tank2: '#F2F2EE' },
      blurb: 'Reef walls, whale sharks and three islands an hour apart.',
      islands: [
        { id: 'utila', name: 'Utila', live: true, x: 230, y: 330, rx: 120, ry: 46, rot: -6, seed: 11, lon: -86.9, lat: 16.1 },
        { id: 'roatan', name: 'Roatán', x: 560, y: 250, rx: 210, ry: 36, rot: -14, seed: 4, lon: -86.5, lat: 16.35 },
        { id: 'guanaja', name: 'Guanaja', x: 860, y: 140, rx: 62, ry: 42, rot: -24, seed: 9, lon: -85.9, lat: 16.45 }
      ]
    },
    seasia: {
      name: 'Southeast Asia', sub: 'Gulf of Thailand', lon: 100.0, lat: 9.8, live: false,
      c: { accent: '#8A6BB8', deep: '#664A93', soft: '#CDBDE6', pale: '#F0EAF8', pop: '#F2A641', tank: '#8A6BB8', tank2: '#F2F2EE' },
      blurb: 'Granite coves, longtail boats and clear, warm water.',
      islands: [
        { id: 'kohtao', name: 'Koh Tao', x: 220, y: 170, rx: 46, ry: 62, rot: 10, seed: 3, lon: 99.84, lat: 10.09 },
        { id: 'kohphangan', name: 'Koh Phangan', x: 520, y: 300, rx: 96, ry: 84, rot: 0, seed: 7, lon: 100.03, lat: 9.75 },
        { id: 'kohsamui', name: 'Koh Samui', x: 790, y: 470, rx: 124, ry: 108, rot: 0, seed: 2, lon: 100.0, lat: 9.5 }
      ]
    }
  };
  TW.ORDER = ['caribbean', 'seasia'];

  /* the real places (Josie's and Paradise run our POS); x, y are on their island's map */
  TW.PLACES = {
    utila: [
      { id: 'josies-cafe', name: 'Josie’s Cafe', kind: 'Eat', acts: ['eat'], pal: 'josies-cafe', x: 270, y: 425, real: true, blurb: 'Coffee, breakfast and lunch on the bay. Order at the counter.',
        hours: { mon: '6:15-14:30', tue: '6:15-14:30', wed: '6:15-14:30', thu: '6:15-14:30', fri: '6:15-14:30', sat: '6:15-14:30', sun: 'closed' } },
      { id: 'paradise', name: 'Paradise', kind: 'Dive · Stay', acts: ['dive', 'stay', 'water'], pal: 'paradise', x: 740, y: 470, real: true, blurb: 'SSI and PADI dive shop and hostel on the bay, next to Josie’s.',
        hours: (function () { var o = all('7:00-17:00'); o.sun = '7:00-12:00'; return o; })(),
        offers: [
          { name: 'Try scuba', agencies: ['SSI', 'PADI'], needs: 'none' }, { name: 'Open Water', agencies: ['SSI', 'PADI'], needs: 'none', days: 4 },
          { name: 'Advanced Open Water', agencies: ['SSI', 'PADI'], needs: 'ow', days: 2 }, { name: 'Rescue Diver', agencies: ['SSI', 'PADI'], needs: 'aow', days: 3 },
          { name: 'Fun dives', agencies: ['any'], needs: 'ow' }, { name: 'Night dive', agencies: ['any'], needs: 'ow' }
        ] }
    ]
  };
  TW.island = function (id) { var k, i, isl; for (k in TW.REGIONS) { isl = TW.REGIONS[k].islands; for (i = 0; i < isl.length; i++) { if (isl[i].id === id) { isl[i].region = k; return isl[i]; } } } return null; };
})(window);
