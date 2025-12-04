'use client';

import { useCallback, useState } from 'react';
import api, { Portfolio } from '@/app/lib/api';
import { usePortfolioStore, PortfolioData } from '@/app/store/portfolioStore';

// Helper to convert frontend store data to API format
export function storeToApi(data: PortfolioData, theme: { selectedTheme: string; themeVariant: string }): Partial<Portfolio> {
    return {
        personalInfo: {
            fullName: data.personal.fullName,
            title: data.personal.title,
            email: data.personal.email,
            phone: data.personal.phone,
            location: data.personal.location,
            bio: data.personal.summary,
            avatar: data.personal.profileImage || '',
            socialLinks: {
                github: data.personal.github,
                linkedin: data.personal.linkedin,
                twitter: data.personal.twitter,
                website: data.personal.website,
            },
        },
        education: data.education.map((edu) => ({
            institution: edu.school,
            degree: edu.degree,
            field: edu.description,
            startDate: edu.startYear,
            endDate: edu.endYear,
            description: edu.description,
        })),
        experience: data.experience.map((exp) => ({
            company: exp.company,
            position: exp.title,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            current: exp.current,
            description: exp.description,
        })),
        skills: {
            technical: data.skills.technical,
            soft: data.skills.soft,
            languages: data.skills.languages,
        },
        projects: data.projects.map((proj) => ({
            title: proj.title,
            description: proj.description,
            technologies: proj.technologies,
            liveUrl: proj.demoUrl,
            githubUrl: proj.githubUrl,
            image: proj.image || '',
            featured: proj.featured,
        })),
        achievements: data.achievements.map((ach) => ({
            title: ach.title,
            issuer: ach.organization,
            date: ach.date,
            description: ach.description,
            url: '',
        })),
        contact: {
            email: data.contact.preferredContact === 'email' ? data.personal.email : '',
            phone: data.contact.preferredContact === 'phone' ? data.personal.phone : '',
            address: '',
            availability: data.contact.availability,
        },
        theme: {
            selectedTheme: theme.selectedTheme,
            themeVariant: theme.themeVariant,
        },
    };
}

// Helper to convert API data to frontend store format
export function apiToStore(portfolio: Portfolio): { data: PortfolioData; theme: { selectedTheme: string; themeVariant: string } } {
    return {
        data: {
            personal: {
                fullName: portfolio.personalInfo.fullName,
                title: portfolio.personalInfo.title,
                email: portfolio.personalInfo.email,
                phone: portfolio.personalInfo.phone,
                location: portfolio.personalInfo.location,
                website: portfolio.personalInfo.socialLinks.website,
                linkedin: portfolio.personalInfo.socialLinks.linkedin,
                github: portfolio.personalInfo.socialLinks.github,
                twitter: portfolio.personalInfo.socialLinks.twitter,
                summary: portfolio.personalInfo.bio,
                profileImage: portfolio.personalInfo.avatar || null,
            },
            education: portfolio.education.map((edu, index) => ({
                id: index + 1,
                degree: edu.degree,
                school: edu.institution,
                location: '',
                startYear: edu.startDate,
                endYear: edu.endDate,
                gpa: '',
                description: edu.description,
            })),
            experience: portfolio.experience.map((exp, index) => ({
                id: index + 1,
                title: exp.position,
                company: exp.company,
                location: exp.location,
                startDate: exp.startDate,
                endDate: exp.endDate,
                current: exp.current,
                description: exp.description,
                skills: [],
            })),
            skills: {
                technical: portfolio.skills.technical,
                soft: portfolio.skills.soft,
                languages: portfolio.skills.languages,
                certifications: [],
            },
            projects: portfolio.projects.map((proj, index) => ({
                id: index + 1,
                title: proj.title,
                description: proj.description,
                technologies: proj.technologies,
                demoUrl: proj.liveUrl,
                githubUrl: proj.githubUrl,
                image: proj.image || null,
                featured: proj.featured,
                status: 'completed' as const,
            })),
            achievements: portfolio.achievements.map((ach, index) => ({
                id: index + 1,
                title: ach.title,
                organization: ach.issuer,
                date: ach.date,
                description: ach.description,
                type: 'award' as const,
            })),
            contact: {
                preferredContact: 'email',
                availability: portfolio.contact.availability,
                timezone: 'UTC',
                hourlyRate: '',
                responseTime: '24 hours',
            },
        },
        theme: {
            selectedTheme: portfolio.theme.selectedTheme,
            themeVariant: portfolio.theme.themeVariant,
        },
    };
}

