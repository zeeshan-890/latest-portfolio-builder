const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini AI - automatically picks up GEMINI_API_KEY from environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Parse resume content using Gemini AI
 * @param {string} resumeText - The text content of the resume
 * @param {string} mimeType - The MIME type of the original file
 * @param {Buffer} fileBuffer - The file buffer for PDF/image processing
 * @returns {Promise<Object>} - Parsed portfolio data
 */
async function parseResumeWithGemini(resumeText, mimeType = null, fileBuffer = null) {
    try {
        const prompt = `You are an expert resume parser. Analyze the following resume content and extract all information into a structured JSON format.

IMPORTANT: Return ONLY valid JSON, no markdown code blocks, no explanations.

The JSON structure MUST match this exact format:
{
    "personal": {
        "fullName": "string",
        "title": "string (job title/role)",
        "email": "string",
        "phone": "string",
        "location": "string (city, country)",
        "website": "string (personal website URL if any)",
        "linkedin": "string (LinkedIn URL if any)",
        "github": "string (GitHub URL if any)",
        "twitter": "string (Twitter/X URL if any)",
        "summary": "string (professional summary/objective)"
    },
    "education": [
        {
            "id": number (start from 1),
            "degree": "string (degree name)",
            "school": "string (institution name)",
            "location": "string",
            "startYear": "string (YYYY)",
            "endYear": "string (YYYY or 'Present')",
            "gpa": "string (if mentioned)",
            "description": "string (relevant coursework, honors, etc.)"
        }
    ],
    "experience": [
        {
            "id": number (start from 1),
            "title": "string (job title)",
            "company": "string",
            "location": "string",
            "startDate": "string (YYYY-MM or YYYY)",
            "endDate": "string (YYYY-MM, YYYY, or 'Present')",
            "current": boolean (true if currently working here),
            "description": "string (job responsibilities and achievements)",
            "skills": ["array of skills used in this role"]
        }
    ],
    "skills": {
        "technical": ["array of technical/hard skills"],
        "soft": ["array of soft skills"],
        "languages": ["array of programming languages or spoken languages"],
        "certifications": ["array of certifications"]
    },
    "projects": [
        {
            "id": number (start from 1),
            "title": "string",
            "description": "string",
            "technologies": ["array of technologies used"],
            "demoUrl": "string (if mentioned)",
            "githubUrl": "string (if mentioned)",
            "image": null,
            "featured": boolean (true for notable projects),
            "status": "completed" or "in-progress" or "planned"
        }
    ],
    "achievements": [
        {
            "id": number (start from 1),
            "title": "string",
            "organization": "string (issuing organization)",
            "date": "string (YYYY or YYYY-MM)",
            "description": "string",
            "type": "award" or "certification" or "publication" or "other"
        }
    ],
    "contact": {
        "preferredContact": "email",
        "availability": "string (e.g., 'Available for hire', 'Open to opportunities')",
        "timezone": "string (if mentioned, otherwise 'UTC')",
        "hourlyRate": "string (if mentioned)",
        "responseTime": "24 hours"
    }
}

Rules:
1. Extract as much information as possible from the resume
2. If a field is not found, use empty string "" for strings, empty array [] for arrays
3. Be intelligent about categorizing skills (technical vs soft vs languages)
4. Parse dates in a consistent format
5. Identify certifications and add them to both skills.certifications and achievements
6. Make sure all IDs are unique sequential numbers starting from 1
7. The description fields should be detailed and professional

Resume Content:
${resumeText}

Return ONLY the JSON object, nothing else.`;

        let response;

        // If we have a PDF or image file, use multimodal capabilities
        if (fileBuffer && mimeType && (mimeType.includes('pdf') || mimeType.includes('image'))) {
            const base64Data = fileBuffer.toString('base64');

            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64Data,
                                },
                            },
                        ],
                    },
                ],
            });
        } else {
            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
        }

        let text = response.text;

        // Clean up the response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the JSON
        const parsedData = JSON.parse(text);

        // Validate and ensure all required fields exist
        return validateAndNormalizeData(parsedData);
    } catch (error) {
        console.error('Gemini parsing error:', error);
        throw new Error(`Failed to parse resume: ${error.message}`);
    }
}

/**
 * Validate and normalize the parsed data to ensure it matches expected structure
 */
function validateAndNormalizeData(data) {
    const normalized = {
        personal: {
            fullName: data.personal?.fullName || '',
            title: data.personal?.title || '',
            email: data.personal?.email || '',
            phone: data.personal?.phone || '',
            location: data.personal?.location || '',
            website: data.personal?.website || '',
            linkedin: data.personal?.linkedin || '',
            github: data.personal?.github || '',
            twitter: data.personal?.twitter || '',
            summary: data.personal?.summary || '',
            profileImage: null,
        },
        education: (data.education || []).map((edu, index) => ({
            id: edu.id || index + 1,
            degree: edu.degree || '',
            school: edu.school || '',
            location: edu.location || '',
            startYear: edu.startYear || '',
            endYear: edu.endYear || '',
            gpa: edu.gpa || '',
            description: edu.description || '',
        })),
        experience: (data.experience || []).map((exp, index) => ({
            id: exp.id || index + 1,
            title: exp.title || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: exp.current || false,
            description: exp.description || '',
            skills: exp.skills || [],
        })),
        skills: {
            technical: data.skills?.technical || [],
            soft: data.skills?.soft || [],
            languages: data.skills?.languages || [],
            certifications: data.skills?.certifications || [],
        },
        projects: (data.projects || []).map((proj, index) => ({
            id: proj.id || index + 1,
            title: proj.title || '',
            description: proj.description || '',
            technologies: proj.technologies || [],
            demoUrl: proj.demoUrl || '',
            githubUrl: proj.githubUrl || '',
            image: null,
            featured: proj.featured || false,
            status: proj.status || 'completed',
        })),
        achievements: (data.achievements || []).map((ach, index) => ({
            id: ach.id || index + 1,
            title: ach.title || '',
            organization: ach.organization || '',
            date: ach.date || '',
            description: ach.description || '',
            type: ach.type || 'other',
        })),
        contact: {
            preferredContact: data.contact?.preferredContact || 'email',
            availability: data.contact?.availability || 'Available for hire',
            timezone: data.contact?.timezone || 'UTC',
            hourlyRate: data.contact?.hourlyRate || '',
            responseTime: data.contact?.responseTime || '24 hours',
        },
    };

    return normalized;
}

/**
 * Extract text from various file types
 */
async function extractTextFromFile(buffer, mimeType) {
    // For text-based files, just convert buffer to string
    if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
        return buffer.toString('utf-8');
    }

    // For DOCX files, we'll need to extract text
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Basic DOCX text extraction (you might want to add mammoth or docx library for better extraction)
        const text = buffer.toString('utf-8');
        // Remove XML tags and get readable text
        return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // For PDF and images, we'll use Gemini's multimodal capabilities directly
    return null;
}

module.exports = {
    parseResumeWithGemini,
    extractTextFromFile,
};
