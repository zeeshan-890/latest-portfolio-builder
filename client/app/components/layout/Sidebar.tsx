'use client';

import { useState, useEffect } from 'react';
import { Palette, BarChart } from 'lucide-react';
import { usePortfolioStore } from '@/app/store/portfolioStore';
import { themes } from '@/app/utils/themes';
import MiniPreview from '@/app/components/ui/MiniPreview';

const Sidebar = () => {
    const [isClient, setIsClient] = useState(false);
    const {
        portfolioData,
        selectedTheme,
        setSelectedTheme,
        themeVariant,
        setThemeVariant,
        getCompletionScore,
    } = usePortfolioStore();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const currentTheme = themes.find((t) => t.id === selectedTheme);

    return (
        <div className="w-80 space-y-6 p-6">
            {/* Theme Selector with Variants */}
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Choose Theme
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    {themes.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => setSelectedTheme(theme.id)}
                            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${selectedTheme === theme.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-600 hover:border-gray-500'
                                }`}
                        >
                            <div
                                className="w-full h-12 rounded-md mb-2"
                                style={{ background: theme.preview }}
                            />
                            <span className="text-xs font-medium text-white">{theme.name}</span>
                        </button>
                    ))}
                </div>

                {/* Theme Variants */}
                {currentTheme && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Variants</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {currentTheme.variants.map((variant) => (
                                <button
                                    key={variant}
                                    onClick={() => setThemeVariant(variant)}
                                    className={`px-3 py-2 rounded-lg text-xs transition-all ${themeVariant === variant
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Live Preview */}
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
                <div className="bg-gray-700 rounded-lg p-4 min-h-64">
                    <MiniPreview />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart className="w-5 h-5 mr-2" />
                    Portfolio Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                            {portfolioData.education.length}
                        </div>
                        <div className="text-xs text-gray-400">Education</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                            {portfolioData.experience.length}
                        </div>
                        <div className="text-xs text-gray-400">Experience</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                            {portfolioData.skills.technical.length}
                        </div>
                        <div className="text-xs text-gray-400">Skills</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                            {portfolioData.projects.length}
                        </div>
                        <div className="text-xs text-gray-400">Projects</div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-center">
                        <div className="text-sm text-gray-300 mb-2">Completion Score</div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${isClient ? getCompletionScore() : 0}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{isClient ? getCompletionScore() : 0}% Complete</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
