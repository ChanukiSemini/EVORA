export const getDirectionsUrl = (station) => {
    if (!station || !Number.isFinite(station.lat) || !Number.isFinite(station.lng)) return null;

    const params = new URLSearchParams({
        api: '1',
        destination: `${station.lat},${station.lng}`,
    });

    return `https://www.google.com/maps/dir/?${params.toString()}`;
};
