'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/app/lib/api';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const token = api.getToken();
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            const response = await api.getMe();
            if (response.success && response.data) {
                setUser({
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                });
            } else {
                setUser(null);
                api.setToken(null);
            }
        } catch {
            setUser(null);
            api.setToken(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email: string, password: string) => {
        const response = await api.login(email, password);
        if (response.success && response.user) {
            setUser({
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
            });
        } else {
            throw new Error(response.message || 'Login failed');
        }
    };

    const register = async (name: string, email: string, password: string) => {
        const response = await api.register(name, email, password);
        if (response.success && response.user) {
            setUser({
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
            });
        } else {
            throw new Error(response.message || 'Registration failed');
        }
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
