'use client';

import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { usePortfolioStore } from '@/app/store/portfolioStore';

interface ShareModalProps {
    onClose: () => void;
}

const ShareModal = ({ onClose }: ShareModalProps) => {
    const { shareUrl } = usePortfolioStore();
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert('Failed to copy URL');
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
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Share URL</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm">
                            Share on LinkedIn
                        </button>
                        <button className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm">
                            Share on Twitter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
