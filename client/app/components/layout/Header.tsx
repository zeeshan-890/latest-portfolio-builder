'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Download, Share2, Palette, Save, Settings, Upload, LogOut, User, Loader2 } from 'lucide-react';
import { usePortfolioStore } from '@/app/store/portfolioStore';
import { useAuth } from '@/app/context/AuthContext';
import { usePortfolioApi } from '@/app/hooks/usePortfolioApi';
import { themes } from '@/app/utils/themes';

const Header = () => {
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuth();
    const { savePortfolio, isLoading: isSaving } = usePortfolioApi();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const {
        selectedTheme,
        setSelectedTheme,
        exportFormat,
        setExportFormat,
        isExporting,
        setIsExporting,
        showPreview,
        setShowPreview,
        setShowShareModal,
        setShareUrl,
        portfolioData,
        importData,
    } = usePortfolioStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        setSaveStatus('saving');
        try {
            await savePortfolio();
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const generateShareUrl = () => {
        const baseUrl = 'https://portfolio-builder.app/share/';
        const portfolioId = Date.now().toString(36);
        const url = `${baseUrl}${portfolioId}`;
        setShareUrl(url);
        setShowShareModal(true);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    // Validate the data structure
                    if (data.personal && data.skills && data.education) {
                        importData(data);
                        alert('Data imported successfully!');
                    } else {
                        alert('Invalid file format. Please select a valid portfolio JSON file.');
                    }
                } catch {
                    alert('Invalid file format. Please select a valid JSON file.');
                }
            };
            reader.readAsText(file);
        }
        // Reset input so same file can be imported again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleExport = async () => {
        if (!portfolioData.personal.fullName) {
            alert('Please add your name before exporting');
            return;
        }

        setIsExporting(true);

        try {
            // Dynamic import for export helpers
            const { handleExport } = await import('@/app/utils/exportHelpers');
            await handleExport(exportFormat, portfolioData);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Portfolio Builder Pro
                        </div>
                        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                            {saveStatus === 'saving' ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : saveStatus === 'saved' ? (
                                <>
                                    <Save className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400">Saved!</span>
                                </>
                            ) : saveStatus === 'error' ? (
                                <>
                                    <Save className="w-4 h-4 text-red-400" />
                                    <span className="text-red-400">Save failed</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Auto-saved locally</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Theme Selector */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Palette className="w-4 h-4 text-gray-400" />
                            <select
                                value={selectedTheme}
                                onChange={(e) => setSelectedTheme(e.target.value)}
                                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                            >
                                {themes.map((theme) => (
                                    <option key={theme.id} value={theme.id}>
                                        {theme.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Export Format */}
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                        >
                            <option value="pdf">PDF</option>
                            <option value="png">PNG</option>
                            <option value="html">HTML</option>
                            <option value="json">JSON Data</option>
                        </select>

                        {/* Action Buttons */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                        >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">{showPreview ? 'Edit' : 'Preview'}</span>
                        </button>

                        <button
                            onClick={generateShareUrl}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Share</span>
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm disabled:opacity-50"
                        >
                            {isExporting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">Export</span>
                        </button>

                        {/* Import Button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                        >
                            <Upload className="w-4 h-4" />
                            <span className="hidden sm:inline">Import</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                        />

                        {/* Save to Cloud Button */}
                        {isAuthenticated && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-sm disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">Save</span>
                            </button>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-white">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                                        <div className="px-4 py-3 border-b border-gray-700">
                                            <p className="text-sm font-medium text-white">{user?.name}</p>
                                            <p className="text-xs text-gray-400">{user?.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    // Navigate to settings
                                                }}
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Settings</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    handleLogout();
                                                }}
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => router.push('/login')}
                                className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                            >
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
