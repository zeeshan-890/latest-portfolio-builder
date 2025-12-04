'use client';

import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Github,
    Twitter,
    Calendar,
    Building2,
    GraduationCap,
    Briefcase,
    Star,
    ExternalLink,
    Award,
    Trophy,
    FileText,
    Edit3,
    Download,
    Share2,
} from 'lucide-react';
import { usePortfolioStore, Achievement } from '@/app/store/portfolioStore';
import { getPreviewThemeConfig } from '@/app/utils/themes';
import { handleExport } from '@/app/utils/exportHelpers';

const PreviewMode = () => {
    const { 
        portfolioData, 
        selectedTheme, 
        themeVariant, 
        setShowPreview,
        exportFormat,
        isExporting,
        setIsExporting,
        setShowShareModal,
        setShareUrl,
    } = usePortfolioStore();
    const theme = getPreviewThemeConfig(selectedTheme, themeVariant);

    const handleExportClick = async () => {
        if (!portfolioData.personal.fullName) {
            alert('Please add your name before exporting');
            return;
        }
        setIsExporting(true);
        try {
            await handleExport(exportFormat, portfolioData);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const generateShareUrl = () => {
        const baseUrl = 'https://portfolio-builder.app/share/';
        const portfolioId = Date.now().toString(36);
        const url = `${baseUrl}${portfolioId}`;
        setShareUrl(url);
        setShowShareModal(true);
    };

    const getAchievementIcon = (type: Achievement['type']) => {
        switch (type) {
            case 'award':
                return <Trophy className="w-5 h-5" />;
            case 'certification':
                return <Award className="w-5 h-5" />;
            case 'publication':
                return <FileText className="w-5 h-5" />;
            default:
                return <Star className="w-5 h-5" />;
        }
    };

    return (
        <div className={`min-h-screen ${theme.background}`}>
            {/* Fixed Header Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Portfolio Preview
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={generateShareUrl}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm text-white"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                        <button
                            onClick={handleExportClick}
                            disabled={isExporting}
                            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm text-white disabled:opacity-50"
                        >
                            {isExporting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">Export</span>
                        </button>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm text-white"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Back to Edit</span>
                        </button>
                    </div>
                </div>
            </header>
            
            {/* Add padding for fixed header */}
            <div className="pt-16">
            {/* Hero Section */}
            <section className={`${theme.heroGradient} py-20`}>
                <div className="max-w-4xl mx-auto px-6 text-center">
                    {portfolioData.personal.profileImage && (
                        <img
                            src={portfolioData.personal.profileImage}
                            alt={portfolioData.personal.fullName}
                            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/20 object-cover shadow-xl"
                        />
                    )}
                    <h1 className={`text-5xl font-bold mb-4 ${theme.headingColor}`}>
                        {portfolioData.personal.fullName || 'Your Name'}
                    </h1>
                    <p className={`text-2xl mb-6 ${theme.subtitleColor}`}>
                        {portfolioData.personal.title || 'Your Professional Title'}
                    </p>
                    <p className={`text-lg max-w-2xl mx-auto mb-8 ${theme.textColor}`}>
                        {portfolioData.personal.summary || 'Your professional summary will appear here.'}
                    </p>

                    {/* Contact Info */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {portfolioData.personal.email && (
                            <a
                                href={`mailto:${portfolioData.personal.email}`}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${theme.badgeBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Mail className="w-4 h-4" />
                                <span>{portfolioData.personal.email}</span>
                            </a>
                        )}
                        {portfolioData.personal.phone && (
                            <a
                                href={`tel:${portfolioData.personal.phone}`}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${theme.badgeBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Phone className="w-4 h-4" />
                                <span>{portfolioData.personal.phone}</span>
                            </a>
                        )}
                        {portfolioData.personal.location && (
                            <span
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${theme.badgeBackground}`}
                            >
                                <MapPin className="w-4 h-4" />
                                <span>{portfolioData.personal.location}</span>
                            </span>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-4 mt-6">
                        {portfolioData.personal.website && (
                            <a
                                href={portfolioData.personal.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-full ${theme.badgeBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Globe className="w-5 h-5" />
                            </a>
                        )}
                        {portfolioData.personal.linkedin && (
                            <a
                                href={portfolioData.personal.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-full ${theme.badgeBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                        {portfolioData.personal.github && (
                            <a
                                href={portfolioData.personal.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-full ${theme.badgeBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                        {portfolioData.personal.twitter && (
                            <a
                                href={portfolioData.personal.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-full ${theme.badgeBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            {portfolioData.experience.length > 0 && (
                <section className="py-16 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className={`text-3xl font-bold mb-8 flex items-center ${theme.headingColor}`}
                        >
                            <Briefcase className={`w-8 h-8 mr-3 ${theme.accentColor}`} />
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {portfolioData.experience.map((exp) => (
                                <div
                                    key={exp.id}
                                    className={`${theme.cardBackground} rounded-xl p-6 shadow-lg`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className={`text-xl font-semibold ${theme.headingColor}`}>
                                                {exp.title}
                                            </h3>
                                            <p className={`flex items-center ${theme.accentColor}`}>
                                                <Building2 className="w-4 h-4 mr-2" />
                                                {exp.company}
                                            </p>
                                        </div>
                                        <span className={`text-sm ${theme.mutedColor}`}>
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <p className={`mt-4 ${theme.textColor}`}>{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Education Section */}
            {portfolioData.education.length > 0 && (
                <section className={`py-16 px-6 ${theme.altBackground}`}>
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className={`text-3xl font-bold mb-8 flex items-center ${theme.headingColor}`}
                        >
                            <GraduationCap className={`w-8 h-8 mr-3 ${theme.accentColor}`} />
                            Education
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {portfolioData.education.map((edu) => (
                                <div
                                    key={edu.id}
                                    className={`${theme.cardBackground} rounded-xl p-6 shadow-lg`}
                                >
                                    <h3 className={`text-xl font-semibold ${theme.headingColor}`}>
                                        {edu.degree}
                                    </h3>
                                    <p className={theme.accentColor}>{edu.school}</p>
                                    <p className={`text-sm mt-2 ${theme.mutedColor}`}>
                                        {edu.startYear} - {edu.endYear}
                                    </p>
                                    {edu.gpa && (
                                        <p className={`text-sm mt-1 ${theme.textColor}`}>GPA: {edu.gpa}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {(portfolioData.skills.technical.length > 0 ||
                portfolioData.skills.soft.length > 0 ||
                portfolioData.skills.languages.length > 0) && (
                    <section className="py-16 px-6">
                        <div className="max-w-4xl mx-auto">
                            <h2
                                className={`text-3xl font-bold mb-8 flex items-center ${theme.headingColor}`}
                            >
                                <Star className={`w-8 h-8 mr-3 ${theme.accentColor}`} />
                                Skills
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {portfolioData.skills.technical.length > 0 && (
                                    <div className={`${theme.cardBackground} rounded-xl p-6 shadow-lg`}>
                                        <h3 className={`text-lg font-semibold mb-4 ${theme.headingColor}`}>
                                            Technical
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {portfolioData.skills.technical.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-3 py-1 rounded-full text-sm ${theme.skillBadge}`}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {portfolioData.skills.soft.length > 0 && (
                                    <div className={`${theme.cardBackground} rounded-xl p-6 shadow-lg`}>
                                        <h3 className={`text-lg font-semibold mb-4 ${theme.headingColor}`}>
                                            Soft Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {portfolioData.skills.soft.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-3 py-1 rounded-full text-sm ${theme.skillBadgeSoft}`}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {portfolioData.skills.languages.length > 0 && (
                                    <div className={`${theme.cardBackground} rounded-xl p-6 shadow-lg`}>
                                        <h3 className={`text-lg font-semibold mb-4 ${theme.headingColor}`}>
                                            Languages
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {portfolioData.skills.languages.map((lang, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-3 py-1 rounded-full text-sm ${theme.skillBadgeLang}`}
                                                >
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

            {/* Projects Section */}
            {portfolioData.projects.length > 0 && (
                <section className={`py-16 px-6 ${theme.altBackground}`}>
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className={`text-3xl font-bold mb-8 flex items-center ${theme.headingColor}`}
                        >
                            <Briefcase className={`w-8 h-8 mr-3 ${theme.accentColor}`} />
                            Projects
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {portfolioData.projects.map((project) => (
                                <div
                                    key={project.id}
                                    className={`${theme.cardBackground} rounded-xl overflow-hidden shadow-lg`}
                                >
                                    {project.image && (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className={`text-xl font-semibold ${theme.headingColor}`}>
                                                {project.title}
                                            </h3>
                                            {project.featured && (
                                                <Star className={`w-5 h-5 ${theme.accentColor} fill-current`} />
                                            )}
                                        </div>
                                        <p className={`mb-4 ${theme.textColor}`}>{project.description}</p>
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.technologies.map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className={`px-2 py-1 rounded text-xs ${theme.techBadge}`}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-4">
                                            {project.demoUrl && (
                                                <a
                                                    href={project.demoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center text-sm ${theme.linkColor} hover:underline`}
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-1" />
                                                    Live Demo
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center text-sm ${theme.linkColor} hover:underline`}
                                                >
                                                    <Github className="w-4 h-4 mr-1" />
                                                    Source
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Achievements Section */}
            {portfolioData.achievements.length > 0 && (
                <section className="py-16 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2
                            className={`text-3xl font-bold mb-8 flex items-center ${theme.headingColor}`}
                        >
                            <Award className={`w-8 h-8 mr-3 ${theme.accentColor}`} />
                            Achievements
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {portfolioData.achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`${theme.cardBackground} rounded-xl p-6 shadow-lg`}
                                >
                                    <div className="flex items-start">
                                        <div className={`p-2 rounded-lg mr-4 ${theme.iconBackground}`}>
                                            {getAchievementIcon(achievement.type)}
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-semibold ${theme.headingColor}`}>
                                                {achievement.title}
                                            </h3>
                                            {achievement.organization && (
                                                <p className={theme.accentColor}>{achievement.organization}</p>
                                            )}
                                            {achievement.date && (
                                                <p className={`text-sm ${theme.mutedColor}`}>
                                                    {achievement.date}
                                                </p>
                                            )}
                                            {achievement.description && (
                                                <p className={`mt-2 text-sm ${theme.textColor}`}>
                                                    {achievement.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className={`py-8 text-center ${theme.footerBackground}`}>
                <p className={theme.mutedColor}>
                    &copy; {new Date().getFullYear()}{' '}
                    {portfolioData.personal.fullName || 'Your Name'}. All rights reserved.
                </p>
            </footer>
            </div>
        </div>
    );
};

export default PreviewMode;
