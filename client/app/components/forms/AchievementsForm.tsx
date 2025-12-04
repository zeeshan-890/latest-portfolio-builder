'use client';

import { Plus, Trash2, Award, Trophy, FileText, Star } from 'lucide-react';
import { usePortfolioStore, Achievement } from '@/app/store/portfolioStore';

const AchievementsForm = () => {
    const { portfolioData, addAchievement, updateAchievement, removeAchievement } =
        usePortfolioStore();

    const handleAdd = () => {
        const newAchievement: Achievement = {
            id: Date.now(),
            title: '',
            organization: '',
            date: '',
            description: '',
            type: 'award',
        };
        addAchievement(newAchievement);
    };

    const getTypeIcon = (type: Achievement['type']) => {
        switch (type) {
            case 'award':
                return <Trophy className="w-4 h-4 text-yellow-400" />;
            case 'certification':
                return <Award className="w-4 h-4 text-blue-400" />;
            case 'publication':
                return <FileText className="w-4 h-4 text-green-400" />;
            default:
                return <Star className="w-4 h-4 text-purple-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Achievements & Recognition</h3>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Achievement</span>
                </button>
            </div>

            {portfolioData.achievements.map((achievement, index) => (
                <div key={achievement.id} className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            {getTypeIcon(achievement.type)}
                            <h4 className="text-lg font-medium text-blue-400">Achievement #{index + 1}</h4>
                        </div>
                        <button
                            onClick={() => removeAchievement(achievement.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                            <input
                                type="text"
                                value={achievement.title}
                                onChange={(e) => updateAchievement(achievement.id, { title: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="Best Innovation Award"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                            <select
                                value={achievement.type}
                                onChange={(e) =>
                                    updateAchievement(achievement.id, {
                                        type: e.target.value as Achievement['type'],
                                    })
                                }
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                            >
                                <option value="award">Award</option>
                                <option value="certification">Certification</option>
                                <option value="publication">Publication</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Organization</label>
                            <input
                                type="text"
                                value={achievement.organization}
                                onChange={(e) =>
                                    updateAchievement(achievement.id, { organization: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                placeholder="Company or Institution"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                            <input
                                type="month"
                                value={achievement.date}
                                onChange={(e) => updateAchievement(achievement.id, { date: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={achievement.description}
                            onChange={(e) => updateAchievement(achievement.id, { description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-none"
                            placeholder="Describe this achievement and its significance..."
                        />
                    </div>
                </div>
            ))}

            {portfolioData.achievements.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No achievements yet. Click &quot;Add Achievement&quot; to highlight your accomplishments.</p>
                </div>
            )}
        </div>
    );
};

export default AchievementsForm;
