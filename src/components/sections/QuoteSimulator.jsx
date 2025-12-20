import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Smartphone, Globe, Code, Check, ArrowRight, RefreshCw } from 'lucide-react';

const steps = [
    {
        id: 'type',
        question: "Quel type de projet avez-vous en tête ?",
        options: [
            { id: 'web', icon: Globe, label: "Web App / SaaS", price: 5250, duration: "~3 semaines" },
            { id: 'mobile', icon: Smartphone, label: "Mobile App (iOS/Android)", price: 8750, duration: "~5 semaines" },
            { id: 'custom', icon: Code, label: "Solution Sur-Mesure", price: 14000, duration: "~8 semaines" },
        ]
    },
    {
        id: 'complexity',
        question: "Quelle est l'ambition du projet ?",
        options: [
            { id: 'mvp', label: "MVP (Lancement Rapide)", multiplier: 1 },
            { id: 'scale', label: "Pro (Design & Features)", multiplier: 1.5 },
            { id: 'enterprise', label: "Enterprise (Scale & Secu)", multiplier: 2.5 },
        ]
    }
];

const QuoteSimulator = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState({});
    const [showResult, setShowResult] = useState(false);

    const handleSelect = (option) => {
        const stepId = steps[currentStep].id;
        setSelections(prev => ({ ...prev, [stepId]: option }));

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    const calculateEstimate = () => {
        const base = selections.type?.price || 0;
        const mult = selections.complexity?.multiplier || 1;
        return base * mult;
    };

    const reset = () => {
        setCurrentStep(0);
        setSelections({});
        setShowResult(false);
    };

    return (
        <section id="simulator" className="py-24 px-6 max-w-4xl mx-auto relative z-20">
            <div className="bg-urban-gray/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm overflow-hidden relative">
                {/* Background Gradients */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl rounded-full" />

                <div className="relative z-10 text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-orange-400 text-sm font-bold mb-4 border border-white/5">
                        <Calculator size={16} /> Simulateur de Projet
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Estimez votre investissement</h2>
                    <p className="text-gray-400">Répondez à 2 questions simples pour obtenir une fourchette budgétaire.</p>
                </div>

                <div className="min-h-[300px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!showResult ? (
                            <motion.div
                                key={steps[currentStep].id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full max-w-2xl"
                            >
                                <h3 className="text-2xl font-bold mb-8 text-center">{steps[currentStep].question}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {steps[currentStep].options.map(option => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSelect(option)}
                                                className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-orange-500 hover:text-white border border-white/10 hover:border-orange-500 rounded-2xl transition-all duration-300 group"
                                            >
                                                {Icon && <Icon size={32} className="mb-4 text-gray-400 group-hover:text-white transition-colors" />}
                                                <span className="font-bold text-lg mb-1">{option.label}</span>
                                                {option.duration && <span className="text-sm text-gray-300 font-medium mt-1">{option.duration}</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center w-full"
                            >
                                <div className="mb-2 text-gray-400 uppercase tracking-widest text-sm font-bold">Estimation Préliminaire</div>
                                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-8 font-inter tracking-tighter">
                                    {calculateEstimate().toLocaleString('fr-FR')}€*
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                    <a
                                        href="https://calendly.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        Discuter de ce budget <ArrowRight size={20} />
                                    </a>
                                    <button
                                        onClick={reset}
                                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors flex items-center gap-2"
                                    >
                                        <RefreshCw size={18} /> Recommencer
                                    </button>
                                </div>
                                <p className="mt-8 text-xs text-gray-500">*Ceci est une estimation brute basée sur des paramètres standards. Le prix final dépendra du cahier des charges détaillé.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default QuoteSimulator;
