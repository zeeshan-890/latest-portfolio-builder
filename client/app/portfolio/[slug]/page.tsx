'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Sparkles,
    Github,
    Linkedin,
    Twitter,
    Globe,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ExternalLink,
    Building2,
    GraduationCap,
    Briefcase,
    Award,
    Trophy,
    FileText,
    Star,
} from 'lucide-react';
import api, { Portfolio } from '@/app/lib/api';
import { getPreviewThemeConfig } from '@/app/utils/themes';

export default function PublicPortfolioPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPortfolio() {
            try {
                const response = await api.getPublicPortfolio(slug);
                if (response.success && response.data) {
                    setPortfolio(response.data);
                } else {
                    setError('Portfolio not found');
                }
            } catch {
                setError('Failed to load portfolio');
            } finally {
                setIsLoading(false);
            }
        }

        if (slug) {
            loadPortfolio();
        }
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    if (error || !portfolio) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Portfolio Not Found</h1>
                    <p className="text-gray-400 mb-8">{error || 'This portfolio does not exist or is not public.'}</p>
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        <span>Go Home</span>
                    </Link>
                </div>
            </div>
        );
    }

    const { personalInfo, education, experience, skills, projects, achievements, theme: portfolioTheme } = portfolio;

    // Get the theme configuration based on saved theme settings
    const selectedTheme = portfolioTheme?.selectedTheme || 'modern';
    const themeVariant = portfolioTheme?.themeVariant || 'default';
    const theme = getPreviewThemeConfig(selectedTheme, themeVariant);

    const getAchievementIcon = (type: string) => {
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
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">PortfolioBuilder</span>
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Create Your Own
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={`${theme.heroGradient} pt-24 pb-20`}>
                <div className="max-w-4xl mx-auto px-6 text-center">
                    {personalInfo.avatar && (
                        <img
                            src={personalInfo.avatar}
                            alt={personalInfo.fullName}
                            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/20 object-cover shadow-xl"
                        />
                    )}
                    <h1 className={`text-5xl font-bold mb-4 ${theme.headingColor}`}>
                        {personalInfo.fullName || 'Your Name'}
                    </h1>
                    <p className={`text-2xl mb-6 ${theme.subtitleColor}`}>
                        {personalInfo.title || 'Professional Title'}
                    </p>
                    <p className={`text-lg max-w-2xl mx-auto mb-8 ${theme.textColor}`}>
                        {personalInfo.bio}
                    </p>

                    {/* Contact Info */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {personalInfo.email && (
                            <a
                                href={`mailto:${personalInfo.email}`}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${theme.badgeBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Mail className="w-4 h-4" />
                                <span>{personalInfo.email}</span>
                            </a>
                        )}
                        {personalInfo.phone && (
                            <a
                                href={`tel:${personalInfo.phone}`}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${theme.badgeBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Phone className="w-4 h-4" />
                                <span>{personalInfo.phone}</span>
                            </a>
                        )}
                        {personalInfo.location && (
                            <span className={`flex items-center space-x-2 px-4 py-2 rounded-full ${theme.badgeBackground}`}>
                                <MapPin className="w-4 h-4" />
                                <span>{personalInfo.location}</span>
                            </span>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-4 mt-6">
                        {personalInfo.socialLinks?.github && (
                            <a
                                href={personalInfo.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-full ${theme.iconBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                        {personalInfo.socialLinks?.linkedin && (
                            <a
                                href={personalInfo.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-full ${theme.iconBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                        {personalInfo.socialLinks?.twitter && (
                            <a
                                href={personalInfo.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-full ${theme.iconBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        )}
                        {personalInfo.socialLinks?.website && (
                            <a
                                href={personalInfo.socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-full ${theme.iconBackground} hover:opacity-80 transition-opacity`}
                            >
                                <Globe className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            {(skills.technical?.length > 0 || skills.soft?.length > 0 || skills.languages?.length > 0) && (
                <section className={`py-16 ${theme.altBackground}`}>
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className={`text-3xl font-bold mb-8 text-center ${theme.headingColor}`}>Skills & Expertise</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {skills.technical?.length > 0 && (
                                <div className={`${theme.cardBackground} rounded-xl p-6`}>
                                    <h3 className={`text-lg font-semibold mb-4 ${theme.subtitleColor}`}>Technical Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.technical.map((skill, index) => (
                                            <span key={index} className={`px-3 py-1 rounded-full text-sm ${theme.skillBadge}`}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {skills.soft?.length > 0 && (
                                <div className={`${theme.cardBackground} rounded-xl p-6`}>
                                    <h3 className={`text-lg font-semibold mb-4 ${theme.subtitleColor}`}>Soft Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.soft.map((skill, index) => (
                                            <span key={index} className={`px-3 py-1 rounded-full text-sm ${theme.skillBadgeSoft}`}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {skills.languages?.length > 0 && (
                                <div className={`${theme.cardBackground} rounded-xl p-6`}>
                                    <h3 className={`text-lg font-semibold mb-4 ${theme.subtitleColor}`}>Languages</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.languages.map((lang, index) => (
                                            <span key={index} className={`px-3 py-1 rounded-full text-sm ${theme.skillBadgeLang}`}>
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

            {/* Experience Section */}
            {experience.length > 0 && (
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className={`text-3xl font-bold mb-8 text-center ${theme.headingColor}`}>
                            <Briefcase className="inline-block w-8 h-8 mr-2 mb-1" />
                            Work Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={index} className={`${theme.cardBackground} rounded-xl p-6`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                                        <div>
                                            <h3 className={`text-xl font-semibold ${theme.headingColor}`}>{exp.position}</h3>
                                            <p className={`${theme.accentColor} flex items-center mt-1`}>
                                                <Building2 className="w-4 h-4 mr-2" />
                                                {exp.company}
                                            </p>
                                        </div>
                                        <div className={`flex items-center ${theme.mutedColor} text-sm mt-2 sm:mt-0`}>
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </div>
                                    </div>
                                    {exp.location && (
                                        <p className={`${theme.mutedColor} text-sm mb-3 flex items-center`}>
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {exp.location}
                                        </p>
                                    )}
                                    <p className={theme.textColor}>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
                <section className={`py-16 ${theme.altBackground}`}>
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className={`text-3xl font-bold mb-8 text-center ${theme.headingColor}`}>Featured Projects</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {projects.map((project, index) => (
                                <div key={index} className={`${theme.cardBackground} rounded-xl overflow-hidden ${project.featured ? 'ring-2 ring-yellow-500/50' : ''}`}>
                                    {project.image && (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className={`text-xl font-semibold ${theme.headingColor}`}>{project.title}</h3>
                                            {project.featured && (
                                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                            )}
                                        </div>
                                        <p className={`${theme.textColor} mb-4 text-sm`}>{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies?.map((tech, techIndex) => (
                                                <span key={techIndex} className={`px-2 py-1 rounded text-xs ${theme.techBadge}`}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center text-sm ${theme.linkColor} hover:opacity-80`}
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
                                                    className={`flex items-center text-sm ${theme.mutedColor} hover:opacity-80`}
                                                >
                                                    <Github className="w-4 h-4 mr-1" />
                                                    Source Code
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

            {/* Education Section */}
            {education.length > 0 && (
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className={`text-3xl font-bold mb-8 text-center ${theme.headingColor}`}>
                            <GraduationCap className="inline-block w-8 h-8 mr-2 mb-1" />
                            Education
                        </h2>
                        <div className="space-y-6">
                            {education.map((edu, index) => (
                                <div key={index} className={`${theme.cardBackground} rounded-xl p-6`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                                        <div>
                                            <h3 className={`text-xl font-semibold ${theme.headingColor}`}>{edu.degree}</h3>
                                            <p className={`${theme.accentColor} mt-1`}>{edu.institution}</p>
                                            {edu.field && <p className={`${theme.mutedColor} text-sm`}>{edu.field}</p>}
                                        </div>
                                        <div className={`flex items-center ${theme.mutedColor} text-sm mt-2 sm:mt-0`}>
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {edu.startDate} - {edu.endDate}
                                        </div>
                                    </div>
                                    {edu.description && <p className={theme.textColor}>{edu.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 && (
                <section className={`py-16 ${theme.altBackground}`}>
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className={`text-3xl font-bold mb-8 text-center ${theme.headingColor}`}>
                            <Award className="inline-block w-8 h-8 mr-2 mb-1" />
                            Achievements
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {achievements.map((achievement, index) => (
                                <div key={index} className={`${theme.cardBackground} rounded-xl p-6`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${theme.iconBackground}`}>
                                            {getAchievementIcon(achievement.url || 'other')}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-semibold ${theme.headingColor}`}>{achievement.title}</h3>
                                            <p className={`${theme.accentColor} text-sm`}>{achievement.issuer}</p>
                                            <p className={`${theme.mutedColor} text-sm mb-2`}>{achievement.date}</p>
                                            {achievement.description && (
                                                <p className={`${theme.textColor} text-sm`}>{achievement.description}</p>
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
            <footer className={`py-8 ${theme.footerBackground} border-t border-gray-700/50`}>
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className={`${theme.mutedColor} text-sm`}>
                        Built with{' '}
                        <Link href="/" className={`${theme.linkColor} hover:opacity-80`}>
                            PortfolioBuilder
                        </Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}
