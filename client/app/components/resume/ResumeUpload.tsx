'use client';

import { useState, useRef, useCallback } from 'react';
import { usePortfolioStore, PortfolioData } from '../../store/portfolioStore';
import api, { ParsedResumeData } from '../../lib/api';

interface ResumeUploadProps {
    onClose?: () => void;
}

export default function ResumeUpload({ onClose }: ResumeUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showTextInput, setShowTextInput] = useState(false);
    const [resumeText, setResumeText] = useState('');
    const [parsedPreview, setParsedPreview] = useState<ParsedResumeData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { importData } = usePortfolioStore();

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/png',
        'image/jpeg',
        'image/jpg',
    ];

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const validateFile = (file: File): boolean => {
        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Allowed: PDF, DOC, DOCX, TXT, PNG, JPG');
            return false;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('File too large. Maximum size is 10MB.');
            return false;
        }
        return true;
    };

    const parseResumeFile = async (file: File) => {
        if (!validateFile(file)) return;

        setError(null);
        setIsUploading(true);
        setIsParsing(true);

        try {
            const response = await api.parseResume(file);

            if (response.success && response.data) {
                setParsedPreview(response.data);
                setSuccess(true);
            } else {
                throw new Error(response.message || 'Failed to parse resume');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse resume');
        } finally {
            setIsUploading(false);
            setIsParsing(false);
        }
    };

    const parseResumeTextContent = async () => {
        if (resumeText.trim().length < 50) {
            setError('Please provide at least 50 characters of resume content');
            return;
        }

        setError(null);
        setIsParsing(true);

        try {
            const response = await api.parseResumeText(resumeText);

            if (response.success && response.data) {
                setParsedPreview(response.data);
                setSuccess(true);
            } else {
                throw new Error(response.message || 'Failed to parse resume');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse resume');
        } finally {
            setIsParsing(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            parseResumeFile(file);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            parseResumeFile(file);
        }
    };

    const applyParsedData = () => {
        if (parsedPreview) {
            // Convert ParsedResumeData to PortfolioData format
            const portfolioData: PortfolioData = {
                personal: {
                    fullName: parsedPreview.personal.fullName,
                    title: parsedPreview.personal.title,
                    email: parsedPreview.personal.email,
                    phone: parsedPreview.personal.phone,
                    location: parsedPreview.personal.location,
                    website: parsedPreview.personal.website,
                    linkedin: parsedPreview.personal.linkedin,
                    github: parsedPreview.personal.github,
                    twitter: parsedPreview.personal.twitter,
                    summary: parsedPreview.personal.summary,
                    profileImage: parsedPreview.personal.profileImage,
                },
                education: parsedPreview.education,
                experience: parsedPreview.experience,
                skills: parsedPreview.skills,
                projects: parsedPreview.projects,
                achievements: parsedPreview.achievements,
                contact: parsedPreview.contact,
            };

            importData(portfolioData);
            if (onClose) onClose();
        }
    };

    const resetUpload = () => {
        setError(null);
        setSuccess(false);
        setParsedPreview(null);
        setResumeText('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Import Resume</h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {!success ? (
                <>
                    <p className="text-gray-600 mb-6">
                        Upload your resume and we&apos;ll use AI to automatically fill in your portfolio details.
                    </p>

                    {/* Tab Switcher */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setShowTextInput(false)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${!showTextInput
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Upload File
                        </button>
                        <button
                            onClick={() => setShowTextInput(true)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${showTextInput
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Paste Text
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    {!showTextInput ? (
                        /* File Upload Area */
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${isDragging
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {isParsing ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                                    <p className="text-gray-600 font-medium">
                                        {isUploading ? 'Uploading resume...' : 'Analyzing with AI...'}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        This may take a few seconds
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 font-medium mb-2">
                                        Drop your resume here, or click to browse
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        Supports PDF, DOC, DOCX, TXT, PNG, JPG (max 10MB)
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        /* Text Input Area */
                        <div className="space-y-4">
                            <textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                placeholder="Paste your resume content here..."
                                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none color-white bg-gray-50 text-gray-900"
                            />
                            <button
                                onClick={parseResumeTextContent}
                                disabled={isParsing || resumeText.trim().length < 50}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isParsing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Analyzing...
                                    </span>
                                ) : (
                                    'Parse Resume'
                                )}
                            </button>
                        </div>
                    )}

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">What we&apos;ll extract:</h3>
                        <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Personal Information
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Education History
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Work Experience
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Skills & Languages
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Projects
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Achievements & Certs
                            </li>
                        </ul>
                    </div>
                </>
            ) : (
                /* Success - Show Preview */
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-green-600 mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-lg font-medium">Resume parsed successfully!</span>
                    </div>

                    {parsedPreview && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4 max-h-80 overflow-y-auto">
                            <h3 className="font-semibold text-gray-900">Preview of extracted data:</h3>

                            {parsedPreview.personal.fullName && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Name:</span>
                                    <p className="text-gray-900">{parsedPreview.personal.fullName}</p>
                                </div>
                            )}

                            {parsedPreview.personal.title && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Title:</span>
                                    <p className="text-gray-900">{parsedPreview.personal.title}</p>
                                </div>
                            )}

                            {parsedPreview.personal.email && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Email:</span>
                                    <p className="text-gray-900">{parsedPreview.personal.email}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Education:</span>
                                    <p className="text-gray-900">{parsedPreview.education.length} entries</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Experience:</span>
                                    <p className="text-gray-900">{parsedPreview.experience.length} entries</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Skills:</span>
                                    <p className="text-gray-900">
                                        {parsedPreview.skills.technical.length + parsedPreview.skills.soft.length} skills
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Projects:</span>
                                    <p className="text-gray-900">{parsedPreview.projects.length} projects</p>
                                </div>
                            </div>

                            {parsedPreview.skills.technical.length > 0 && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Technical Skills:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {parsedPreview.skills.technical.slice(0, 8).map((skill, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                        {parsedPreview.skills.technical.length > 8 && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                +{parsedPreview.skills.technical.length - 8} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={resetUpload}
                            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Upload Different Resume
                        </button>
                        <button
                            onClick={applyParsedData}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Apply to Portfolio
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 text-center">
                        You can edit any extracted information after importing.
                    </p>
                </div>
            )}
        </div>
    );
}
