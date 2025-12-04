import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Personal {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    twitter: string;
    summary: string;
    profileImage: string | null;
}

export interface Education {
    id: number;
    degree: string;
    school: string;
    location: string;
    startYear: string;
    endYear: string;
    gpa: string;
    description: string;
}

export interface Experience {
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    skills: string[];
}

export interface Skills {
    technical: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
}

export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    demoUrl: string;
    githubUrl: string;
    image: string | null;
    featured: boolean;
    status: 'completed' | 'in-progress' | 'planned';
}

export interface Achievement {
    id: number;
    title: string;
    organization: string;
    date: string;
    description: string;
    type: 'award' | 'certification' | 'publication' | 'other';
}

export interface Contact {
    preferredContact: string;
    availability: string;
    timezone: string;
    hourlyRate: string;
    responseTime: string;
}

export interface PortfolioData {
    personal: Personal;
    education: Education[];
    experience: Experience[];
    skills: Skills;
    projects: Project[];
    achievements: Achievement[];
    contact: Contact;
}

interface PortfolioStore {
    // Data
    portfolioData: PortfolioData;
    currentStep: number;
    selectedTheme: string;
    themeVariant: string;
    showPreview: boolean;
    exportFormat: string;
    isExporting: boolean;
    showShareModal: boolean;
    shareUrl: string;
    copied: boolean;
    // Portfolio sharing state
    currentSlug: string;
    isPublic: boolean;
    currentPortfolioId: string | null;

    // Actions
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setSelectedTheme: (theme: string) => void;
    setThemeVariant: (variant: string) => void;
    setShowPreview: (show: boolean) => void;
    setExportFormat: (format: string) => void;
    setIsExporting: (exporting: boolean) => void;
    setShowShareModal: (show: boolean) => void;
    setShareUrl: (url: string) => void;
    setCopied: (copied: boolean) => void;
    setCurrentSlug: (slug: string) => void;
    setIsPublic: (isPublic: boolean) => void;
    setCurrentPortfolioId: (id: string | null) => void;

    // Data Updates
    updatePersonal: (data: Partial<Personal>) => void;
    addEducation: (education: Education) => void;
    updateEducation: (id: number, data: Partial<Education>) => void;
    removeEducation: (id: number) => void;
    addExperience: (experience: Experience) => void;
    updateExperience: (id: number, data: Partial<Experience>) => void;
    removeExperience: (id: number) => void;
    updateSkills: (skills: Partial<Skills>) => void;
    addProject: (project: Project) => void;
    updateProject: (id: number, data: Partial<Project>) => void;
    removeProject: (id: number) => void;
    addAchievement: (achievement: Achievement) => void;
    updateAchievement: (id: number, data: Partial<Achievement>) => void;
    removeAchievement: (id: number) => void;
    updateContact: (contact: Partial<Contact>) => void;

    // Utilities
    getCompletionScore: () => number;
    importData: (data: PortfolioData) => void;
    resetData: () => void;
}

const initialPortfolioData: PortfolioData = {
    personal: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        twitter: '',
        summary: '',
        profileImage: null,
    },
    education: [],
    experience: [],
    skills: {
        technical: [],
        soft: [],
        languages: [],
        certifications: [],
    },
    projects: [],
    achievements: [],
    contact: {
        preferredContact: 'email',
        availability: 'Available for hire',
        timezone: 'UTC',
        hourlyRate: '',
        responseTime: '24 hours',
    },
};

