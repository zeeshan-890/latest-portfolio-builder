export interface ThemeConfig {
    bg: string;
    card: string;
    text: string;
    accent: string;
    secondary: string;
    cssVars: Record<string, string>;
}

export interface PreviewThemeConfig {
    background: string;
    heroGradient: string;
    headingColor: string;
    subtitleColor: string;
    textColor: string;
    mutedColor: string;
    accentColor: string;
    badgeBackground: string;
    cardBackground: string;
    altBackground: string;
    skillBadge: string;
    skillBadgeSoft: string;
    skillBadgeLang: string;
    techBadge: string;
    linkColor: string;
    iconBackground: string;
    footerBackground: string;
}

export interface Theme {
    id: string;
    name: string;
    preview: string;
    accent: string;
    variants: string[];
}

export const themes: Theme[] = [
    {
        id: 'modern',
        name: 'Modern',
        preview: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        accent: '#0ea5e9',
        variants: ['default', 'dark', 'glass', 'neon'],
    },
    {
        id: 'minimal',
        name: 'Minimal',
        preview: '#ffffff',
        accent: '#374151',
        variants: ['default', 'warm', 'cool', 'monospace'],
    },
    {
        id: 'creative',
        name: 'Creative',
        preview: 'linear-gradient(135deg, #7c3aed 0%, #f59e0b 100%)',
        accent: '#f59e0b',
        variants: ['default', 'artistic', 'bold', 'playful'],
    },
    {
        id: 'professional',
        name: 'Professional',
        preview: 'linear-gradient(135deg, #1e40af 0%, #059669 100%)',
        accent: '#059669',
        variants: ['default', 'corporate', 'executive', 'consulting'],
    },
    {
        id: 'gradient',
        name: 'Gradient',
        preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        accent: '#8b5cf6',
        variants: ['default', 'sunset', 'ocean', 'aurora'],
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        preview: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        accent: '#00ff88',
        variants: ['default', 'neon', 'matrix', 'terminal'],
    },
];

