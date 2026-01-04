import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone, Globe, Code, ShoppingCart,
    Lightbulb, FileText, Figma,
    ArrowRight, Check, Send, Sparkles, RefreshCw
} from 'lucide-react';

// Data Configuration
const STEPS = [
    {
        id: 'type',
        question: "Quel type de projet souhaitez-vous lancer ?",
        options: [
            { id: 'vitrine', icon: Globe, label: "Site Vitrine", desc: "Présenter mon activité" },
            { id: 'ecommerce', icon: ShoppingCart, label: "E-commerce", desc: "Vendre des produits" },
            { id: 'webapp', icon: Code, label: "Web App / SaaS", desc: "Logiciel métier complexe" },
            { id: 'mobile', icon: Smartphone, label: "Application Mobile", desc: "iOS & Android" },
        ]
    },
    {
        id: 'maturity',
        question: "Où en êtes-vous dans votre réflexion ?",
        options: [
            { id: 'idea', icon: Lightbulb, label: "Idée Vague", desc: "Besoin de conseil & cadrage" },
            { id: 'specs', icon: FileText, label: "Cahier des Charges", desc: "Fonctionnalités définies" },
            { id: 'design', icon: Figma, label: "Maquettes Prêtes", desc: "Prêt à développer" },
        ]
    },
    {
        id: 'scale',
        question: "Quelle est l'ampleur du projet ?",
        options: [
            { id: 'small', label: "Lancement (< 5 pages/écrans)", desc: "MVP ou Essentiel" },
            { id: 'medium', label: "Standard (5-15 pages/écrans)", desc: "Projet complet" },
            { id: 'large', label: "Envergure (15+ pages/écrans)", desc: "Plateforme complexe" },
        ]
    }
];

const ProjectStarter = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState({});
    const [form, setForm] = useState({ name: '', email: '', phone: '', details: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (option) => {
        setSelections(prev => ({ ...prev, [STEPS[currentStep].id]: option }));
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0 && !isSubmitted) setCurrentStep(prev => prev - 1);
    };

    const reset = () => {
        setCurrentStep(0);
        setSelections({});
        setIsSubmitted(false);
        setForm({ name: '', email: '', phone: '', details: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send data to an API
        console.log("Form Submitted:", { selections, form });
        setIsSubmitted(true);
    };

    // Logic to generate dynamic recommendation
    const getRecommendation = () => {
        const { type, maturity } = selections;
        let stack = "React & Node.js";
        let duration = "3-5 semaines";

        if (type?.id === 'mobile') {
            stack = "React Native (iOS/Android)";
            duration = "5-8 semaines";
        } else if (type?.id === 'ecommerce') {
            stack = "Next.js ou Shopify Headless";
        }

        if (maturity?.id === 'idea') {
            duration = "Cadrage + " + duration;
        }

        return { stack, duration };
    };

    return (
        <section id="project-starter" className="py-24 px-6 max-w-5xl mx-auto relative z-20">
            <div className="bg-urban-gray/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm overflow-hidden relative min-h-[600px] flex flex-col">

                {/* Background Atmosphere */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 mb-8 md:mb-12 flex justify-between items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-orange-400 text-sm font-bold mb-4 border border-white/5">
                            <Sparkles size={16} /> Démarrage Projet
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black">
                            {isSubmitted ? "Message Envoyé !" : currentStep < STEPS.length ? `Étape ${currentStep + 1}/${STEPS.length}` : "Votre Solution"}
                        </h2>
                    </div>
                    {currentStep > 0 && !isSubmitted && (
                        <button onClick={reset} className="text-sm text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
                            <RefreshCw size={14} /> Reset
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-center relative z-10">
                    <AnimatePresence mode="wait">
                        {isSubmitted ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                    <Check size={48} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Merci, {form.name} !</h3>
                                <p className="text-gray-400 max-w-md mx-auto mb-8">
                                    Nous avons bien reçu les détails de votre projet
                                    <span className="text-white font-bold"> {selections.type?.label}</span>.
                                    Un expert Digiltizème vous recontactera sous 24h pour discuter de la suite.
                                </p>
                                <button onClick={reset} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
                                    Lancer une autre simulation
                                </button>
                            </motion.div>
                        ) : currentStep < STEPS.length ? (
                            <motion.div
                                key={STEPS[currentStep].id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full"
                            >
                                <h3 className="text-2xl font-bold mb-8">{STEPS[currentStep].question}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {STEPS[currentStep].options.map(option => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSelect(option)}
                                                className="text-left p-6 bg-white/5 hover:bg-orange-500 border border-white/10 hover:border-orange-500 rounded-2xl transition-all duration-300 group relative overflow-hidden"
                                            >
                                                <div className="relative z-10 flex items-start gap-4">
                                                    {Icon && <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors"><Icon size={24} className="text-orange-400 group-hover:text-white" /></div>}
                                                    <div>
                                                        <div className="font-bold text-lg mb-1 group-hover:text-white">{option.label}</div>
                                                        <div className="text-sm text-gray-400 group-hover:text-white/80">{option.desc}</div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                {currentStep > 0 && (
                                    <button onClick={handleBack} className="mt-8 text-gray-500 hover:text-white transition-colors text-sm">
                                        ← Retour
                                    </button>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                            >
                                {/* Summary & Recommendation */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-fit">
                                    <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-6">Votre Configuration</h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-gray-400">Projet</span>
                                            <span className="font-bold text-white">{selections.type?.label}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-gray-400">Maturité</span>
                                            <span className="font-bold text-white">{selections.maturity?.label}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-gray-400">Ampleur</span>
                                            <span className="font-bold text-white">{selections.scale?.label}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-orange-500/20 to-purple-500/20 p-6 rounded-xl border border-orange-500/30">
                                        <h4 className="font-bold text-orange-400 mb-2 flex items-center gap-2">
                                            <Sparkles size={16} /> Recommandation IA
                                        </h4>
                                        <p className="text-sm text-gray-300 mb-2">
                                            Tech Stack : <span className="text-white font-mono">{getRecommendation().stack}</span>
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            Délai estimé : <span className="text-white font-mono">{getRecommendation().duration}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Dernière étape !</h3>
                                    <p className="text-gray-400 mb-6">Où pouvons-nous vous envoyer cette proposition détaillée ?</p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Nom complet</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={form.name}
                                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Téléphone</label>
                                                <input
                                                    type="tel"
                                                    value={form.phone}
                                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                                    placeholder="06..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Email Pro</label>
                                            <input
                                                required
                                                type="email"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                                placeholder="john@company.com"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Détails (Optionnel)</label>
                                            <textarea
                                                rows="3"
                                                value={form.details}
                                                onChange={e => setForm({ ...form, details: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"
                                                placeholder="Un lien vers vos maquettes, une deadline ?"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group mt-4"
                                        >
                                            Recevoir mon estimation <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <p className="text-xs text-center text-gray-600 mt-4">
                                            *Vos données restent confidentielles. Réponse sous 24h garantie.
                                        </p>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default ProjectStarter;
