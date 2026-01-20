import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Shield,
    User,
    LogOut,
    Menu,
    X,
    Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const navItems = [
        {
            label: 'Dashboard',
            path: '/admin/dashboard',
            icon: LayoutDashboard
        },
        {
            label: "Dev'OMax",
            path: '/admin/dev-omax',
            icon: Terminal
        },
        {
            label: 'Gestion Admins',
            path: '/admin/users',
            icon: Shield,
            primary: true
        },
        {
            label: 'Mon Profil',
            path: '/admin/profile',
            icon: User
        },
    ];

    const SidebarContent = () => (
        <>
            <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold">D</div>
                <span className="font-bold text-lg text-white">
                    Digiltizème<span className="text-primary-500">.</span>
                </span>
            </div>

            <div className="space-y-2 flex-grow">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-white/10 text-white font-medium'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive && item.primary ? 'text-primary-400' : ''}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold">D</div>
                    <span className="font-bold text-lg text-white">Digiltizème.</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <nav className="fixed top-0 left-0 w-64 h-full border-r border-white/10 bg-black/50 backdrop-blur-xl p-6 hidden lg:flex flex-col z-40">
                <SidebarContent />
            </nav>

            {/* Mobile Bottom Padding (to avoid overlapping content) */}
            <div className="lg:hidden h-16" />

            {/* Mobile Overlay Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.nav
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-72 h-full bg-zinc-900 border-r border-white/10 p-6 z-50 lg:hidden flex flex-col"
                        >
                            <SidebarContent />
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminSidebar;