const themeConfigs: Record<string, Record<string, ThemeConfig>> = {
    modern: {
        default: {
            bg: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
            card: 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50',
            text: 'text-white',
            accent: 'text-blue-400',
            secondary: 'text-gray-300',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                '--bg-card': 'rgba(31, 41, 55, 0.5)',
                '--text-primary': '#ffffff',
                '--text-accent': '#60a5fa',
                '--text-secondary': '#d1d5db',
            },
        },
        dark: {
            bg: 'bg-black',
            card: 'bg-gray-900/80 border border-gray-800',
            text: 'text-gray-100',
            accent: 'text-blue-400',
            secondary: 'text-gray-400',
            cssVars: {
                '--bg-primary': '#000000',
                '--bg-card': 'rgba(17, 24, 39, 0.8)',
                '--text-primary': '#f3f4f6',
                '--text-accent': '#60a5fa',
                '--text-secondary': '#9ca3af',
            },
        },
        glass: {
            bg: 'bg-gradient-to-br from-slate-900/90 via-gray-900/90 to-slate-800/90 backdrop-blur-xl',
            card: 'bg-white/10 backdrop-blur-md border border-white/20',
            text: 'text-white',
            accent: 'text-cyan-400',
            secondary: 'text-gray-200',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
                '--bg-card': 'rgba(255, 255, 255, 0.1)',
                '--text-primary': '#ffffff',
                '--text-accent': '#22d3ee',
                '--text-secondary': '#e5e7eb',
            },
        },
        neon: {
            bg: 'bg-black',
            card: 'bg-gray-900/50 border border-cyan-400/30 shadow-lg shadow-cyan-400/10',
            text: 'text-cyan-100',
            accent: 'text-cyan-400',
            secondary: 'text-cyan-200',
            cssVars: {
                '--bg-primary': '#000000',
                '--bg-card': 'rgba(17, 24, 39, 0.5)',
                '--text-primary': '#ecfdf5',
                '--text-accent': '#22d3ee',
                '--text-secondary': '#a7f3d0',
            },
        },
    },
    minimal: {
        default: {
            bg: 'bg-white',
            card: 'bg-gray-50 border border-gray-200',
            text: 'text-gray-900',
            accent: 'text-blue-600',
            secondary: 'text-gray-600',
            cssVars: {
                '--bg-primary': '#ffffff',
                '--bg-card': '#f9fafb',
                '--text-primary': '#111827',
                '--text-accent': '#2563eb',
                '--text-secondary': '#4b5563',
            },
        },
        warm: {
            bg: 'bg-amber-50',
            card: 'bg-white border border-amber-200',
            text: 'text-amber-900',
            accent: 'text-orange-600',
            secondary: 'text-amber-700',
            cssVars: {
                '--bg-primary': '#fffbeb',
                '--bg-card': '#ffffff',
                '--text-primary': '#78350f',
                '--text-accent': '#ea580c',
                '--text-secondary': '#a16207',
            },
        },
        cool: {
            bg: 'bg-blue-50',
            card: 'bg-white border border-blue-200',
            text: 'text-blue-900',
            accent: 'text-blue-600',
            secondary: 'text-blue-700',
            cssVars: {
                '--bg-primary': '#eff6ff',
                '--bg-card': '#ffffff',
                '--text-primary': '#1e3a8a',
                '--text-accent': '#2563eb',
                '--text-secondary': '#1d4ed8',
            },
        },
        monospace: {
            bg: 'bg-gray-100',
            card: 'bg-white border border-gray-300',
            text: 'text-gray-900',
            accent: 'text-gray-700',
            secondary: 'text-gray-600',
            cssVars: {
                '--bg-primary': '#f3f4f6',
                '--bg-card': '#ffffff',
                '--text-primary': '#111827',
                '--text-accent': '#374151',
                '--text-secondary': '#4b5563',
            },
        },
    },
    creative: {
        default: {
            bg: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
            card: 'bg-white/10 backdrop-blur-sm border border-white/20',
            text: 'text-white',
            accent: 'text-yellow-400',
            secondary: 'text-purple-200',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #312e81 100%)',
                '--bg-card': 'rgba(255, 255, 255, 0.1)',
                '--text-primary': '#ffffff',
                '--text-accent': '#facc15',
                '--text-secondary': '#e9d5ff',
            },
        },
        artistic: {
            bg: 'bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900',
            card: 'bg-white/10 backdrop-blur-sm border border-pink-400/20',
            text: 'text-white',
            accent: 'text-pink-400',
            secondary: 'text-purple-200',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #831843 0%, #581c87 50%, #312e81 100%)',
                '--bg-card': 'rgba(255, 255, 255, 0.1)',
                '--text-primary': '#ffffff',
                '--text-accent': '#f472b6',
                '--text-secondary': '#e9d5ff',
            },
        },
        bold: {
            bg: 'bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900',
            card: 'bg-white/10 backdrop-blur-sm border border-orange-400/20',
            text: 'text-white',
            accent: 'text-orange-400',
            secondary: 'text-orange-200',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #7f1d1d 0%, #7c2d12 50%, #713f12 100%)',
                '--bg-card': 'rgba(255, 255, 255, 0.1)',
                '--text-primary': '#ffffff',
                '--text-accent': '#fb923c',
                '--text-secondary': '#fed7aa',
            },
        },
        playful: {
            bg: 'bg-gradient-to-br from-teal-900 via-emerald-900 to-green-900',
            card: 'bg-white/10 backdrop-blur-sm border border-emerald-400/20',
            text: 'text-white',
            accent: 'text-emerald-400',
            secondary: 'text-emerald-200',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #134e4a 0%, #064e3b 50%, #14532d 100%)',
                '--bg-card': 'rgba(255, 255, 255, 0.1)',
                '--text-primary': '#ffffff',
                '--text-accent': '#34d399',
                '--text-secondary': '#a7f3d0',
            },
        },
    },
    professional: {
        default: {
            bg: 'bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900',
            card: 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50',
            text: 'text-white',
            accent: 'text-green-400',
            secondary: 'text-slate-300',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #111827 100%)',
                '--bg-card': 'rgba(30, 41, 59, 0.5)',
                '--text-primary': '#ffffff',
                '--text-accent': '#4ade80',
                '--text-secondary': '#cbd5e1',
            },
        },
        corporate: {
            bg: 'bg-slate-900',
            card: 'bg-slate-800 border border-slate-700',
            text: 'text-white',
            accent: 'text-blue-400',
            secondary: 'text-slate-400',
            cssVars: {
                '--bg-primary': '#0f172a',
                '--bg-card': '#1e293b',
                '--text-primary': '#ffffff',
                '--text-accent': '#60a5fa',
                '--text-secondary': '#94a3b8',
            },
        },
        executive: {
            bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
            card: 'bg-gray-800/80 border border-gray-700',
            text: 'text-white',
            accent: 'text-amber-400',
            secondary: 'text-gray-400',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
                '--bg-card': 'rgba(31, 41, 55, 0.8)',
                '--text-primary': '#ffffff',
                '--text-accent': '#fbbf24',
                '--text-secondary': '#9ca3af',
            },
        },
        consulting: {
            bg: 'bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900',
            card: 'bg-slate-800/60 border border-indigo-700/30',
            text: 'text-white',
            accent: 'text-indigo-400',
            secondary: 'text-slate-300',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #312e81 0%, #1e293b 50%, #0f172a 100%)',
                '--bg-card': 'rgba(30, 41, 59, 0.6)',
                '--text-primary': '#ffffff',
                '--text-accent': '#818cf8',
                '--text-secondary': '#cbd5e1',
            },
        },
    },
    gradient: {
        default: {
            bg: 'bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900',
            card: 'bg-white/10 backdrop-blur-sm border border-purple-400/20',
            text: 'text-white',
            accent: 'text-purple-300',
            secondary: 'text-purple-200',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #4c1d95 0%, #6b21a8 50%, #701a75 100%)',
                '--bg-card': 'rgba(255, 255, 255, 0.1)',
                '--text-primary': '#ffffff',
                '--text-accent': '#d8b4fe',
                '--text-secondary': '#e9d5ff',
            },
        },
        sunset: {
            bg: 'bg-gradient-to-br from-orange-900 via-red-800 to-pink-900',
            card: 'bg-white/10 backdrop-blur-sm border border-orange-400/20',
            text: 'text-white',
            accent: 'text-orange-300',
            secondary: 'text-orange-200',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #7c2d12 0%, #991b1b 50%, #831843 100%)',
                '--bg-card': 'rgba(255, 255, 255, 0.1)',
                '--text-primary': '#ffffff',
                '--text-accent': '#fdba74',
                '--text-secondary': '#fed7aa',
            },
        },
        ocean: {
            bg: 'bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900',
            card: 'bg-white/10 backdrop-blur-sm border border-cyan-400/20',
            text: 'text-white',
            accent: 'text-cyan-300',
            secondary: 'text-cyan-200',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #1e3a8a 0%, #155e75 50%, #134e4a 100%)',
                '--bg-card': 'rgba(255, 255, 255, 0.1)',
                '--text-primary': '#ffffff',
                '--text-accent': '#67e8f9',
                '--text-secondary': '#a5f3fc',
            },
        },
        aurora: {
            bg: 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900',
            card: 'bg-white/10 backdrop-blur-sm border border-emerald-400/20',
            text: 'text-white',
            accent: 'text-emerald-300',
            secondary: 'text-emerald-200',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #14532d 0%, #064e3b 50%, #134e4a 100%)',
                '--bg-card': 'rgba(255, 255, 255, 0.1)',
                '--text-primary': '#ffffff',
                '--text-accent': '#6ee7b7',
                '--text-secondary': '#a7f3d0',
            },
        },
    },
    cyberpunk: {
        default: {
            bg: 'bg-gradient-to-br from-black via-gray-900 to-green-900/20',
            card: 'bg-black/80 border border-green-400/30 shadow-lg shadow-green-400/10',
            text: 'text-green-100',
            accent: 'text-green-400',
            secondary: 'text-green-200',
            cssVars: {
                '--bg-primary': 'linear-gradient(135deg, #000000 0%, #111827 50%, rgba(20, 83, 45, 0.2) 100%)',
                '--bg-card': 'rgba(0, 0, 0, 0.8)',
                '--text-primary': '#dcfce7',
                '--text-accent': '#4ade80',
                '--text-secondary': '#bbf7d0',
            },
        },
        neon: {
            bg: 'bg-black',
            card: 'bg-black/80 border border-pink-400/30 shadow-lg shadow-pink-400/10',
            text: 'text-pink-100',
            accent: 'text-pink-400',
            secondary: 'text-pink-200',
            cssVars: {
                '--bg-primary': '#000000',
                '--bg-card': 'rgba(0, 0, 0, 0.8)',
                '--text-primary': '#fce7f3',
                '--text-accent': '#f472b6',
                '--text-secondary': '#fbcfe8',
            },
        },
        matrix: {
            bg: 'bg-black',
            card: 'bg-black/90 border border-green-500/40 shadow-lg shadow-green-500/20',
            text: 'text-green-400',
            accent: 'text-green-300',
            secondary: 'text-green-500',
            cssVars: {
                '--bg-primary': '#000000',
                '--bg-card': 'rgba(0, 0, 0, 0.9)',
                '--text-primary': '#4ade80',
                '--text-accent': '#86efac',
                '--text-secondary': '#22c55e',
            },
        },
        terminal: {
            bg: 'bg-gray-950',
            card: 'bg-gray-900 border border-amber-400/30 shadow-lg shadow-amber-400/10',
            text: 'text-amber-100',
            accent: 'text-amber-400',
            secondary: 'text-amber-200',
            cssVars: {
                '--bg-primary': '#030712',
                '--bg-card': '#111827',
                '--text-primary': '#fef3c7',
                '--text-accent': '#fbbf24',
                '--text-secondary': '#fde68a',
            },
        },
    },
};

