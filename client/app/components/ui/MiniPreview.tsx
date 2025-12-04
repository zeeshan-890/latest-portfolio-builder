'use client';

import { User, Briefcase, Code, FolderOpen } from 'lucide-react';
import { usePortfolioStore } from '@/app/store/portfolioStore';
import { getMiniPreviewStyles } from '@/app/utils/themes';

const MiniPreview = () => {
    const { portfolioData, selectedTheme, themeVariant } = usePortfolioStore();
    const styles = getMiniPreviewStyles(selectedTheme, themeVariant);

    return (
        <div
            className="rounded-lg p-3 text-xs min-h-48"
            style={{ background: styles.background }}
        >
            {/* Mini Header */}
            <div className="text-center mb-3">
                <div
                    className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center"
                    style={{ background: styles.card }}
                >
                    {portfolioData.personal.profileImage ? (
                        <img
                            src={portfolioData.personal.profileImage}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <User className="w-4 h-4" style={{ color: styles.accent }} />
                    )}
                </div>
                <div className="font-bold truncate" style={{ color: styles.text }}>
                    {portfolioData.personal.fullName || 'Your Name'}
                </div>
                <div className="truncate" style={{ color: styles.accent }}>
                    {portfolioData.personal.title || 'Your Title'}
                </div>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-3 gap-1">
                <div
                    className="p-1 rounded text-center"
                    style={{ background: styles.card }}
                >
                    <Briefcase className="w-3 h-3 mx-auto mb-0.5" style={{ color: styles.accent }} />
                    <div style={{ color: styles.text }}>{portfolioData.experience.length}</div>
                </div>
                <div
                    className="p-1 rounded text-center"
                    style={{ background: styles.card }}
                >
                    <Code className="w-3 h-3 mx-auto mb-0.5" style={{ color: styles.accent }} />
                    <div style={{ color: styles.text }}>{portfolioData.skills.technical.length}</div>
                </div>
                <div
                    className="p-1 rounded text-center"
                    style={{ background: styles.card }}
                >
                    <FolderOpen className="w-3 h-3 mx-auto mb-0.5" style={{ color: styles.accent }} />
                    <div style={{ color: styles.text }}>{portfolioData.projects.length}</div>
                </div>
            </div>

            {/* Skills Preview */}
            {portfolioData.skills.technical.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {portfolioData.skills.technical.slice(0, 3).map((skill, index) => (
                        <span
                            key={index}
                            className="px-1 py-0.5 rounded text-[8px]"
                            style={{ background: styles.card, color: styles.accent }}
                        >
                            {skill}
                        </span>
                    ))}
                    {portfolioData.skills.technical.length > 3 && (
                        <span
                            className="px-1 py-0.5 rounded text-[8px]"
                            style={{ color: styles.accent }}
                        >
                            +{portfolioData.skills.technical.length - 3}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default MiniPreview;
