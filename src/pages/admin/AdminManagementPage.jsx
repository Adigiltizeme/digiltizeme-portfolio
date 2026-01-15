import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    UserPlus,
    Trash2,
    ArrowLeft,
    Mail,
    Lock,
    LayoutDashboard,
    Users,
    LogOut,
    Loader2,
    User,
    Shield,
    MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../../components/utils/formHandler';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminManagementPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();
            const response = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                navigate('/admin/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                setError('Impossible de charger les utilisateurs.');
            }
        } catch (err) {
            setError('Erreur réseau.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                setShowAddModal(false);
                setNewUser({ email: '', password: '' });
                fetchUsers();
            } else {
                const data = await response.json();
                setError(data.message || 'Erreur lors de la création.');
            }
        } catch (err) {
            setError('Erreur réseau.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        const currentUser = JSON.parse(localStorage.getItem('adminUser'));
        if (currentUser?.id === id) {
            alert('Vous ne pouvez pas supprimer votre propre compte ici. Allez dans "Mon Profil" pour cela.');
            return;
        }

        if (!window.confirm('Supprimer cet administrateur ?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (err) {
            setError('Erreur lors de la suppression.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary-500/30">
            <AdminSidebar />

            <main className="lg:ml-64 p-8 relative z-0">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Gestion des Administrateurs</h1>
                        <p className="text-white/40 mt-1">Gérez les accès à votre plateforme.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20"
                    >
                        <UserPlus className="w-5 h-5" />
                        Ajouter un Admin
                    </button>
                </header>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                        {error}
                    </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-white/60 text-sm uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Utilisateur</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date création</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-white/40">Aucun utilisateur trouvé.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white/60 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 group-hover:text-primary-400 transition-colors">
                                                        {user.email[0].toUpperCase()}
                                                    </div>
                                                    <div className="font-medium">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                                                    Actif
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white/60">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                                                >
                                                    <Trash2 className="w-5 h-5" />
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

            {/* Add User Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-6">Nouvel Admin</h2>
                            <form onSubmit={handleCreateUser} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                        <input
                                            type="email"
                                            required
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500/50 transition-colors"
                                            placeholder="admin@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Mot de passe provisoire</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                        <input
                                            type="password"
                                            required
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500/50 transition-colors"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <p className="text-xs text-white/30 mt-2">L'utilisateur pourra le changer depuis son profil.</p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-6 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="flex-1 px-6 py-4 rounded-xl bg-primary-500 hover:bg-primary-600 font-bold text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer l'accès"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminManagementPage;
