'use client';

import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, CheckCircle } from 'lucide-react';
import { usePortfolioStore } from '@/app/store/portfolioStore';

const ContactForm = () => {
    const { portfolioData, updatePersonal } = usePortfolioStore();

    const calculateCompletion = () => {
        let completed = 0;
        let total = 7;

        if (portfolioData.personal.fullName) completed++;
        if (portfolioData.personal.title) completed++;
        if (portfolioData.personal.email) completed++;
        if (portfolioData.education.length > 0) completed++;
        if (portfolioData.experience.length > 0) completed++;
        if (
            portfolioData.skills.technical.length > 0 ||
            portfolioData.skills.soft.length > 0
        )
            completed++;
        if (portfolioData.projects.length > 0) completed++;

        return Math.round((completed / total) * 100);
    };

    const completionPercentage = calculateCompletion();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Contact Information</h3>
                <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>{completionPercentage}% Complete</span>
                </div>
            </div>

            {/* Completion Summary */}
            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                <h4 className="text-lg font-medium text-white mb-4">Portfolio Completion</h4>
                <div className="w-full bg-gray-600 rounded-full h-3 mb-4">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-600/50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-400">
                            {portfolioData.education.length}
                        </p>
                        <p className="text-xs text-gray-400">Education</p>
                    </div>
                    <div className="text-center p-3 bg-gray-600/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-400">
                            {portfolioData.experience.length}
                        </p>
                        <p className="text-xs text-gray-400">Experience</p>
                    </div>
                    <div className="text-center p-3 bg-gray-600/50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-400">
                            {portfolioData.projects.length}
                        </p>
                        <p className="text-xs text-gray-400">Projects</p>
                    </div>
                    <div className="text-center p-3 bg-gray-600/50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-400">
                            {portfolioData.achievements.length}
                        </p>
                        <p className="text-xs text-gray-400">Achievements</p>
                    </div>
                </div>
            </div>

            {/* Contact Details */}
            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                <h4 className="text-lg font-medium text-white mb-4">Contact Details</h4>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={portfolioData.personal.email}
                            onChange={(e) => updatePersonal({ email: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="your.email@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={portfolioData.personal.phone}
                            onChange={(e) => updatePersonal({ phone: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Location
                    </label>
                    <input
                        type="text"
                        value={portfolioData.personal.location}
                        onChange={(e) => updatePersonal({ location: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        placeholder="San Francisco, CA"
                    />
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                <h4 className="text-lg font-medium text-white mb-4">Social & Professional Links</h4>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Globe className="w-4 h-4 inline mr-2" />
                            Website
                        </label>
                        <input
                            type="url"
                            value={portfolioData.personal.website || ''}
                            onChange={(e) => updatePersonal({ website: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="https://yourwebsite.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Linkedin className="w-4 h-4 inline mr-2" />
                            LinkedIn
                        </label>
                        <input
                            type="url"
                            value={portfolioData.personal.linkedin || ''}
                            onChange={(e) => updatePersonal({ linkedin: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Github className="w-4 h-4 inline mr-2" />
                            GitHub
                        </label>
                        <input
                            type="url"
                            value={portfolioData.personal.github || ''}
                            onChange={(e) => updatePersonal({ github: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="https://github.com/yourusername"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Twitter className="w-4 h-4 inline mr-2" />
                            Twitter / X
                        </label>
                        <input
                            type="url"
                            value={portfolioData.personal.twitter || ''}
                            onChange={(e) => updatePersonal({ twitter: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="https://twitter.com/yourusername"
                        />
                    </div>
                </div>
            </div>

            {/* Ready to Publish */}
            {completionPercentage >= 70 && (
                <div className="bg-green-900/30 border border-green-600 rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-green-400 mb-2">
                        Your Portfolio is Ready!
                    </h4>
                    <p className="text-gray-300">
                        You&apos;ve completed {completionPercentage}% of your portfolio. Click &quot;Preview Portfolio&quot;
                        to see how it looks!
                    </p>
                </div>
            )}
        </div>
    );
};

export default ContactForm;
