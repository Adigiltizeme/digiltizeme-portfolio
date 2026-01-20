import { useNavigate } from 'react-router-dom';
import { X, Mail, Phone, Calendar, Building, FileText, Globe, Target, DollarSign, Share2, Terminal } from 'lucide-react';
import { getApiUrl } from '../utils/formHandler';
import { AnimatePresence, motion } from 'framer-motion';

const LeadDetailModal = ({ lead, onClose }) => {
    const navigate = useNavigate();
    if (!lead) return null;

    const handleExportMindMap = () => {
        downloadMarkmap(lead);
    };

    const handleInitProject = async () => {
        if (!window.confirm('Voulez-vous mobiliser l\'équipe Dev\'OMax pour ce projet ?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();

            const response = await fetch(`${API_URL}/projects/init/${lead.id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const project = await response.json();
                onClose();
                navigate(`/admin/dev-omax/${project.id}`);
            } else {
                const err = await response.json();
                alert(`Erreur: ${err.message || 'Impossible d\'initialiser le projet'}`);
            }
        } catch (error) {
            console.error('❌ Failed to init project:', error);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[#0A0A0A] border border-white/10 w-full max-w-3xl rounded-3xl overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-white">{lead.name}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(lead.status)}`}>
                                    {lead.status || 'NOUVEAU'}
                                </span>
                            </div>
                            <p className="text-white/60 flex items-center gap-2">
                                <Building size={14} /> {lead.company || 'Entreprise non spécifiée'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                        {/* Contact Info */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-sm text-white/40 mb-1 flex items-center gap-2"><Mail size={14} /> Email</div>
                                <div className="text-white font-medium select-all">{lead.email}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="text-sm text-white/40 mb-1 flex items-center gap-2"><Phone size={14} /> Téléphone</div>
                                <div className="text-white font-medium select-all">{lead.phone}</div>
                            </div>
                        </section>

                        {/* Project Details */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Globe size={18} className="text-primary-500" /> Le Projet
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <DetailCard label="Type" value={lead.projectType} />
                                <DetailCard label="Budget" value={lead.budget} icon={DollarSign} />
                                <DetailCard label="Deadline" value={lead.deadline} icon={Calendar} />
                            </div>

                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <div className="text-sm text-white/40 mb-2 flex items-center gap-2"><FileText size={14} /> Description</div>
                                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                                    {lead.description || "Aucune description fournie."}
                                </p>
                            </div>
                        </section>

                        {/* Additional Info (Context) */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Target size={18} className="text-primary-500" /> Contexte
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailCard label="Source" value={lead.source} />
                                <DetailCard label="Objectif" value={lead.goal} />
                                <DetailCard label="Contenu Prêt ?" value={lead.contentReady} />
                                <DetailCard label="Volume Pages" value={lead.pageVolume} />
                            </div>
                        </section>

                        {/* Full Questionnaire Data */}
                        {lead.details && Object.keys(lead.details).length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText size={18} className="text-orange-500" /> Questionnaire complet
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {Object.entries(lead.details).map(([key, value]) => {
                                        if (!value || typeof value === 'object') return null;
                                        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                                        return (
                                            <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="text-xs text-white/40 mb-1 uppercase tracking-wider font-bold">{label}</div>
                                                <div className="text-white/90 whitespace-pre-wrap">{value}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Metadata */}
                        <div className="text-xs text-white/20 text-center pt-4 border-t border-white/5">
                            ID: {lead.id} • Créé le {new Date(lead.createdAt).toLocaleString()}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/10 bg-white/5 flex flex-wrap gap-4 justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Fermer
                        </button>

                        <button
                            onClick={handleExportMindMap}
                            className="px-6 py-2.5 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all flex items-center gap-2 group"
                            title="Télécharger le fichier .md pour Markmap"
                        >
                            <Share2 size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                            Générer Mind Map
                        </button>

                        <a
                            href={`mailto:${lead.email}?subject=Re: Votre projet ${lead.company || ''} - Digiltizème`}
                            className="px-6 py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20 transition-all flex items-center gap-2"
                        >
                            <Mail size={18} /> Répondre
                        </a>

                        {lead.status === 'SIGNE' && (
                            <button
                                onClick={handleInitProject}
                                className="px-6 py-2.5 rounded-xl font-bold bg-cyan-400 text-black hover:shadow-[0_0_20px_#22d3ee] transition-all flex items-center gap-2"
                            >
                                <Terminal size={18} /> Mobiliser Dev'OMax
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const DetailCard = ({ label, value, icon: Icon }) => (
    <div className="bg-white/[0.03] p-3 rounded-lg border border-white/5">
        <div className="text-xs text-white/40 mb-1 flex items-center gap-1">
            {Icon && <Icon size={10} />}
            {label}
        </div>
        <div className="text-sm font-medium text-white/90">
            {value || '-'}
        </div>
    </div>
);

const getStatusStyle = (status) => {
    switch (status) {
        case 'NOUVEAU': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
        case 'CONTACTE': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
        case 'SIGNE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
        case 'PERDU': return 'bg-red-500/20 text-red-400 border-red-500/20';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
};

export default LeadDetailModal;
