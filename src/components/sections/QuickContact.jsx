import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, Phone, Mail, Building, Target, Clock, Coins, Megaphone, FileText, Download } from 'lucide-react';
import Tooltip from '../ui/Tooltip';
import { submitLead, downloadSummary } from '../utils/formHandler';

const QuickContact = ({ isFullPage = false }) => {
    const [form, setForm] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        projectType: '',
        source: '',
        goal: '',
        description: '',
        contentReady: '', // New field
        needHelp: '', // New field
        pageVolume: '', // New field
        budget: '',
        deadline: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success

    const validateForm = () => {
        const required = ['name', 'company', 'email', 'phone', 'projectType'];
        const missing = required.filter(field => !form[field]);
        if (missing.length > 0) {
            alert(`Merci de remplir les champs obligatoires : ${missing.join(', ')}`);
            return false;
        }
        return true;
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setStatus('submitting');
        try {
            await submitLead('contact', form);
            setStatus('success');
            // Auto-download summary for the user
            downloadSummary(form, `Demande_Contact_${form.name.replace(/\s+/g, '_')}.txt`);
        } catch (error) {
            console.error("Submission failed", error);
            setStatus('error');
            alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (status === 'success') {
        return (
            <section id="quick-contact" className={isFullPage ? "w-full" : "py-24 px-6 relative z-10 bg-black/40"}>
                <div className="max-w-4xl mx-auto bg-urban-gray/50 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-sm">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                        <Check size={40} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">Message Reçu !</h3>
                    <p className="text-gray-400 text-lg mb-8">
                        Merci {form.name}. Nous avons bien pris en compte votre projet "{form.company}".<br />
                        Un expert Digiltizème vous recontactera au {form.phone} sous 24h.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={() => downloadSummary(form, `Recap_Digiltizeme_${new Date().toISOString().split('T')[0]}.txt`)}
                            className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto md:mx-0"
                        >
                            <Download size={18} /> Télécharger ma copie
                        </button>
                        <button
                            onClick={() => setStatus('idle')}
                            className="px-6 py-3 text-orange-500 font-bold hover:text-white transition-colors"
                        >
                            Nouvelle demande
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="quick-contact" className={isFullPage ? "w-full" : "py-24 px-6 relative z-10"}>
            <div className={isFullPage ? "w-full" : "max-w-6xl mx-auto"}>
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        Parlons de votre <span className="text-orange-500">Projet</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Vous avez une vision ? Remplissez ce formulaire pour que nous puissions en discuter concrètement.
                    </p>
                </div>

                <div className="bg-urban-gray/30 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden">
                    {/* Decorative Gradients */}
                    {/* Decorative Gradients - z-0 to ensure they stay behind */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none z-0" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none z-0" />

                    <form onSubmit={handleManualSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Column 1: Identity & Coords */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
                                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm text-white">1</span>
                                    Identité & Contact
                                </h3>

                                <div className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nom complet *</label>
                                        <input
                                            required name="name" type="text" placeholder="Votre nom & prénom"
                                            value={form.name} onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center">
                                            Entreprise * <Tooltip text="Le nom de votre structure ou 'En création'." />
                                        </label>
                                        <div className="relative">
                                            <Building size={18} className="absolute left-4 top-3.5 text-gray-500" />
                                            <input
                                                required name="company" type="text" placeholder="Nom de l'entreprise"
                                                value={form.company} onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-4 top-3.5 text-gray-500" />
                                            <input
                                                required name="email" type="email" placeholder="Email pro"
                                                value={form.email} onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-4 top-3.5 text-gray-500" />
                                            <input
                                                required name="phone" type="tel" placeholder="06 12 34 56 78"
                                                value={form.phone} onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center">
                                            Source <Tooltip text="Comment avez-vous entendu parler de nous ?" />
                                        </label>
                                        <div className="relative">
                                            <Megaphone size={18} className="absolute left-4 top-3.5 text-gray-500" />
                                            <select
                                                name="source" value={form.source} onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-black text-gray-500">Choisir...</option>
                                                <option value="linkedin" className="bg-black">LinkedIn</option>
                                                <option value="google" className="bg-black">Recherche Google</option>
                                                <option value="recommandation" className="bg-black">Recommandation / Bouche à oreille</option>
                                                <option value="social" className="bg-black">Réseaux Sociaux (Instagram/Twitter)</option>
                                                <option value="autre" className="bg-black">Autre</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Project Details */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
                                    <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm">2</span>
                                    Votre Projet
                                </h3>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center">
                                                Type * <Tooltip text="Le format global." />
                                            </label>
                                            <select
                                                name="projectType" value={form.projectType} onChange={handleChange}
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-black text-gray-500">Sélectionner...</option>
                                                <option value="vitrine" className="bg-black">Site Vitrine</option>
                                                <option value="ecommerce" className="bg-black">E-commerce</option>
                                                <option value="webapp" className="bg-black">Web App / SaaS</option>
                                                <option value="mobile" className="bg-black">App Mobile</option>
                                                <option value="audit" className="bg-black">Audit / Conseil</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center">
                                                Objectif <Tooltip text="Le but n°1 (ex: Ventes)" />
                                            </label>
                                            <input
                                                required name="goal" type="text" placeholder="Ex: + de ventes"
                                                value={form.goal} onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center">
                                            Contenu <Tooltip text="Avez-vous déjà vos textes et images ?" />
                                        </label>
                                        <select
                                            name="contentReady" value={form.contentReady} onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-black text-gray-500">Contenu disponible ?</option>
                                            <option value="yes" className="bg-black">Oui, tout est prêt</option>
                                            <option value="partial" className="bg-black">Partiellement</option>
                                            <option value="no" className="bg-black">Non, je pars de zéro</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Besoin d'aide ?</label>
                                            <select
                                                name="needHelp" value={form.needHelp} onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-black text-gray-500">Choisir...</option>
                                                <option value="copy" className="bg-black">Rédaction</option>
                                                <option value="photo" className="bg-black">Photos/Vidéo</option>
                                                <option value="both" className="bg-black">Les deux</option>
                                                <option value="none" className="bg-black">Aucun</option>
                                            </select>
                                            <FileText size={18} className="absolute left-4 bottom-3.5 text-gray-500 pointer-events-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Pages Est.</label>
                                            <select
                                                name="pageVolume" value={form.pageVolume} onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-black text-gray-500">Volume...</option>
                                                <option value="<5" className="bg-black">1 à 5 pages</option>
                                                <option value="5-10" className="bg-black">5 à 10 pages</option>
                                                <option value="10+" className="bg-black">10+ pages</option>
                                            </select>
                                            <FileText size={18} className="absolute left-4 bottom-3.5 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center">
                                            Description détaillée <Tooltip text="Dites-nous en quelques mots ce que vous voulez réaliser." />
                                        </label>
                                        <div className="relative">
                                            <FileText size={18} className="absolute left-4 top-3.5 text-gray-500" />
                                            <textarea
                                                name="description"
                                                rows={4}
                                                placeholder="Bonjour, je souhaite moderniser mon site actuel pour qu'il soit plus performant sur mobile et..."
                                                value={form.description} onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600 resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Budget Est.</label>
                                            <div className="relative">
                                                <Coins size={18} className="absolute left-4 top-3.5 text-gray-500" />
                                                <select
                                                    name="budget" value={form.budget} onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                                                >
                                                    <option value="" className="bg-black text-gray-500">Choisir...</option>
                                                    <option value="<3k" className="bg-black">&lt; 3 000 €</option>
                                                    <option value="3k-10k" className="bg-black">3k - 10k €</option>
                                                    <option value="10k-30k" className="bg-black">10k - 30k €</option>
                                                    <option value="30k+" className="bg-black">&gt; 30 000 €</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Deadline</label>
                                            <div className="relative">
                                                <Clock size={18} className="absolute left-4 top-3.5 text-gray-500" />
                                                <select
                                                    name="deadline" value={form.deadline} onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                                                >
                                                    <option value="" className="bg-black text-gray-500">Choisir...</option>
                                                    <option value="urgent" className="bg-black text-red-400">Urgent</option>
                                                    <option value="1-3m" className="bg-black">1-3 mois</option>
                                                    <option value="3m+" className="bg-black">3 mois +</option>
                                                    <option value="flexible" className="bg-black">Flexible</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2 pt-4 flex flex-col items-center">
                            <button
                                type="button"
                                onClick={handleManualSubmit}
                                disabled={status === 'submitting'}
                                className="w-full md:w-auto px-12 py-4 bg-white text-black font-black text-lg rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                            >
                                {status === 'submitting' ? 'Envoi...' : <>Envoyer ma demande <Send size={20} /></>}
                            </button>
                            <p className="mt-6 text-sm text-gray-500">
                                Pour un audit détaillé de 10 min, passez par notre
                                <a href="/plan" className="text-white hover:text-orange-400 ml-1 font-medium underline decoration-gray-500 underline-offset-4 transition-colors">
                                    Questionnaire Complet
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default QuickContact;
