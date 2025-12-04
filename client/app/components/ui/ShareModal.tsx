'use client';

import { X, Copy, Check, Globe, Lock, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { usePortfolioStore } from '@/app/store/portfolioStore';
import { usePortfolioApi } from '@/app/hooks/usePortfolioApi';

interface ShareModalProps {
    onClose: () => void;
}

const ShareModal = ({ onClose }: ShareModalProps) => {
    const { shareUrl, isPublic, currentSlug } = usePortfolioStore();
    const { toggleVisibility, isLoading } = usePortfolioApi();
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            alert('Failed to copy URL');
        }
    };

    const handleToggleVisibility = async () => {
        try {
            await toggleVisibility();
        } catch {
            alert('Failed to update visibility');
        }
    };

    const openInNewTab = () => {
        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Share Portfolio</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Visibility Toggle */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {isPublic ? (
                                    <Globe className="w-5 h-5 text-green-400" />
                                ) : (
                                    <Lock className="w-5 h-5 text-yellow-400" />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {isPublic ? 'Public' : 'Private'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {isPublic 
                                            ? 'Anyone with the link can view' 
                                            : 'Only you can view this portfolio'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleToggleVisibility}
                                disabled={isLoading}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    isPublic ? 'bg-green-600' : 'bg-gray-600'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {isLoading ? (
                                    <Loader2 className="absolute left-1/2 -translate-x-1/2 w-4 h-4 animate-spin text-white" />
                                ) : (
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            isPublic ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Share URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Share URL</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={shareUrl || 'Save your portfolio to generate a link'}
                                readOnly
                                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                            />
                            <button
                                onClick={copyToClipboard}
                                disabled={!shareUrl}
                                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Warning when private */}
                    {!isPublic && shareUrl && (
                        <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
                            <p className="text-xs text-yellow-300">
                                ⚠️ Your portfolio is currently private. Make it public to allow others to view it using the link.
                            </p>
                        </div>
                    )}

                    {/* Preview & Social Share Buttons */}
                    <div className="flex space-x-2">
                        <button 
                            onClick={openInNewTab}
                            disabled={!shareUrl || !isPublic}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Preview</span>
                        </button>
                        <button 
                            onClick={() => {
                                if (shareUrl) {
                                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
                                }
                            }}
                            disabled={!shareUrl || !isPublic}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Share on LinkedIn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
