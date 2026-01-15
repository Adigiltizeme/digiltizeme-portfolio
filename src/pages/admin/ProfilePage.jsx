
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Save, ArrowLeft, Loader2, Trash2, LayoutDashboard, Users, Shield, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiUrl } from '../../components/utils/formHandler';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();

            const response = await fetch(`${API_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401 || response.status === 404) {
                console.warn('⚠️ Session invalide. Redirection vers login...');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                navigate('/admin/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setFormData(prev => ({ ...prev, email: data.email }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();

            const updatePayload = { email: formData.email };
            if (formData.password) updatePayload.password = formData.password;

            const response = await fetch(`${API_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatePayload)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                fetchProfile();
            } else {
                const err = await response.json();
                setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = getApiUrl();

            const response = await fetch(`${API_URL}/users/me`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                localStorage.clear();
                navigate('/admin/login');
            }
        } catch (error) {
            alert('Erreur lors de la suppression.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans p-8 lg:pl-[280px]">
            <div className="max-w-2xl mx-auto">
                <Link to="/admin/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Retour au Dashboard
                </Link>

                {/* Sidebar Navigation (Consistent with Dashboard) */}
                <div className="fixed top-0 left-0 w-64 h-full border-r border-white/10 bg-black/50 backdrop-blur-xl p-6 hidden lg:block z-40">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold">D</div>
                        <span className="font-bold text-lg">Digiltizème<span className="text-primary-500">.</span></span>
                    </div>

                    <div className="space-y-2">
                        <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                            <Users className="w-5 h-5" />
                            CRM Leads
                        </a>
                        <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                            <Shield className="w-5 h-5 text-primary-400" />
                            Gestion Admins
                        </Link>
                        <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium">
                            <User className="w-5 h-5" />
                            Mon Profil
                        </Link>
                    </div>

                    <div className="absolute bottom-8 left-6 w-[calc(100%-48px)]">
                        <button onClick={() => {
                            localStorage.removeItem('adminToken');
                            localStorage.removeItem('adminUser');
                            navigate('/admin/login');
                        }} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>

                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">Mon Profil</h1>
                    <p className="text-white/40">Gérez vos informations de connexion.</p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
                >
                    <form onSubmit={handleUpdate} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Email Administrateur</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500/50 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Nouveau mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        placeholder="Laisser vide pour ne pas changer"
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500/50 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Confirmer le mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary-500/50 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Enregistrer les modifications
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/10">
                        <h3 className="text-red-400 font-bold mb-2">Espace Danger</h3>
                        <p className="text-white/40 text-sm mb-6">La suppression de votre compte est définitive. Toutes vos données seront perdues.</p>
                        <button
                            onClick={handleDeleteAccount}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-3 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Supprimer mon compte
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
