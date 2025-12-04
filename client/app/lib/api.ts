// API URL - use environment variable or default to same-origin /api
const API_URL = process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api');

interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    errors?: Array<{ msg: string; path: string }>;
}

class ApiService {
    private token: string | null = null;

    constructor() {
        // Load token from localStorage on init (client-side only)
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        }
    }

    getToken() {
        return this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers,
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error');
        }
    }

    // Auth endpoints
    async register(name: string, email: string, password: string) {
        const response = await this.request<{ id: string; name: string; email: string }>(
            '/auth/register',
            {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            }
        );

        if (response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async login(email: string, password: string) {
        const response = await this.request<{ id: string; name: string; email: string }>(
            '/auth/login',
            {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }
        );

        if (response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } finally {
            this.setToken(null);
        }
    }

    async getMe() {
        return this.request<{ id: string; name: string; email: string }>('/auth/me');
    }

    async updateDetails(name: string, email: string) {
        return this.request('/auth/updatedetails', {
            method: 'PUT',
            body: JSON.stringify({ name, email }),
        });
    }

    async updatePassword(currentPassword: string, newPassword: string) {
        return this.request('/auth/updatepassword', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    }

    // Portfolio endpoints
    async getPortfolios() {
        return this.request<Portfolio[]>('/portfolios');
    }

    async getPortfolio(id: string) {
        return this.request<Portfolio>(`/portfolios/${id}`);
    }

    async getPublicPortfolio(slug: string) {
        return this.request<Portfolio>(`/portfolios/public/${slug}`);
    }

    async createPortfolio(data: Partial<Portfolio>) {
        return this.request<Portfolio>('/portfolios', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updatePortfolio(id: string, data: Partial<Portfolio>) {
        return this.request<Portfolio>(`/portfolios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deletePortfolio(id: string) {
        return this.request(`/portfolios/${id}`, {
            method: 'DELETE',
        });
    }

    async togglePortfolioVisibility(id: string) {
        return this.request<Portfolio>(`/portfolios/${id}/visibility`, {
            method: 'PUT',
        });
    }

    // Resume parsing endpoints
    async parseResume(file: File): Promise<ApiResponse<ParsedResumeData>> {
        const formData = new FormData();
        formData.append('resume', file);

        const headers: HeadersInit = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${API_URL}/resume/parse`, {
                method: 'POST',
                headers,
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to parse resume');
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error');
        }
    }

    async parseResumeText(text: string): Promise<ApiResponse<ParsedResumeData>> {
        return this.request<ParsedResumeData>('/resume/parse-text', {
            method: 'POST',
            body: JSON.stringify({ text }),
        });
    }
}

// Portfolio type for API
export interface Portfolio {
    _id: string;
    user: string;
    personalInfo: {
        fullName: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        bio: string;
        avatar: string;
        socialLinks: {
            github: string;
            linkedin: string;
            twitter: string;
            website: string;
        };
    };
    education: Array<{
        institution: string;
        degree: string;
        field: string;
        startDate: string;
        endDate: string;
        description: string;
    }>;
    experience: Array<{
        company: string;
        position: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        description: string;
    }>;
    skills: {
        technical: string[];
        soft: string[];
        languages: string[];
    };
    projects: Array<{
        title: string;
        description: string;
        technologies: string[];
        liveUrl: string;
        githubUrl: string;
        image: string;
        featured: boolean;
    }>;
    achievements: Array<{
        title: string;
        issuer: string;
        date: string;
        description: string;
        url: string;
    }>;
    contact: {
        email: string;
        phone: string;
        address: string;
        availability: string;
    };
    theme: {
        selectedTheme: string;
        themeVariant: string;
    };
    isPublic: boolean;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

// Parsed resume data from Gemini AI
export interface ParsedResumeData {
    personal: {
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
    };
    education: Array<{
        id: number;
        degree: string;
        school: string;
        location: string;
        startYear: string;
        endYear: string;
        gpa: string;
        description: string;
    }>;
    experience: Array<{
        id: number;
        title: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        description: string;
        skills: string[];
    }>;
    skills: {
        technical: string[];
        soft: string[];
        languages: string[];
        certifications: string[];
    };
    projects: Array<{
        id: number;
        title: string;
        description: string;
        technologies: string[];
        demoUrl: string;
        githubUrl: string;
        image: string | null;
        featured: boolean;
        status: 'completed' | 'in-progress' | 'planned';
    }>;
    achievements: Array<{
        id: number;
        title: string;
        organization: string;
        date: string;
        description: string;
        type: 'award' | 'certification' | 'publication' | 'other';
    }>;
    contact: {
        preferredContact: string;
        availability: string;
        timezone: string;
        hourlyRate: string;
        responseTime: string;
    };
}

export const api = new ApiService();
export default api;
