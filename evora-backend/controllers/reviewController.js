import mongoose from 'mongoose';
import Review from '../models/Review.js';
import EvDriver from '../models/EvDriver.js';
import Station from '../models/Station.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public (or Protected)
export const createReview = async (req, res) => {
  try {
    const {
      rating,
      ratingLabel,
      chips,
      comment,
      driver,
      station,
      booking,
      energyDeliveredKWh,
      cost
    } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required and must be between 1 and 5 stars.'
      });
    }

    // Ensure driver ObjectId exists
    let driverId = driver;
    if (!driverId || !mongoose.Types.ObjectId.isValid(driverId)) {
      const existingDriver = await EvDriver.findOne();
      if (existingDriver) {
        driverId = existingDriver._id;
      } else {
        driverId = new mongoose.Types.ObjectId();
      }
    }

    // Ensure station ObjectId exists
    let stationId = station;
    if (!stationId || !mongoose.Types.ObjectId.isValid(stationId)) {
      const existingStation = await Station.findOne();
      if (existingStation) {
        stationId = existingStation._id;
      } else {
        stationId = new mongoose.Types.ObjectId();
      }
    }

    const reviewData = {
      driver: driverId,
      station: stationId,
      rating: Number(rating),
      ratingLabel: ratingLabel || '',
      chips: Array.isArray(chips) ? chips : [],
      comment: comment ? String(comment).trim() : '',
    };

    if (booking && mongoose.Types.ObjectId.isValid(booking)) {
      reviewData.booking = booking;
    }
    if (energyDeliveredKWh !== undefined) {
      reviewData.energyDeliveredKWh = Number(energyDeliveredKWh);
    }
    if (cost !== undefined) {
      reviewData.cost = Number(cost);
    }

    const newReview = await Review.create(reviewData);

    return res.status(201).json({
      success: true,
      data: newReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};
