const mongoose = require('mongoose');
const Review = require('../models/Review');
const Station = require('../models/Station');

/**
 * POST /api/reviews
 * Creates a new review and recalculates the station's average rating & review count.
 */
const createReview = async (req, res) => {
    try {
        const {
            driver,
            station,
            booking,
            rating,
            ratingLabel,
            chips,
            comment,
        } = req.body;

        // Validate station is a syntactically valid ObjectId string
        if (!station || !mongoose.Types.ObjectId.isValid(station)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing station ID. Station must be a valid ObjectId.',
            });
        }

        if (!rating || Number(rating) < 1 || Number(rating) > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating is required and must be between 1 and 5.',
            });
        }

        const reviewData = {
            station,
            rating: Number(rating),
            ratingLabel: ratingLabel || '',
            chips: Array.isArray(chips) ? chips : [],
            comment: comment ? String(comment).trim() : '',
        };

        if (driver && mongoose.Types.ObjectId.isValid(driver)) {
            reviewData.driver = driver;
        }
        if (booking && mongoose.Types.ObjectId.isValid(booking)) {
            reviewData.booking = booking;
        }

        const savedReview = await Review.create(reviewData);

        // Recalculate station's average rating and review count via aggregation
        const result = await Review.aggregate([
            { $match: { station: savedReview.station } },
            { $group: { _id: '$station', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
        ]);

        if (result.length > 0) {
            await Station.findByIdAndUpdate(station, {
                rating: Number(result[0].averageRating.toFixed(1)),
                reviews: result[0].reviewCount,
            });
        }

        return res.status(201).json({
            success: true,
            data: savedReview,
            message: 'Review submitted successfully',
        });
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to submit review',
            error: error.message,
        });
    }
};

/**
 * GET /api/reviews
 */
const getReviews = async (req, res) => {
    try {
        const { stationId } = req.query;
        const filter = {};
        if (stationId && mongoose.Types.ObjectId.isValid(stationId)) {
            filter.station = stationId;
        }
        const reviews = await Review.find(filter).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message,
        });
    }
};

module.exports = {
    createReview,
    getReviews,
};
