const express = require('express');
const router = express.Router();

const {
    getPortfolios,
    getPortfolio,
    getPortfolioBySlug,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    toggleVisibility,
} = require('../controllers/portfolioController');

const { protect } = require('../middleware/auth');

// Public route - must be before protected routes
router.get('/public/:slug', getPortfolioBySlug);

// Protected routes
router.use(protect);

router.route('/')
    .get(getPortfolios)
    .post(createPortfolio);

router.route('/:id')
    .get(getPortfolio)
    .put(updatePortfolio)
    .delete(deletePortfolio);

router.put('/:id/visibility', toggleVisibility);

module.exports = router;