export function usePortfolioApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        portfolioData,
        selectedTheme,
        themeVariant,
        importData,
        setSelectedTheme,
        setThemeVariant,
        setCurrentSlug,
        setIsPublic,
        setShareUrl,
        currentPortfolioId,
        setCurrentPortfolioId,
    } = usePortfolioStore();

    // Helper to generate share URL from slug
    const generateShareUrl = useCallback((slug: string) => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/portfolio/${slug}`;
        }
        return '';
    }, []);

    const loadPortfolios = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getPortfolios();
            if (response.success && response.data && response.data.length > 0) {
                const portfolio = response.data[0];
                setCurrentPortfolioId(portfolio._id);
                const { data, theme } = apiToStore(portfolio);
                importData(data);
                setSelectedTheme(theme.selectedTheme);
                setThemeVariant(theme.themeVariant);
                // Set slug and visibility state
                setCurrentSlug(portfolio.slug || '');
                setIsPublic(portfolio.isPublic || false);
                if (portfolio.slug) {
                    setShareUrl(generateShareUrl(portfolio.slug));
                }
                return portfolio;
            }
            return null;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load portfolios');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [importData, setSelectedTheme, setThemeVariant, setCurrentSlug, setIsPublic, setShareUrl, generateShareUrl, setCurrentPortfolioId]);

    const savePortfolio = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const portfolioPayload = storeToApi(portfolioData, { selectedTheme, themeVariant });

            let portfolio: Portfolio | undefined;
            if (currentPortfolioId) {
                const response = await api.updatePortfolio(currentPortfolioId, portfolioPayload);
                if (response.success && response.data) {
                    portfolio = response.data;
                }
            } else {
                const response = await api.createPortfolio(portfolioPayload);
                if (response.success && response.data) {
                    setCurrentPortfolioId(response.data._id);
                    portfolio = response.data;
                }
            }

            if (portfolio) {
                // Set slug and visibility state after save
                setCurrentSlug(portfolio.slug || '');
                setIsPublic(portfolio.isPublic || false);
                if (portfolio.slug) {
                    setShareUrl(generateShareUrl(portfolio.slug));
                }
                return portfolio;
            }
            throw new Error('Failed to save portfolio');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save portfolio');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [portfolioData, selectedTheme, themeVariant, currentPortfolioId, setCurrentSlug, setIsPublic, setShareUrl, generateShareUrl, setCurrentPortfolioId]);

    const deletePortfolio = useCallback(async () => {
        if (!currentPortfolioId) return;

        setIsLoading(true);
        setError(null);
        try {
            await api.deletePortfolio(currentPortfolioId);
            setCurrentPortfolioId(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete portfolio');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentPortfolioId, setCurrentPortfolioId]);

    const toggleVisibility = useCallback(async () => {
        if (!currentPortfolioId) {
            console.error('No portfolio ID available for toggle visibility');
            return null;
        }

        setIsLoading(true);
        setError(null);
        try {
            console.log('Toggling visibility for portfolio:', currentPortfolioId);
            const response = await api.togglePortfolioVisibility(currentPortfolioId);
            if (response.success && response.data) {
                // Update local state with new visibility
                console.log('New visibility:', response.data.isPublic);
                setIsPublic(response.data.isPublic || false);
                return response.data;
            }
            throw new Error('Failed to toggle visibility');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle visibility');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentPortfolioId, setIsPublic]);

    return {
        isLoading,
        error,
        currentPortfolioId,
        loadPortfolios,
        savePortfolio,
        deletePortfolio,
        toggleVisibility,
    };
}
