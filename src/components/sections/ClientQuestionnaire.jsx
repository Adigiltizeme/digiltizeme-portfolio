import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Send } from 'lucide-react';
import Tooltip from '../ui/Tooltip';
import { Info, Download } from 'lucide-react';
import { submitLead, downloadSummary } from '../utils/formHandler';

// Comprehensive Educational Tooltips for ALL fields
const SECTIONS = [
    {
        id: 0,
        title: "Identité",
        questions: [
            { key: "Nom", tooltip: "Votre nom complet." },
            { key: "Nom_entreprise", tooltip: "Le nom officiel de votre structure (Société, Marque, ou Projet)." },
            { key: "Email", tooltip: "Votre adresse email professionnelle." },
            { key: "Téléphone", tooltip: "Un numéro pour vous joindre." }
        ]
    },
    {
        id: 1,
        title: "L'Activité",
        questions: [
            { key: "Secteur", tooltip: "Votre domaine d'activité principal (ex: BTP, Restauration, E-commerce, Santé...)." },
            { key: "Taille", tooltip: "Nombre de personnes dans l'entreprise. Cela nous aide à dimensionner les outils de gestion." },
            { key: "Anciennete", tooltip: "Depuis quand existez-vous ? Une startup a des besoins différents d'une PME établie." }
        ]
    },
    {
        id: 2,
        title: "Cible & Clients",
        questions: [
            { key: "Client_ideal", tooltip: "Décrivez votre client 'parfait' (Âge, Profession, Problème qu'il cherche à résoudre)." },
            { key: "Type_client", tooltip: "B2B (Vente aux entreprises), B2C (Vente aux particuliers), ou les deux ?" },
            { key: "Zone_geo", tooltip: "Où se trouvent vos clients ? (Local, National, International)." }
        ]
    },
    {
        id: 3,
        title: "Objectifs",
        questions: [
            { key: "Origine_projet", tooltip: "Pourquoi maintenant ? (Lancement, Refonte car site obsolète, Pivot stratégie...)" },
            { key: "Objectifs_principaux", tooltip: "Que voulez-vous obtenir ? (Plus de leads, Vendre en ligne, Gagner en crédibilité...)" },
            { key: "Kpis_succes", tooltip: "Key Performance Indicators : Comment saurez-vous que le projet est une réussite ? (Chiffre d'affaires, Trafic, Appels...)" }
        ]
    },
    {
        id: 4,
        title: "Format Solution",
        questions: [
            { key: "Type_solution", tooltip: "Site Vitrine (Présentation), E-commerce (Vente), Web App (Logiciel métier), Mobile (App Store)." },
            { key: "Devices", tooltip: "Sur quels supports vos utilisateurs iront-ils principalement ? (Smartphone, Ordinateur de bureau, Tablette)." },
            { key: "Hors_ligne", tooltip: "L'application doit-elle fonctionner sans internet ? (Mode Offline)." }
        ]
    },
    {
        id: 5,
        title: "Fonctionnalités",
        questions: [
            { key: "Fonctions_essentielles", tooltip: "Les 'Must-Have'. Sans ça, le projet ne sert à rien. (ex: Paiement, Réservation, Espace membre)." },
            { key: "Fonctions_nice_to_have", tooltip: "Les 'Plus'. Ce serait super de l'avoir, mais on peut lancer sans." },
            { key: "Integrations", tooltip: "Outils externes à connecter ? (CRM, Newsletter, Google Maps, Stripe, Calendly...)" }
        ]
    },
    {
        id: 6,
        title: "Utilisateurs",
        questions: [
            { key: "Roles", tooltip: "Qui va administrer le site ? (Admin, Éditeur, Commercial...)" },
            { key: "Gestion_contenu", tooltip: "Souhaitez-vous être totalement autonome pour modifier les textes et images ?" }
        ]
    },
    {
        id: 7,
        title: "Design",
        questions: [
            { key: "Charte_graphique", tooltip: "Avez-vous déjà un logo, des couleurs, une police définis ?" },
            { key: "Inspirations", tooltip: "Citez des sites dont vous aimez le style (Concurrents ou non)." },
            { key: "Ambiance", tooltip: "Quels adjectifs décrivent le mieux votre marque ? (Sérieux, Ludique, Premium, Minimaliste...)" }
        ]
    },
    {
        id: 8,
        title: "Contenu",
        questions: [
            { key: "Contenu_dispo", tooltip: "Avez-vous déjà les textes et les photos ? C'est souvent ce qui retarde les projets." },
            { key: "Besoin_aide", tooltip: "Avez-vous besoin d'un Copywriter (Rédacteur) ou d'un Photographe ?" },
            { key: "Volume_pages", tooltip: "Estimation du nombre de pages (Accueil, Services, À propos, Contact...)" }
        ]
    },
    {
        id: 9,
        title: "Tech & Légal",
        questions: [
            { key: "Domaine", tooltip: "L'adresse de votre site (ex: monentreprise.com). L'avez-vous déjà réservé ?" },
            { key: "Hebergement", tooltip: "Le serveur où sont stockés les fichiers. (OVH, Ionos, AWS...). Avez-vous une préférence ?" },
            { key: "Rgpd", tooltip: "Règlement Général sur la Protection des Données. Traitez-vous des données sensibles ?" },
            { key: "Accessibilité", tooltip: "Le site doit-il être adapté aux personnes en situation de handicap (Normes RGAA) ?" }
        ]
    },
    {
        id: 10,
        title: "SEO & Marketing",
        questions: [
            { key: "Seo_importance", tooltip: "Référencement Naturel : Est-il vital d'être 1er sur Google rapidement ?" },
            { key: "Mots_cles", tooltip: "Sur quels termes de recherche voulez-vous qu'on vous trouve ? (ex: 'Plombier Paris')" },
            { key: "Budget_ads", tooltip: "Prévoyez-vous de la publicité payante (Google Ads, Facebook Ads) au lancement ?" },
            { key: "Social_media", tooltip: "Quels réseaux sociaux devrons-nous intégrer au site ?" }
        ]
    },
    {
        id: 11,
        title: "Budget & Délai",
        questions: [
            { key: "Budget_range", tooltip: "Une fourchette réaliste nous aide à proposer des solutions adaptées (ex: <5k€, 5-10k€, >20k€)." },
            { key: "Delai", tooltip: "Quand souhaitez-vous que le site soit en ligne ?" },
            { key: "Deadline_ferme", tooltip: "Y a-t-il une date impérative ? (Salon, Lancement produit...)" }
        ]
    },
    {
        id: 12,
        title: "Maintenance",
        questions: [
            { key: "Apres_lancement", tooltip: "Qui s'occupera des mises à jour de sécurité et des sauvegardes ?" },
            { key: "Evolutions_futures", tooltip: "Avez-vous déjà en tête une 'Phase 2' avec plus de fonctionnalités ?" }
        ]
    },
    {
        id: 13,
        title: "Concurrence",
        questions: [
            { key: "Concurrents", tooltip: "Qui sont vos rivaux directs ?" },
            { key: "Differentiation", tooltip: "Pourquoi un client vous choisirait vous plutôt qu'eux ? (Votre 'Secret Sauce')." }
        ]
    },
    {
        id: 14,
        title: "Synthèse",
        questions: [
            { key: "Vision", tooltip: "En une phrase, quelle est la vision ultime de ce projet ?" },
            { key: "Priorites", tooltip: "Si on doit sacrifier quelque chose (Coût, Délai, Qualité), que protège-t-on en priorité ?" },
            { key: "Preoccupations", tooltip: "Qu'est-ce qui vous fait le plus peur dans ce projet informatique ?" }
        ]
    }
];

