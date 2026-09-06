// ============================================
// src/components/StationGallery.jsx
// Auto-swiping photo gallery used on the Station
// Details page banner. Advances every 3.5s,
// pauses while the pointer is hovering, and can
// still be swiped manually via the dots / arrows.
// ============================================

import { useEffect, useRef, useState } from 'react';

const AUTO_SWIPE_MS = 3500;

const ChevronLeft = () => (
    <svg viewBox="0 0 20 20" fill="none"><path d="M12.5 16 6.5 10l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const ChevronRight = () => (
    <svg viewBox="0 0 20 20" fill="none"><path d="M7.5 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const StationGallery = ({ images = [], alt = '', badge = null }) => {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef(null);

    const photos = images.length ? images : [];

    const photoCount = photos.length;

    useEffect(() => {
        if (paused || photoCount <= 1) return undefined;
        timerRef.current = setInterval(() => {
            setIndex((i) => (i + 1) % photoCount);
        }, AUTO_SWIPE_MS);
        return () => clearInterval(timerRef.current);
    }, [paused, photoCount]);

    if (!photos.length) return null;

    const goTo = (i) => setIndex((i + photos.length) % photos.length);

    return (
        <div
            className="sd-gallery"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {badge}
            {photos.length > 1 && (
                <div className="sd-gallery-counter">{index + 1} / {photos.length}</div>
            )}
            <div
                className="sd-gallery-track"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {photos.map((src, i) => (
                    <div className="sd-gallery-slide" key={i}>
                        <img src={src} alt={`${alt} photo ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
                    </div>
                ))}
            </div>

            {photos.length > 1 && (
                <>
                    <button className="sd-gallery-arrow prev" aria-label="Previous photo" onClick={() => goTo(index - 1)}>
                        <ChevronLeft />
                    </button>
                    <button className="sd-gallery-arrow next" aria-label="Next photo" onClick={() => goTo(index + 1)}>
                        <ChevronRight />
                    </button>
                    <div className="sd-gallery-dots">
                        {photos.map((_, i) => (
                            <span
                                key={i}
                                className={`sd-gallery-dot ${i === index ? 'active' : ''}`}
                                onClick={() => goTo(i)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default StationGallery;
