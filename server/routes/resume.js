const express = require('express');
const router = express.Router();
const { uploadResume, handleMulterError } = require('../middleware/upload');
const { parseResumeWithGemini, extractTextFromFile } = require('../services/geminiService');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/resume/parse
 * @desc    Upload and parse a resume using Gemini AI
 * @access  Private
 */
router.post(
    '/parse',
    protect,
    uploadResume.single('resume'),
    handleMulterError,
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Please upload a resume file',
                });
            }

            const { buffer, mimetype, originalname } = req.file;

            console.log(`Parsing resume: ${originalname} (${mimetype})`);

            // For PDF and images, pass buffer directly to Gemini for multimodal processing
            let resumeText = null;
            let useMultimodal = false;

            if (mimetype === 'application/pdf' || mimetype.startsWith('image/')) {
                useMultimodal = true;
                resumeText = `File: ${originalname}`; // Placeholder, actual content will be read by Gemini
            } else {
                // Extract text from text-based files
                resumeText = await extractTextFromFile(buffer, mimetype);

                if (!resumeText || resumeText.trim().length < 50) {
                    return res.status(400).json({
                        success: false,
                        message:
                            'Could not extract enough text from the file. Please try a different format.',
                    });
                }
            }

            // Parse resume using Gemini
            const parsedData = await parseResumeWithGemini(
                resumeText,
                useMultimodal ? mimetype : null,
                useMultimodal ? buffer : null
            );

            res.status(200).json({
                success: true,
                message: 'Resume parsed successfully',
                data: parsedData,
            });
        } catch (error) {
            console.error('Resume parsing error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to parse resume',
            });
        }
    }
);

/**
 * @route   POST /api/resume/parse-text
 * @desc    Parse resume from pasted text using Gemini AI
 * @access  Private
 */
router.post('/parse-text', protect, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length < 50) {
            return res.status(400).json({
                success: false,
                message: 'Please provide resume text (minimum 50 characters)',
            });
        }

        // Parse resume using Gemini
        const parsedData = await parseResumeWithGemini(text);

        res.status(200).json({
            success: true,
            message: 'Resume parsed successfully',
            data: parsedData,
        });
    } catch (error) {
        console.error('Resume text parsing error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to parse resume text',
        });
    }
});

module.exports = router;
