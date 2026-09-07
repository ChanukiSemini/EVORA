import { images } from '../assets/images';
import kaduwelaBayHero from '../assets/kaduwela-bay-hero.jpg';

/**
 * Returns a unique, diverse photo and gallery array for any charging station
 * matching its brand, location keywords, or cycling through distinct sets.
 */
export function getStationImages(station, index = 0) {
    if (
        station &&
        Array.isArray(station.images) &&
        station.images.length > 0 &&
        typeof station.images[0] === 'string' &&
        station.images[0].trim() !== '' &&
        !station.images[0].includes('data:,')
    ) {
        return {
            image: station.image || station.images[0],
            images: station.images,
        };
    }

    const key = (station?.slug || station?.branchId || station?.id || station?.name || '').toLowerCase();

    if (key.includes('cinnamon')) {
        return { image: images.morvenHotel[0], images: images.morvenHotel };
    }
    if (key.includes('kcc') || key.includes('kandy')) {
        return { image: images.independenceArcade[0], images: images.independenceArcade };
    }
    if (key.includes('galle') && !key.includes('one-galle')) {
        return { image: images.vedriveStation[0], images: images.vedriveStation };
    }
    if (key.includes('welipenna') || key.includes('expressway')) {
        return {
            image: images.voltChargeCod[0] || images.havelockCity[0],
            images: [images.voltChargeCod[0] || images.havelockCity[0], images.havelockCity[1], images.havelockCity[2]],
        };
    }
    if (key.includes('kaduwela') || key.includes('s-ev') || key.includes('welivita')) {
        return {
            image: kaduwelaBayHero,
            images: [kaduwelaBayHero, images.colomboCityCenter[1], images.colomboCityCenter[2]],
        };
    }
    if (key.includes('union-place') || key.includes('union')) {
        return { image: images.colomboCityCenter[0], images: images.colomboCityCenter };
    }
    if (key.includes('kohuwala') || key.includes('nugegoda')) {
        return { image: images.havelockCity[1], images: images.havelockCity };
    }
    if (key.includes('wattala') || key.includes('negombo')) {
        return { image: images.vedriveStation[1] || images.vedriveStation[0], images: images.vedriveStation };
    }
    if (key.includes('one-galle')) {
        return { image: images.oneGalleFace[0], images: images.oneGalleFace };
    }
    if (key.includes('colombo-city') || key.includes('ccc')) {
        return { image: images.colomboCityCenter[0], images: images.colomboCityCenter };
    }
    if (key.includes('independence') || key.includes('arcade')) {
        return { image: images.independenceArcade[0], images: images.independenceArcade };
    }
    if (key.includes('havelock')) {
        return { image: images.havelockCity[0], images: images.havelockCity };
    }
    if (key.includes('morven')) {
        return { image: images.morvenHotel[0], images: images.morvenHotel };
    }
    if (key.includes('vedrive')) {
        return { image: images.vedriveStation[0], images: images.vedriveStation };
    }
    if (key.includes('volt')) {
        return { image: images.voltChargeCod[0], images: images.voltChargeCod };
    }

    // Default cycling by station index
    const pools = [
        images.colomboCityCenter,
        images.havelockCity,
        images.morvenHotel,
        images.vedriveStation,
        images.independenceArcade,
        images.oneGalleFace,
        images.voltChargeCod,
    ];
    const picked = pools[Math.abs(index) % pools.length];
    return {
        image: picked[0],
        images: picked,
    };
}

export default getStationImages;
