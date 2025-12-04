'use client';

import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { usePortfolioStore, Education } from '@/app/store/portfolioStore';

const EducationForm = () => {
    const { portfolioData, addEducation, updateEducation, removeEducation } = usePortfolioStore();

    const handleAdd = () => {
        const newEducation: Education = {
            id: Date.now(),
            degree: '',
            school: '',
            location: '',
            startYear: '',
            endYear: '',
            gpa: '',
            description: '',
        };
        addEducation(newEducation);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Education</h3>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                </button>
            </div>

            {portfolioData.education.map((edu, index) => (
                <div key={edu.id} className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-medium text-blue-400">Education #{index + 1}</h4>
                        <button
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Degree *</label>
                            <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="Bachelor of Computer Science"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                School/University *
                            </label>
                            <input
                                type="text"
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="Stanford University"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                            <input
                                type="text"
                                value={edu.location}
                                onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="California, USA"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Start Year</label>
                            <input
                                type="number"
                                value={edu.startYear}
                                onChange={(e) => updateEducation(edu.id, { startYear: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="2020"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">End Year</label>
                            <input
                                type="number"
                                value={edu.endYear}
                                onChange={(e) => updateEducation(edu.id, { endYear: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="2024"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">GPA (Optional)</label>
                            <input
                                type="text"
                                value={edu.gpa}
                                onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="3.8/4.0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={edu.description}
                            onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-none"
                            placeholder="Key achievements, relevant coursework, honors, etc."
                        />
                    </div>
                </div>
            ))}

            {portfolioData.education.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No education entries yet. Click &quot;Add Education&quot; to get started.</p>
                </div>
            )}
        </div>
    );
};

export default EducationForm;
