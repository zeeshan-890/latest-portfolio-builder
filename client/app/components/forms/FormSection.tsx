'use client';

import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import SkillsForm from './SkillsForm';
import ProjectsForm from './ProjectsForm';
import AchievementsForm from './AchievementsForm';
import ContactForm from './ContactForm';
import { usePortfolioStore } from '@/app/store/portfolioStore';

const FormSection = () => {
    const { currentStep } = usePortfolioStore();

    const renderForm = () => {
        switch (currentStep) {
            case 0:
                return <PersonalInfoForm />;
            case 1:
                return <EducationForm />;
            case 2:
                return <ExperienceForm />;
            case 3:
                return <SkillsForm />;
            case 4:
                return <ProjectsForm />;
            case 5:
                return <AchievementsForm />;
            case 6:
                return <ContactForm />;
            default:
                return <PersonalInfoForm />;
        }
    };

    return <div className="animate-fadeIn">{renderForm()}</div>;
};

export default FormSection;
