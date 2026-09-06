// ============================================
// src/assets/images.js
// Central place for image sources used across
// the app. Each station now maps to an ARRAY of
// photos (used by the auto-swipe gallery on the
// Station Details page). images[0] also doubles
// as the single thumbnail used on the Home page
// list/map panel.
// ============================================

import oneGalleFace1 from './stations/one-galle-face/photo-1.jpg';
import oneGalleFace2 from './stations/one-galle-face/photo-2.jpg';
import oneGalleFace3 from './stations/one-galle-face/photo-3.jpg';
import oneGalleFace4 from './stations/one-galle-face/photo-4.jpg';

import colomboCityCenter1 from './stations/colombo-city-center/photo-1.jpg';
import colomboCityCenter2 from './stations/colombo-city-center/photo-2.jpg';
import colomboCityCenter3 from './stations/colombo-city-center/photo-3.jpg';
import colomboCityCenter4 from './stations/colombo-city-center/photo-4.jpg';

import independenceArcade1 from './stations/independence-arcade/photo-1.jpg';
import independenceArcade2 from './stations/independence-arcade/photo-2.jpg';
import independenceArcade3 from './stations/independence-arcade/photo-3.jpg';
import independenceArcade4 from './stations/independence-arcade/photo-4.jpg';

import havelockCity1 from './stations/havelock-city/photo-1.jpg';
import havelockCity2 from './stations/havelock-city/photo-2.jpg';
import havelockCity3 from './stations/havelock-city/photo-3.jpg';
import havelockCity4 from './stations/havelock-city/photo-4.jpg';

import morvenHotel1 from './stations/morven-hotel/photo-1.jpg';
import morvenHotel2 from './stations/morven-hotel/photo-2.jpg';
import morvenHotel3 from './stations/morven-hotel/photo-3.jpg';

import vedriveStation1 from './stations/vedrive-station/photo-1.jpg';
import vedriveStation2 from './stations/vedrive-station/photo-2.jpg';
import vedriveStation3 from './stations/vedrive-station/photo-3.jpg';
import vedriveStation4 from './stations/vedrive-station/photo-4.jpg';


import voltChargeCod2 from './stations/volt-charge-cod/photo-2.jpg';
import voltChargeCod4 from './stations/volt-charge-cod/photo-4.jpg';

export const images = {
    oneGalleFace: [oneGalleFace1, oneGalleFace2, oneGalleFace3, oneGalleFace4],
    colomboCityCenter: [colomboCityCenter1, colomboCityCenter2, colomboCityCenter3, colomboCityCenter4],
    independenceArcade: [independenceArcade1, independenceArcade2, independenceArcade3, independenceArcade4],
    havelockCity: [havelockCity1, havelockCity2, havelockCity3, havelockCity4],
    morvenHotel: [morvenHotel1, morvenHotel2, morvenHotel3],
    vedriveStation: [vedriveStation1, vedriveStation2, vedriveStation3, vedriveStation4],
    voltChargeCod: [voltChargeCod2, voltChargeCod4],
};

export default images;
