'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Github, Linkedin, Twitter, Globe, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react';
import api, { Portfolio } from '@/app/lib/api';

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

    const { personalInfo, education, experience, skills, projects, achievements } = portfolio;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    {personalInfo.avatar && (
                        <img
                            src={personalInfo.avatar}
                            alt={personalInfo.fullName}
                            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-700 object-cover"
                        />
                    )}
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                        {personalInfo.fullName}
                    </h1>
                    <p className="text-xl text-blue-400 mb-4">{personalInfo.title}</p>
                    {personalInfo.location && (
                        <p className="flex items-center justify-center text-gray-400 mb-6">
                            <MapPin className="w-4 h-4 mr-2" />
                            {personalInfo.location}
                        </p>
                    )}
                    <p className="text-gray-300 max-w-2xl mx-auto mb-8">{personalInfo.bio}</p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center space-x-4">
                        {personalInfo.socialLinks.github && (
                            <a
                                href={personalInfo.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <Github className="w-5 h-5 text-gray-300" />
                            </a>
                        )}
                        {personalInfo.socialLinks.linkedin && (
                            <a
                                href={personalInfo.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <Linkedin className="w-5 h-5 text-gray-300" />
                            </a>
                        )}
                        {personalInfo.socialLinks.twitter && (
                            <a
                                href={personalInfo.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <Twitter className="w-5 h-5 text-gray-300" />
                            </a>
                        )}
                        {personalInfo.socialLinks.website && (
                            <a
                                href={personalInfo.socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <Globe className="w-5 h-5 text-gray-300" />
                            </a>
                        )}
                        {personalInfo.email && (
                            <a
                                href={`mailto:${personalInfo.email}`}
                                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <Mail className="w-5 h-5 text-gray-300" />
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            {(skills.technical.length > 0 || skills.soft.length > 0) && (
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center">Skills</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {skills.technical.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Technical Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.technical.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {skills.soft.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Soft Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.soft.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                                            >
                                                {skill}
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
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center">Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                        <h3 className="text-xl font-semibold text-white">{exp.position}</h3>
                                        <div className="flex items-center text-sm text-gray-400 mt-1 sm:mt-0">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </div>
                                    </div>
                                    <p className="text-blue-400 mb-2">{exp.company}</p>
                                    {exp.location && <p className="text-sm text-gray-400 mb-3">{exp.location}</p>}
                                    <p className="text-gray-300">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center">Projects</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {projects.map((project, index) => (
                                <div key={index} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50">
                                    {project.image && (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                                        <p className="text-gray-300 mb-4 text-sm">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-sm text-blue-400 hover:text-blue-300"
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
                                                    className="flex items-center text-sm text-gray-400 hover:text-gray-300"
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

            {/* Education Section */}
            {education.length > 0 && (
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center">Education</h2>
                        <div className="space-y-6">
                            {education.map((edu, index) => (
                                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                        <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                                        <div className="flex items-center text-sm text-gray-400 mt-1 sm:mt-0">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {edu.startDate} - {edu.endDate}
                                        </div>
                                    </div>
                                    <p className="text-blue-400 mb-2">{edu.institution}</p>
                                    {edu.description && <p className="text-gray-300">{edu.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 && (
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center">Achievements</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                                    <h3 className="text-lg font-semibold text-white mb-2">{achievement.title}</h3>
                                    <p className="text-blue-400 text-sm mb-2">{achievement.issuer}</p>
                                    <p className="text-gray-400 text-sm mb-3">{achievement.date}</p>
                                    {achievement.description && (
                                        <p className="text-gray-300 text-sm">{achievement.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-400 text-sm">
                        Built with{' '}
                        <Link href="/" className="text-blue-400 hover:text-blue-300">
                            PortfolioBuilder
                        </Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}
