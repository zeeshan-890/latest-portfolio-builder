'use client';

import { Plus, Trash2, Briefcase } from 'lucide-react';
import { usePortfolioStore, Experience } from '@/app/store/portfolioStore';

const ExperienceForm = () => {
    const { portfolioData, addExperience, updateExperience, removeExperience } = usePortfolioStore();

    const handleAdd = () => {
        const newExperience: Experience = {
            id: Date.now(),
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            skills: [],
        };
        addExperience(newExperience);
    };

    const handleSkillsChange = (id: number, value: string) => {
        const skills = value.split(',').map((s) => s.trim()).filter((s) => s);
        updateExperience(id, { skills });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Work Experience</h3>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                </button>
            </div>

            {portfolioData.experience.map((exp, index) => (
                <div key={exp.id} className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-medium text-blue-400">Experience #{index + 1}</h4>
                        <button
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                            <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="Senior Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="Tech Company Inc."
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                            <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="San Francisco, CA"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                            <input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                            <input
                                type="month"
                                value={exp.current ? '' : exp.endDate}
                                disabled={exp.current}
                                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) =>
                                    updateExperience(exp.id, {
                                        current: e.target.checked,
                                        endDate: e.target.checked ? '' : exp.endDate,
                                    })
                                }
                                className="rounded border-gray-500 bg-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-300">Currently working here</span>
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                        <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-none"
                            placeholder="Describe your role, responsibilities, and key achievements..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Key Skills Used</label>
                        <input
                            type="text"
                            value={exp.skills?.join(', ') || ''}
                            onChange={(e) => handleSkillsChange(exp.id, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            placeholder="React, Node.js, PostgreSQL, AWS"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                    </div>
                </div>
            ))}

            {portfolioData.experience.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No work experience yet. Click &quot;Add Experience&quot; to get started.</p>
                </div>
            )}
        </div>
    );
};

export default ExperienceForm;