export const usePortfolioStore = create<PortfolioStore>()(
    persist(
        (set, get) => ({
            // Initial State
            portfolioData: initialPortfolioData,
            currentStep: 0,
            selectedTheme: 'modern',
            themeVariant: 'default',
            showPreview: false,
            exportFormat: 'pdf',
            isExporting: false,
            showShareModal: false,
            shareUrl: '',
            copied: false,
            currentSlug: '',
            isPublic: false,
            currentPortfolioId: null,

            // Navigation Actions
            setCurrentStep: (step) => set({ currentStep: step }),
            nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
            prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

            // Theme Actions
            setSelectedTheme: (theme) => set({ selectedTheme: theme }),
            setThemeVariant: (variant) => set({ themeVariant: variant }),

            // UI Actions
            setShowPreview: (show) => set({ showPreview: show }),
            setExportFormat: (format) => set({ exportFormat: format }),
            setIsExporting: (exporting) => set({ isExporting: exporting }),
            setShowShareModal: (show) => set({ showShareModal: show }),
            setShareUrl: (url) => set({ shareUrl: url }),
            setCopied: (copied) => set({ copied: copied }),
            setCurrentSlug: (slug) => set({ currentSlug: slug }),
            setIsPublic: (isPublic) => set({ isPublic: isPublic }),
            setCurrentPortfolioId: (id) => set({ currentPortfolioId: id }),

            // Personal Data
            updatePersonal: (data) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        personal: { ...state.portfolioData.personal, ...data },
                    },
                })),

            // Education CRUD
            addEducation: (education) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        education: [...state.portfolioData.education, education],
                    },
                })),
            updateEducation: (id, data) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        education: state.portfolioData.education.map((edu) =>
                            edu.id === id ? { ...edu, ...data } : edu
                        ),
                    },
                })),
            removeEducation: (id) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        education: state.portfolioData.education.filter((edu) => edu.id !== id),
                    },
                })),

            // Experience CRUD
            addExperience: (experience) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        experience: [...state.portfolioData.experience, experience],
                    },
                })),
            updateExperience: (id, data) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        experience: state.portfolioData.experience.map((exp) =>
                            exp.id === id ? { ...exp, ...data } : exp
                        ),
                    },
                })),
            removeExperience: (id) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        experience: state.portfolioData.experience.filter((exp) => exp.id !== id),
                    },
                })),

            // Skills Update
            updateSkills: (skills) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        skills: { ...state.portfolioData.skills, ...skills },
                    },
                })),

            // Projects CRUD
            addProject: (project) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        projects: [...state.portfolioData.projects, project],
                    },
                })),
            updateProject: (id, data) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        projects: state.portfolioData.projects.map((proj) =>
                            proj.id === id ? { ...proj, ...data } : proj
                        ),
                    },
                })),
            removeProject: (id) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        projects: state.portfolioData.projects.filter((proj) => proj.id !== id),
                    },
                })),

            // Achievements CRUD
            addAchievement: (achievement) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        achievements: [...state.portfolioData.achievements, achievement],
                    },
                })),
            updateAchievement: (id, data) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        achievements: state.portfolioData.achievements.map((ach) =>
                            ach.id === id ? { ...ach, ...data } : ach
                        ),
                    },
                })),
            removeAchievement: (id) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        achievements: state.portfolioData.achievements.filter((ach) => ach.id !== id),
                    },
                })),

            // Contact Update
            updateContact: (contact) =>
                set((state) => ({
                    portfolioData: {
                        ...state.portfolioData,
                        contact: { ...state.portfolioData.contact, ...contact },
                    },
                })),

            // Utilities
            getCompletionScore: () => {
                const { portfolioData } = get();
                let score = 0;
                if (portfolioData.personal.fullName) score += 15;
                score += portfolioData.education.length * 10;
                score += portfolioData.experience.length * 15;
                score += portfolioData.skills.technical.length * 2;
                score += portfolioData.projects.length * 20;
                return Math.min(100, score);
            },

            importData: (data) => set({ portfolioData: data }),
            resetData: () => set({ portfolioData: initialPortfolioData }),
        }),
        {
            name: 'portfolio-storage',
            partialize: (state) => ({
                portfolioData: state.portfolioData,
                selectedTheme: state.selectedTheme,
                themeVariant: state.themeVariant,
            }),
        }
    )
);
