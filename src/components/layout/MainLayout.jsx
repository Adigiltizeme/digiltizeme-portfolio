import React from 'react';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-urban-black text-white font-sans selection:bg-orange-500 overflow-hidden relative">
            {/* Global Grain/Noise overlay if needed in future */}
            {/* Header/Logo */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center pointer-events-none">
                <Link to="/" className="flex items-center gap-3 pointer-events-auto cursor-pointer group">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center p-2 group-hover:bg-white/10 transition-colors">
                        <img
                            src="/images/digiltizeme_logo_mono.png"
                            alt="Digiltizème"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 pointer-events-auto bg-black/40 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10">
                    <Link to="/" className="px-5 py-2 text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">ACCUEIL</Link>
                    <Link to="/contact" className="px-5 py-2 text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">CONTACT</Link>
                    <Link to="/plan" className="px-5 py-2 text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
                        MON PROJET
                    </Link>
                </div>

                {/* Mobile Navigation Placeholder (Simple hamburger or direct link for now) */}
                <div className="md:hidden pointer-events-auto">
                    <Link to="/plan" className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <span className="font-bold text-xl">+</span>
                    </Link>
                </div>
            </nav>

            {children}
        </div>
    );
};

export default MainLayout;
