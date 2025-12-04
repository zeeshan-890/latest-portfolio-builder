'use client';

import { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { usePortfolioStore } from '@/app/store/portfolioStore';

const PersonalInfoForm = () => {
    const { portfolioData, updatePersonal } = usePortfolioStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updatePersonal({ profileImage: e.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-600">
                        {portfolioData.personal.profileImage ? (
                            <img
                                src={portfolioData.personal.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Camera className="w-12 h-12 text-gray-400" />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        <Upload className="w-5 h-5" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </div>
                <div>
                    <h4 className="text-lg font-medium text-gray-300 mb-2">Profile Photo</h4>
                    <p className="text-sm text-gray-500 mb-3">
                        Upload a professional headshot (recommended: 400x400px)
                    </p>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                        >
                            Upload New
                        </button>
                        {portfolioData.personal.profileImage && (
                            <button
                                onClick={() => updatePersonal({ profileImage: null })}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input
                        type="text"
                        value={portfolioData.personal.fullName}
                        onChange={(e) => updatePersonal({ fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Professional Title *
                    </label>
                    <input
                        type="text"
                        value={portfolioData.personal.title}
                        onChange={(e) => updatePersonal({ title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Full Stack Developer"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                        type="email"
                        value={portfolioData.personal.email}
                        onChange={(e) => updatePersonal({ email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                        type="tel"
                        value={portfolioData.personal.phone}
                        onChange={(e) => updatePersonal({ phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="+1 (555) 123-4567"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                        type="text"
                        value={portfolioData.personal.location}
                        onChange={(e) => updatePersonal({ location: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="San Francisco, CA"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <input
                        type="url"
                        value={portfolioData.personal.website}
                        onChange={(e) => updatePersonal({ website: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="https://johndoe.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                    <input
                        type="url"
                        value={portfolioData.personal.linkedin}
                        onChange={(e) => updatePersonal({ linkedin: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="https://linkedin.com/in/johndoe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                <input
                    type="url"
                    value={portfolioData.personal.github}
                    onChange={(e) => updatePersonal({ github: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="https://github.com/johndoe"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
                <textarea
                    value={portfolioData.personal.summary}
                    onChange={(e) => updatePersonal({ summary: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                    placeholder="Brief overview of your professional background, skills, and career objectives..."
                />
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">Recommended: 150-300 characters</p>
                    <p className="text-xs text-gray-400">{portfolioData.personal.summary.length} characters</p>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;
