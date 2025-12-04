'use client';

import { X, Code, User, Globe, Award } from 'lucide-react';
import { usePortfolioStore } from '@/app/store/portfolioStore';

const SkillsForm = () => {
    const { portfolioData, updateSkills } = usePortfolioStore();

    const handleSkillChange = (
        category: 'technical' | 'soft' | 'languages' | 'certifications',
        value: string
    ) => {
        const skills = value.split(',').map((s) => s.trim()).filter((s) => s);
        updateSkills({ [category]: skills });
    };

    const removeSkill = (
        category: 'technical' | 'soft' | 'languages' | 'certifications',
        index: number
    ) => {
        const updated = portfolioData.skills[category].filter((_, i) => i !== index);
        updateSkills({ [category]: updated });
    };

    const renderSkillSection = (
        title: string,
        category: 'technical' | 'soft' | 'languages' | 'certifications',
        icon: React.ReactNode,
        placeholder: string,
        tagColor: string
    ) => (
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
            <h4 className="text-lg font-medium text-blue-400 mb-4 flex items-center">
                {icon}
                <span className="ml-2">{title}</span>
            </h4>
            <div className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={portfolioData.skills[category].join(', ')}
                        onChange={(e) => handleSkillChange(category, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        placeholder={placeholder}
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {portfolioData.skills[category].map((skill, index) => (
                        <span
                            key={index}
                            className={`px-3 py-1 ${tagColor} rounded-full text-sm flex items-center space-x-2`}
                        >
                            <span>{skill}</span>
                            <button
                                onClick={() => removeSkill(category, index)}
                                className="hover:text-red-300 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Skills & Technologies</h3>

            {renderSkillSection(
                'Technical Skills',
                'technical',
                <Code className="w-5 h-5" />,
                'JavaScript, Python, React, Node.js, Docker, AWS',
                'bg-blue-600/20 text-blue-300 border border-blue-500/30'
            )}

            {renderSkillSection(
                'Soft Skills',
                'soft',
                <User className="w-5 h-5" />,
                'Communication, Leadership, Problem Solving, Team Collaboration',
                'bg-green-600/20 text-green-300 border border-green-500/30'
            )}

            {renderSkillSection(
                'Languages',
                'languages',
                <Globe className="w-5 h-5" />,
                'English, Spanish, French, German',
                'bg-purple-600/20 text-purple-300 border border-purple-500/30'
            )}

            {renderSkillSection(
                'Certifications',
                'certifications',
                <Award className="w-5 h-5" />,
                'AWS Solutions Architect, Google Cloud Professional, PMP',
                'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
            )}
        </div>
    );
};

export default SkillsForm;
