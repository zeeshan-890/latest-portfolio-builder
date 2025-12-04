const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        personalInfo: {
            fullName: { type: String, default: '' },
            title: { type: String, default: '' },
            email: { type: String, default: '' },
            phone: { type: String, default: '' },
            location: { type: String, default: '' },
            bio: { type: String, default: '' },
            avatar: { type: String, default: '' },
            socialLinks: {
                github: { type: String, default: '' },
                linkedin: { type: String, default: '' },
                twitter: { type: String, default: '' },
                website: { type: String, default: '' },
            },
        },
        education: [
            {
                institution: { type: String, default: '' },
                degree: { type: String, default: '' },
                field: { type: String, default: '' },
                startDate: { type: String, default: '' },
                endDate: { type: String, default: '' },
                description: { type: String, default: '' },
            },
        ],
        experience: [
            {
                company: { type: String, default: '' },
                position: { type: String, default: '' },
                location: { type: String, default: '' },
                startDate: { type: String, default: '' },
                endDate: { type: String, default: '' },
                current: { type: Boolean, default: false },
                description: { type: String, default: '' },
            },
        ],
        skills: {
            technical: [{ type: String }],
            soft: [{ type: String }],
            languages: [{ type: String }],
        },
        projects: [
            {
                title: { type: String, default: '' },
                description: { type: String, default: '' },
                technologies: [{ type: String }],
                liveUrl: { type: String, default: '' },
                githubUrl: { type: String, default: '' },
                image: { type: String, default: '' },
                featured: { type: Boolean, default: false },
            },
        ],
        achievements: [
            {
                title: { type: String, default: '' },
                issuer: { type: String, default: '' },
                date: { type: String, default: '' },
                description: { type: String, default: '' },
                url: { type: String, default: '' },
            },
        ],
        contact: {
            email: { type: String, default: '' },
            phone: { type: String, default: '' },
            address: { type: String, default: '' },
            availability: { type: String, default: '' },
        },
        theme: {
            selectedTheme: { type: String, default: 'modern' },
            themeVariant: { type: String, default: 'default' },
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        slug: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
    }
);

// Generate unique slug before saving
portfolioSchema.pre('save', async function (next) {
    // Generate slug if missing and we have a name
    if (!this.slug && this.personalInfo?.fullName) {
        const baseSlug = this.personalInfo.fullName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        let slug = baseSlug || 'portfolio';
        let counter = 1;

        while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug || 'portfolio'}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
    
    // If still no slug (no name provided), generate a random one
    if (!this.slug) {
        this.slug = `portfolio-${Date.now().toString(36)}`;
    }
    
    next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
