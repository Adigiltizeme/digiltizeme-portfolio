import React from 'react';
import QuickContact from '../components/sections/QuickContact';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
    return (
        <div className="min-h-screen pt-24 px-6 relative">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={20} /> Retour à l'accueil
            </Link>
            <QuickContact isFullPage={true} />
        </div>
    );
};

export default ContactPage;
