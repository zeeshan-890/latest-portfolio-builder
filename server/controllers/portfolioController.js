const Portfolio = require('../models/Portfolio');

// @desc    Get all portfolios for logged in user
// @route   GET /api/portfolios
// @access  Private
const getPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find({ user: req.user.id });
        res.status(200).json({
            success: true,
            count: portfolios.length,
            data: portfolios,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get single portfolio
// @route   GET /api/portfolios/:id
// @access  Private
const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio not found',
            });
        }

        // Make sure user owns portfolio
        if (portfolio.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this portfolio',
            });
        }

        res.status(200).json({
            success: true,
            data: portfolio,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get portfolio by slug (public)
// @route   GET /api/portfolios/public/:slug
// @access  Public
const getPortfolioBySlug = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({
            slug: req.params.slug,
            isPublic: true,
        }).populate('user', 'name email');

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio not found',
            });
        }

        res.status(200).json({
            success: true,
            data: portfolio,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Create portfolio
// @route   POST /api/portfolios
// @access  Private
const createPortfolio = async (req, res) => {
    try {
        req.body.user = req.user.id;

        const portfolio = await Portfolio.create(req.body);

        res.status(201).json({
            success: true,
            data: portfolio,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Update portfolio
// @route   PUT /api/portfolios/:id
// @access  Private
const updatePortfolio = async (req, res) => {
    try {
        let portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio not found',
            });
        }

        // Make sure user owns portfolio
        if (portfolio.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this portfolio',
            });
        }

        // Update fields manually to trigger pre-save hook for slug generation
        Object.assign(portfolio, req.body);
        await portfolio.save();

        console.log('Portfolio saved with slug:', portfolio.slug);

        res.status(200).json({
            success: true,
            data: portfolio,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Delete portfolio
// @route   DELETE /api/portfolios/:id
// @access  Private
const deletePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio not found',
            });
        }

        // Make sure user owns portfolio
        if (portfolio.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this portfolio',
            });
        }

        await portfolio.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Portfolio deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Toggle portfolio visibility
// @route   PUT /api/portfolios/:id/visibility
// @access  Private
const toggleVisibility = async (req, res) => {
    try {
        let portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio not found',
            });
        }

        // Make sure user owns portfolio
        if (portfolio.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this portfolio',
            });
        }

        portfolio.isPublic = !portfolio.isPublic;
        await portfolio.save();

        res.status(200).json({
            success: true,
            data: portfolio,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    getPortfolios,
    getPortfolio,
    getPortfolioBySlug,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    toggleVisibility,
};
