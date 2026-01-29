import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MessageSquare,
    CheckSquare,
    FileCode,
    ShieldAlert,
    ChevronLeft,
    TrendingUp,
    Settings,
    Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectSidebar = ({ projectId, projectName }) => {
    const location = useLocation();

    const menuItems = [
        {
            id: 'brief',
            label: 'Cadrage & Briefing',
            icon: Cpu,
            path: `/admin/dev-omax/${projectId}/brief`
        },
        {
            id: 'discussion',
            label: 'Flux Discussion',
            icon: MessageSquare,
            path: `/admin/dev-omax/${projectId}/discussion`
        },
        {
            id: 'kanban',
            label: 'Production Kanban',
            icon: CheckSquare,
            path: `/admin/dev-omax/${projectId}/kanban`
        },
        {
            id: 'files',
            label: 'Explorateur Fichiers',
            icon: FileCode,
            path: `/admin/dev-omax/${projectId}/files`
        },
        {
            id: 'security',
            label: 'Sécurité (Cypher)',
            icon: ShieldAlert,
            path: `/admin/dev-omax/${projectId}/security`
        },
        {
            id: 'stats',
            label: 'KPIs & Performance',
            icon: TrendingUp,
            path: `/admin/dev-omax/${projectId}/stats`
        }
    ];

    return (
        <nav className="fixed top-0 left-0 w-64 h-full border-r border-cyan-400/20 bg-[#05070a] p-6 hidden lg:flex flex-col z-40 shadow-[R-20px_0_40px_rgba(0,0,0,0.5)]">
            {/* Project Branding */}
            <div className="mb-12">
                <Link to="/admin/dev-omax" className="flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-colors mb-6 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Retour au Hub</span>
                </Link>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-400/10 border border-cyan-400/20 rounded-xl flex items-center justify-center">
                        <span className="font-bold text-cyan-400">P</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h2 className="font-black text-white uppercase text-xs truncate tracking-tighter">{projectName || 'Projet Actif'}</h2>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-[8px] text-cyan-400/60 font-mono tracking-widest uppercase">SYSTÈME OK</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="flex-grow space-y-2">
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] mb-4 ml-4">Workspace</p>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`} />
                            <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeGlow"
                                    className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Footer Settings */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest group">
                    <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Configuration
                </button>
            </div>

            {/* Cyber Aura Decor */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-400/5 to-transparent pointer-events-none" />
        </nav>
    );
};

export default ProjectSidebar;