export const getThemeConfig = (theme: string, variant: string): ThemeConfig => {
    return themeConfigs[theme]?.[variant] || themeConfigs.modern.default;
};

export const getPreviewThemeConfig = (theme: string, variant: string): PreviewThemeConfig => {
    const config = getThemeConfig(theme, variant);
    const isDark = config.bg.includes('black') || config.bg.includes('900') || config.bg.includes('950');

    return {
        background: config.bg,
        heroGradient: config.bg,
        headingColor: config.text,
        subtitleColor: config.accent,
        textColor: config.secondary,
        mutedColor: isDark ? 'text-gray-400' : 'text-gray-500',
        accentColor: config.accent,
        badgeBackground: isDark ? 'bg-white/10' : 'bg-gray-100',
        cardBackground: config.card,
        altBackground: isDark ? 'bg-black/20' : 'bg-gray-50',
        skillBadge: isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700',
        skillBadgeSoft: isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700',
        skillBadgeLang: isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700',
        techBadge: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700',
        linkColor: config.accent,
        iconBackground: isDark ? 'bg-white/10' : 'bg-gray-100',
        footerBackground: isDark ? 'bg-black/30' : 'bg-gray-100',
    };
};

export const getMiniPreviewStyles = (theme: string, variant: string) => {
    const config = getThemeConfig(theme, variant);
    return {
        background: config.cssVars['--bg-primary'],
        card: config.cssVars['--bg-card'],
        text: config.cssVars['--text-primary'],
        accent: config.cssVars['--text-accent'],
    };
};
