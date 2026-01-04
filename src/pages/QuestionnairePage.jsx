import React from 'react';
import ClientQuestionnaire from '../components/sections/ClientQuestionnaire';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuestionnairePage = () => {
    return (
        <div className="min-h-screen pt-24 px-6 relative flex flex-col items-center">
            <div className="w-full max-w-4xl mb-4">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} /> Retour à l'accueil
                </Link>
            </div>
            <ClientQuestionnaire isFullPage={true} />
        </div>
    );
};

export default QuestionnairePage;
