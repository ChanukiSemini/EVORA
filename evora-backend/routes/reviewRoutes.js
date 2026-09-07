const express = require('express');
const { createReview, getReviews } = require('../controllers/reviewController');

const router = express.Router();

router.get('/', getReviews);
router.post('/', createReview);

module.exports = router;
