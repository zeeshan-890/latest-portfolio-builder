'use client';

import { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/app/store/portfolioStore';
import { useAuth } from '@/app/context/AuthContext';
import { usePortfolioApi } from '@/app/hooks/usePortfolioApi';
import Header from '@/app/components/layout/Header';
import Sidebar from '@/app/components/layout/Sidebar';
import { ProgressBar, NavigationButtons } from '@/app/components/ui/ProgressBar';
import ShareModal from '@/app/components/ui/ShareModal';
import FormSection from '@/app/components/forms/FormSection';
import PreviewMode from '@/app/components/preview/PreviewMode';
import ResumeUpload from '@/app/components/resume/ResumeUpload';

export default function BuilderPage() {
    const { showPreview, showShareModal, setShowShareModal } = usePortfolioStore();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { loadPortfolios, isLoading: portfolioLoading } = usePortfolioApi();
    const [hasLoaded, setHasLoaded] = useState(false);
    const [showResumeUpload, setShowResumeUpload] = useState(false);

    // Load user's portfolio when authenticated
    useEffect(() => {
        if (isAuthenticated && !authLoading && !hasLoaded) {
            loadPortfolios().then(() => setHasLoaded(true));
        }
    }, [isAuthenticated, authLoading, hasLoaded, loadPortfolios]);

    if (authLoading || (isAuthenticated && portfolioLoading && !hasLoaded)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading your portfolio...</p>
                </div>
            </div>
        );
    }

    if (showPreview) {
        return (
            <>
                <PreviewMode />
                {/* Share Modal - available in preview mode too */}
                {showShareModal && (
                    <ShareModal onClose={() => setShowShareModal(false)} />
                )}
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Header />

            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto lg:mr-80">
                        {/* Import Resume Button */}
                        <div className="mb-6 flex justify-end">
                            <button
                                onClick={() => setShowResumeUpload(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/25"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Import Resume with AI
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <ProgressBar />

                        {/* Form Content */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                            <FormSection />

                            {/* Navigation Buttons */}
                            <NavigationButtons />
                        </div>
                    </div>
                </main>

                {/* Sidebar - Fixed on right */}
                <aside className="hidden lg:block fixed right-0 top-0 h-screen w-80 overflow-y-auto pt-20 bg-gray-900/50 backdrop-blur-sm border-l border-gray-800">
                    <Sidebar />
                </aside>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <ShareModal onClose={() => setShowShareModal(false)} />
            )}

            {/* Resume Upload Modal */}
            {showResumeUpload && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <ResumeUpload onClose={() => setShowResumeUpload(false)} />
                </div>
            )}
        </div>
    );
}