const ClientQuestionnaire = ({ onClose, isFullPage = false }) => {
    const [currentSection, setCurrentSection] = useState(() => {
        const saved = localStorage.getItem('digiltizeme_draft_section');
        console.log("🛠️ [DEBUG] Loading draft section:", saved);
        return saved ? parseInt(saved, 10) : 0;
    });
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('digiltizeme_draft_questionnaire');
        console.log("🛠️ [DEBUG] Loading draft data exists:", !!saved);
        return saved ? JSON.parse(saved) : {};
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Force reset helper
    const handleForceReset = () => {
        localStorage.removeItem('digiltizeme_draft_questionnaire');
        localStorage.removeItem('digiltizeme_draft_section');
        setFormData({});
        setCurrentSection(0);
        setIsSuccess(false);
        console.log("🛠️ [DEBUG] Manual reset triggered");
    };

    // Save data to localStorage
    React.useEffect(() => {
        if (Object.keys(formData).length > 0) {
            localStorage.setItem('digiltizeme_draft_questionnaire', JSON.stringify(formData));
        }
    }, [formData]);

    // Save current section to localStorage
    React.useEffect(() => {
        localStorage.setItem('digiltizeme_draft_section', currentSection.toString());
    }, [currentSection]);

    const handleNext = () => {
        if (currentSection < SECTIONS.length - 1) setCurrentSection(prev => prev + 1);
        else handleSubmit();
    };

    const handlePrev = () => {
        if (currentSection > 0) setCurrentSection(prev => prev - 1);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // MAP DATA TO BACKEND DTO
            // The backend expects specific names, but the questionnaire uses French keys
            const mappedData = {
                name: formData.Nom || '',
                company: formData.Nom_entreprise || '',
                email: formData.Email || '',
                phone: formData.Téléphone || '',
                projectType: formData.Type_solution || 'vitrine',
                goal: formData.Objectifs_principaux || '',
                description: formData.Vision || formData.Origine_projet || '',
                contentReady: formData.Contenu_dispo || '',
                needHelp: formData.Besoin_aide || '',
                pageVolume: formData.Volume_pages || '',
                budget: formData.Budget_range || '',
                deadline: formData.Delai || '',
                // Pass EVERYTHING else into the 'details' JSON field
                details: { ...formData }
            };

            await submitLead('plan', mappedData);

            // Success! Clear the draft and reset section
            localStorage.removeItem('digiltizeme_draft_questionnaire');
            localStorage.removeItem('digiltizeme_draft_section');
            setCurrentSection(0);
            setIsSuccess(true);
        } catch (error) {
            console.error("Submission error", error);
            alert("Une erreur est survenue lors de l'envoi. Veuillez vérifier votre connexion et réessayer. Vos données ont été sauvegardées localement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={isFullPage ? "w-full min-h-[600px] flex items-center justify-center py-12" : "fixed inset-0 z-[60] flex items-center justify-center p-4"}>
            {!isFullPage && <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />}

            <motion.div
                initial={isFullPage ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.95 }}
                animate={isFullPage ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
                className={`relative bg-urban-black border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col shadow-2xl
                    ${isFullPage ? 'min-h-[50vh]' : 'h-[90vh] md:h-auto md:max-h-[90vh]'}
                `}
                style={{ maxHeight: isFullPage ? 'none' : '90dvh' }} // Use dynamic viewport height
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Partie {currentSection + 1}/{SECTIONS.length}</span>
                            {SECTIONS[currentSection].title}
                        </h2>
                        {isFullPage && (
                            <button
                                onClick={handleForceReset}
                                className="text-[10px] uppercase font-bold text-gray-500 hover:text-white transition-colors"
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>
                    {!isFullPage && (
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/5 w-full">
                    <motion.div
                        className="h-full bg-gradient-to-r from-orange-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentSection + 1) / SECTIONS.length) * 100}%` }}
                    />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 relative">
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center flex flex-col items-center justify-center h-full my-12"
                            >
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                    <Check size={48} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-black mb-4">Dossier Transmis !</h3>
                                <p className="text-gray-400 max-w-lg mb-8">
                                    Merci d'avoir pris le temps de détailler votre projet.
                                    Nous allons analyser vos réponses et préparer un plan d'action sur-mesure pour notre rendez-vous.
                                </p>
                                <div className="flex flex-col gap-4 items-center">
                                    <button
                                        onClick={() => downloadSummary(formData, 'Mon_Projet_Digiltizeme.txt')}
                                        className="px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
                                    >
                                        <Download size={20} /> Télécharger le récapitulatif
                                    </button>

                                    {isFullPage ? (
                                        <a href="/" className="px-8 py-3 text-gray-400 hover:text-white transition-colors mt-4">
                                            Retour à l'accueil
                                        </a>
                                    ) : (
                                        <button onClick={onClose} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                            Fermer
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <p className="text-gray-400 italic mb-4 text-sm">
                                        Conseil : Survolez ou cliquez sur le <Info className="inline-block text-orange-500" size={16} /> pour obtenir de l'aide sur une question.
                                    </p>
                                    <div className="space-y-6">
                                        {SECTIONS[currentSection].questions.map(item => {
                                            const fieldKey = item.key;
                                            const tooltip = item.tooltip;

                                            // Handle special labels for better readability
                                            const label = fieldKey.replace(/_/g, ' ')
                                                .replace("kpis succes", "KPIs (Indicateurs de succès)")
                                                .replace("rgpd", "RGPD (Données personnelles)");

                                            return (
                                                <div key={fieldKey} className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-300 flex items-center">
                                                        {label}
                                                        {tooltip && <Tooltip text={tooltip} />}
                                                    </label>
                                                    <textarea
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                                        rows={2}
                                                        placeholder="Votre réponse..."
                                                        value={formData[fieldKey] || ''}
                                                        onChange={(e) => handleChange(fieldKey, e.target.value)}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/5 bg-white/5 flex justify-between items-center">
                        <button
                            onClick={handlePrev}
                            disabled={currentSection === 0}
                            className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft size={20} /> Précédent
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-white text-black font-bold rounded-xl active:bg-gray-200 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 min-h-[50px]"
                        >
                            {currentSection === SECTIONS.length - 1 ? (
                                isSubmitting ? 'Envoi...' : <>Terminer <Send size={18} /></>
                            ) : (
                                <>Suivant <ChevronRight size={20} /></>
                            )}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ClientQuestionnaire;
