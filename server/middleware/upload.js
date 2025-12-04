const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.memoryStorage();

// File filter for resume uploads
const resumeFileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/png',
        'image/jpeg',
        'image/jpg',
    ];

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg'];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Invalid file type. Allowed types: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG'
            ),
            false
        );
    }
};

// Create multer upload instance for resumes
const uploadResume = multer({
    storage: storage,
    fileFilter: resumeFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB.',
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
};

module.exports = {
    uploadResume,
    handleMulterError,
};
