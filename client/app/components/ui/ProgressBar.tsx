'use client';

import {
    User,
    GraduationCap,
    Briefcase,
    Code,
    FolderOpen,
    Award,
    Mail,
    ChevronLeft,
    ChevronRight,
    Eye,
} from 'lucide-react';
import { usePortfolioStore } from '@/app/store/portfolioStore';

const steps = [
    { id: 'personal', title: 'Personal Info', icon: User, description: 'Basic information and profile' },
    { id: 'education', title: 'Education', icon: GraduationCap, description: 'Academic background' },
    { id: 'experience', title: 'Experience', icon: Briefcase, description: 'Work history and roles' },
    { id: 'skills', title: 'Skills', icon: Code, description: 'Technical and soft skills' },
    { id: 'projects', title: 'Projects', icon: FolderOpen, description: 'Portfolio projects' },
    { id: 'achievements', title: 'Achievements', icon: Award, description: 'Awards and recognition' },
    { id: 'contact', title: 'Contact', icon: Mail, description: 'Contact preferences' },
];

export const ProgressBar = () => {
    const { currentStep, setCurrentStep } = usePortfolioStore();

    return (
        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Build Your Portfolio</h2>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">
                        Step {currentStep + 1} of {steps.length}
                    </span>
                    <div className="text-sm text-green-400">
                        {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-6">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(index)}
                            className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${index <= currentStep
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                                }`}
                        >
                            <Icon className="w-5 h-5 mx-auto mb-1" />
                            <div className="text-xs font-medium">{step.title}</div>
                            {index <= currentStep && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-3 rounded-full transition-all duration-500 relative"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                >
                    <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full shadow-lg" />
                </div>
            </div>
        </div>
    );
};

export const NavigationButtons = () => {
    const { currentStep, nextStep, prevStep, setShowPreview } = usePortfolioStore();

    return (
        <div className="flex justify-between mt-8">
            <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
            </button>

            <div className="flex space-x-3">
                {currentStep === steps.length - 1 ? (
                    <button
                        onClick={() => setShowPreview(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span>Preview Portfolio</span>
                    </button>
                ) : (
                    <button
                        onClick={nextStep}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export const getStepInfo = (stepIndex: number) => steps[stepIndex];
