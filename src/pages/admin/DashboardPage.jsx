
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, TrendingUp, Search, User, Shield, Filter, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiUrl } from '../../components/utils/formHandler';
import LeadDetailModal from '../../components/admin/LeadDetailModal';
import AdminSidebar from '../../components/admin/AdminSidebar';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({ total: 0, new: 0, potential: 0 });
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

            console.log('🔐 Fetching leads with token:', token ? 'Present' : 'Missing');

            const response = await fetch(`${API_URL}/leads`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(`📡 GET ${API_URL}/leads response status:`, response.status);

            if (response.status === 401) {
                console.warn('⚠️ Token expired or invalid. Redirecting to login...');
                handleLogout();
                return;
            }

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Leads fetched:', data.length, 'leads');
                setLeads(data);
                const newLeads = data.filter(l => l.status === 'NOUVEAU').length;
                setStats({ total: data.length, new: newLeads, potential: data.length * 1500 });
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to fetch leads:', response.status, errorText);
            }
        } catch (error) {
            console.error('⚠️ Network error fetching leads:', error);
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

    const handleDeleteLead = async (leadId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();

            const response = await fetch(`${API_URL}/leads/${leadId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setLeads(prev => prev.filter(l => l.id !== leadId));
            }
        } catch (error) {
            console.error('❌ Failed to delete lead:', error);
        }
    };

    const handleInitProject = async (leadId) => {
        if (!window.confirm('Voulez-vous mobiliser l\'équipe Dev\'OMax pour ce projet ?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();

            const response = await fetch(`${API_URL}/projects/init/${leadId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const project = await response.json();
                navigate(`/admin/dev-omax/${project.id}`);
            } else {
                const err = await response.json();
                alert(`Erreur: ${err.message || 'Impossible d\'initialiser le projet'}`);
            }
        } catch (error) {
            console.error('❌ Failed to init project:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
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
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none" />

            {/* Modal */}
            <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />

            {/* Sidebar Navigation */}
            <AdminSidebar />

            <main className="lg:ml-64 p-8 relative z-0">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-white/40 mt-1">Welcome back, Admin</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/admin/profile"
                            className="w-10 h-10 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold hover:bg-primary-500/30 transition-colors"
                        >
                            A
                        </Link>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard title="Total Leads" value={stats.total} icon={Users} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
                    <StatCard title="New Requests" value={stats.new} icon={LayoutDashboard} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
                    <StatCard title="Pipeline Value" value={`€${stats.potential} `} icon={TrendingUp} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
                </div>

                {/* Leads Table Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-bold">CRM Leads & Prospects</h2>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* Status Filter */}
                            <div className="relative flex-1 sm:flex-none">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20 appearance-none min-w-[140px]"
                                >
                                    <option value="ALL">Tous les statuts</option>
                                    <option value="NOUVEAU">Nouveaux</option>
                                    <option value="CONTACTE">Contactés</option>
                                    <option value="SIGNE">Signés</option>
                                    <option value="PERDU">Perdus</option>
                                </select>
                            </div>

                            {/* Search */}
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-white/60 text-sm uppercas font-medium">
                                <tr>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Project</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredLeads.length === 0 ? (
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
                                                <span className="px-2 py-1 rounded-md bg-white/10 text-xs border border-white/10">
                                                    {lead.projectType || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={lead.status}
                                                    onChange={(newStatus) => handleUpdateStatus(lead.id, newStatus)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white/60">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                {lead.status === 'SIGNE' && (
                                                    <button
                                                        onClick={() => handleInitProject(lead.id)}
                                                        className="p-1.5 rounded-lg bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-colors title='Mobiliser Dev\'OMax'"
                                                    >
                                                        <Terminal className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedLead(lead)}
                                                    className="text-sm text-primary-400 hover:text-primary-300 font-medium"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLead(lead.id)}
                                                    className="text-sm text-red-400 hover:text-red-300 font-medium"
                                                >
                                                    Delete
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

const StatCard = ({ title, value, icon: Icon, color, bg, border }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl ${bg} ${border} border backdrop-blur-sm`}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg bg-black/20 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-white/60`}>
                +12%
            </span>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-white/40 text-sm">{title}</div>
    </motion.div>
);

const StatusBadge = ({ status, onChange }) => {
    const styles = {
        NOUVEAU: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
        CONTACTE: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
        SIGNE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
        PERDU: 'bg-red-500/20 text-red-400 border-red-500/20',
    };

    const statusOptions = ['NOUVEAU', 'CONTACTE', 'SIGNE', 'PERDU'];

    return (
        <select
            value={status || 'NOUVEAU'}
            onChange={(e) => onChange(e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border bg-transparent cursor-pointer focus:outline-none ${styles[status] || styles.NOUVEAU} appearance-none`}
        >
            {statusOptions.map(opt => (
                <option key={opt} value={opt} className="bg-black text-white">{opt}</option>
            ))}
        </select>
    );
};

export default DashboardPage;
