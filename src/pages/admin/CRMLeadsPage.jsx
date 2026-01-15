import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiUrl } from '../../components/utils/formHandler';
import LeadDetailModal from '../../components/admin/LeadDetailModal';
import AdminSidebar from '../../components/admin/AdminSidebar';

const CRMLeadsPage = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();
            const response = await fetch(`${API_URL}/leads`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                navigate('/admin/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setLeads(data);
            }
        } catch (error) {
            console.error('❌ Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (leadId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();
            const response = await fetch(`${API_URL}/leads/${leadId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
            }
        } catch (error) {
            console.error('❌ Failed to update lead status:', error);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary-500/30">
            {/* Sidebar Navigation */}
            <AdminSidebar />

            {/* Modal */}
            <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />

            <main className="lg:ml-64 p-8 relative z-0">
                <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">CRM Leads</h1>
                        <p className="text-white/40 mt-1">Historique complet et gestion des prospects.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/20 appearance-none min-w-[160px]"
                            >
                                <option value="ALL">Tous les statuts</option>
                                <option value="NOUVEAU">Nouveau</option>
                                <option value="CONTACTE">Contacté</option>
                                <option value="SIGNE">Signé</option>
                                <option value="PERDU">Perdu</option>
                            </select>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/20"
                            />
                        </div>
                    </div>
                </header>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-white/60 text-sm uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Entreprise</th>
                                    <th className="px-6 py-4">Projet</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-white/40">
                                            <Loader2 className="mx-auto w-8 h-8 animate-spin text-primary-500" />
                                        </td>
                                    </tr>
                                ) : filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-white/40">Aucun prospect trouvé.</td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{lead.name}</div>
                                                <div className="text-xs text-white/40">{lead.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-white/80">{lead.company || '-'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] border border-white/10 w-fit">
                                                        {lead.projectType || 'Standard'}
                                                    </span>
                                                    {lead.budget && (
                                                        <span className="text-[10px] text-emerald-400/80 font-medium">
                                                            {lead.budget}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={lead.status}
                                                    onChange={(newStatus) => handleUpdateStatus(lead.id, newStatus)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white/60 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3 text-white/20" />
                                                    {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedLead(lead)}
                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    Détails
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

const StatusBadge = ({ status, onChange }) => {
    const styles = {
        NOUVEAU: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        CONTACTE: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        SIGNE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        PERDU: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const statusOptions = ['NOUVEAU', 'CONTACTE', 'SIGNE', 'PERDU'];

    return (
        <div className="relative inline-block group">
            <select
                value={status || 'NOUVEAU'}
                onChange={(e) => onChange(e.target.value)}
                className={`appearance-none px-3 py-1 rounded-full text-[11px] font-bold border bg-transparent cursor-pointer focus:outline-none ${styles[status] || styles.NOUVEAU} transition-colors pr-6 relative z-10`}
            >
                {statusOptions.map(opt => (
                    <option key={opt} value={opt} className="bg-zinc-900 text-white py-2">{opt}</option>
                ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-current opacity-60" />
            </div>
        </div>
    );
};

export default CRMLeadsPage;
