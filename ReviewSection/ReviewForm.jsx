import React, { useState, useEffect } from 'react';

const AVAILABLE_CHIPS = [
    "Fast Charging",
    "Easy to Find",
    "Clean Station",
    "Friendly Staff",
    "Faulty Charger"
];

export default function ReviewForm() {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedChips, setSelectedChips] = useState([]);
    const [comment, setComment] = useState("");
    const [photos, setPhotos] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        return () => {
            photos.forEach(item => {
                if (item.previewUrl) {
                    URL.revokeObjectURL(item.previewUrl);
                }
            });
        };
    }, []);

    const handleStarClick = (value) => {
        setRating(value);
        if (errors.rating) {
            setErrors(prev => ({ ...prev, rating: null }));
        }
    };

    const handleChipToggle = (chip) => {
        setSelectedChips(prev =>
            prev.includes(chip)
                ? prev.filter(c => c !== chip)
                : [...prev, chip]
        );
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const newPhotos = files.map(file => {
            const previewUrl = URL.createObjectURL(file);
            return {
                id: Math.random().toString(36).substr(2, 9),
                file,
                previewUrl
            };
        });

        setPhotos(prev => [...prev, ...newPhotos]);
    };

    const handleRemovePhoto = (id, previewUrl) => {
        URL.revokeObjectURL(previewUrl);
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (rating === 0) {
            newErrors.rating = "Please select a star rating before submitting.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            rating,
            chips: selectedChips,
            comment: comment.trim(),
            photoCount: photos.length,
            photosList: photos.map(p => ({
                filename: p.file.name,
                sizeBytes: p.file.size,
                mimeType: p.file.type
            }))
        };

        console.log("---------------- REVIEW SUBMISSION PAYLOAD ----------------");
        console.log("Star Rating: ", payload.rating);
        console.log("Selected Chips: ", payload.chips);
        console.log("Comment: ", payload.comment);
        console.log("Attached Photos Metadata: ", payload.photosList);
        console.log("Full JSON Payload: ", JSON.stringify(payload, null, 2));
        console.log("-----------------------------------------------------------");

        setIsSubmitted(true);
    };

    const handleReset = () => {
        photos.forEach(item => URL.revokeObjectURL(item.previewUrl));

        setRating(0);
        setHoverRating(0);
        setSelectedChips([]);
        setComment("");
        setPhotos([]);
        setIsSubmitted(false);
        setErrors({});
    };

    if (isSubmitted) {
        return (
            <div className="review-form-card success-card">
                <div className="success-icon-container">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h3 className="success-title">Submission Successful!</h3>
                <p className="success-subtitle">Thank you for rating. Your feedback helps improve charging experiences for everyone in the network.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px' }}>
                    <button className="submit-btn" onClick={handleReset}>
                        Done
                    </button>

                    <button
                        type="button"
                        style={{
                            background: 'transparent',
                            color: 'var(--accent)',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                        onClick={handleReset}
                    >
                        Submit Another Review
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="review-form-card">
            <h3 className="form-title">
                <svg width="20" height="20" style={{ stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4m0 4h.01"></path></svg>
                Rate Your Experience
            </h3>

            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label className="form-group-label" id="star-rating-label">
                        How would you rate this charging session?
                    </label>
                    <div
                        className="stars-container"
                        role="radiogroup"
                        aria-labelledby="star-rating-label"
                    >
                        {[1, 2, 3, 4, 5].map((index) => {
                            const isActive = index <= (hoverRating || rating);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    className={`star-interactive ${isActive ? 'filled' : ''}`}
                                    onClick={() => handleStarClick(index)}
                                    onMouseEnter={() => setHoverRating(index)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    aria-label={`Rate ${index} out of 5 stars`}
                                    role="radio"
                                    aria-checked={rating === index}
                                >
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                </button>
                            );
                        })}
                    </div>
                    {errors.rating && (
                        <div className="error-message" role="alert">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <span>{errors.rating}</span>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-group-label">What went well or could be improved?</label>
                    <div className="chips-container">
                        {AVAILABLE_CHIPS.map((chip) => {
                            const isActive = selectedChips.includes(chip);
                            return (
                                <button
                                    key={chip}
                                    type="button"
                                    className={`chip ${isActive ? 'active' : ''}`}
                                    onClick={() => handleChipToggle(chip)}
                                    aria-pressed={isActive}
                                >
                                    {chip}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="comment-text" className="form-group-label">Additional Comments</label>
                    <textarea
                        id="comment-text"
                        className="comment-input"
                        placeholder="Describe your experience (e.g. charging speed, location accessibility, issues with cables...)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={1000}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label className="form-group-label">Upload Session Photos</label>
                    <div className="photo-upload-wrapper">
                        <div className="photo-upload-btn-container">
                            <input
                                type="file"
                                className="photo-upload-input"
                                id="photo-file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoChange}
                                aria-label="Upload charging station photos"
                            />
                            <div className="photo-upload-btn" aria-hidden="true">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                    <circle cx="12" cy="13" r="4"></circle>
                                </svg>
                                <span>Add Photo</span>
                            </div>
                        </div>

                        {photos.map((item) => (
                            <div key={item.id} className="thumbnail-preview">
                                <img src={item.previewUrl} alt="Thumbnail preview" />
                                <button
                                    type="button"
                                    className="remove-photo-btn"
                                    onClick={() => handleRemovePhoto(item.id, item.previewUrl)}
                                    aria-label="Remove this photo"
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
}
