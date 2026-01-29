import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Terminal,
    Cpu,
    Code2,
    ShieldCheck,
    Play,
    Plus,
    Search,
    MessageSquare,
    CheckCircle2,
    Clock,
    Zap,
    Layout,
    ShieldAlert,
    TrendingUp,
    FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ProjectSidebar from '../../components/admin/ProjectSidebar';
import { getApiUrl } from '../../components/utils/formHandler';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DevOMaxPage = () => {
    const { projectId, tab } = useParams();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [tasks, setTasks] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [activeTab, setActiveTab] = useState(tab || 'brief'); // brief, discussion, kanban, files, security, stats
    const [selectedFile, setSelectedFile] = useState(null);

    // Sync activeTab with URL param
    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);

    const handleTabChange = (newTab) => {
        if (projectId) {
            navigate(`/admin/dev-omax/${projectId}/${newTab}`);
        } else {
            setActiveTab(newTab);
        }
    };

    // Technical palette
    const colors = {
        bg: 'bg-[#05070a]',
        card: 'bg-white/5',
        border: 'border-white/10',
        accent: 'text-cyan-400',
        accentBg: 'bg-cyan-400/10',
        accentBorder: 'border-cyan-400/20'
    };

    useEffect(() => {
        if (projectId) {
            fetchProjectDetails();
            if (activeTab === 'kanban' || activeTab === 'stats') fetchTasks();
            if (activeTab === 'files' || activeTab === 'stats') fetchProposals();
        } else {
            fetchProjects();
        }
    }, [projectId, activeTab]);

    // Auto-refresh messages every 3 seconds when on discussion tab
    useEffect(() => {
        if (projectId && activeTab === 'discussion') {
            const interval = setInterval(() => {
                fetchProjectDetails(); // Refresh messages
            }, 3000); // 3 seconds

            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [projectId, activeTab]);

    const fetchProjectDetails = async () => {
        try {
            const API_URL = getApiUrl();
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/projects/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setProject(data);
            }
        } catch (error) {
            console.error('Error fetching project details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const API_URL = getApiUrl();
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/projects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const API_URL = getApiUrl();
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleToggleTask = async (taskId, currentStatus) => {
        const nextStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
        try {
            const API_URL = getApiUrl();
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/projects/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: nextStatus })
            });
            if (response.ok) {
                fetchTasks(); // Refresh
            }
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const fetchProposals = async () => {
        try {
            const API_URL = getApiUrl();
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/projects/${projectId}/files`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setProposals(data);
            }
        } catch (error) {
            console.error('Error fetching proposals:', error);
        }
    };

    const handleUpdateProposal = async (proposalId, status) => {
        try {
            const API_URL = getApiUrl();
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/projects/files/${proposalId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                setSelectedFile(null);
                fetchProposals();
            }
        } catch (error) {
            console.error('Error updating proposal:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        try {
            const API_URL = getApiUrl();
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/projects/${projectId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: message })
            });

            if (response.ok) {
                setMessage('');
                fetchProjectDetails(); // Reload thread
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // --- SUB-COMPONENTS ---

    const ProjectCard = ({ project }) => {
        // Calculate progress
        const totalTasks = project.tasks?.length || 0;
        const doneTasks = project.tasks?.filter(t => t.status === 'DONE').length || 0;
        const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (project.status === 'COMPLETED' ? 100 : 0);

        return (
            <Link
                to={`/admin/dev-omax/${project.id}`}
                className={`${colors.card} ${colors.border} border rounded-2xl p-6 hover:border-cyan-400/50 transition-all group relative overflow-hidden`}
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Terminal className="w-12 h-12" />
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${colors.accentBg} flex items-center justify-center`}>
                        <Cpu className={`w-5 h-5 ${colors.accent}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">{project.name}</h3>
                        <span className="text-xs text-white/40 font-mono">STATUS: {project.status}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Progress</span>
                        <span className={colors.accent}>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-white/30 font-mono">
                        <span>TASKS: {doneTasks}/{totalTasks}</span>
                        <span>AGENTS: {project.agents?.length || 0}</span>
                    </div>
                </div>
            </Link>
        );
    };

    const AgentCard = ({ agent }) => {
        // Dynamic thoughts based on status
        const thoughts = {
            IDLE: ["En veille...", "Scan des logs...", "Attente de directives..."],
            WORKING: ["Génération de code...", "Analyse contextuelle...", "Optimisation des requêtes..."],
            THINKING: ["Calcul de la meilleure approche...", "Consultation de la base de connaissances...", "Simulation de scénarios..."]
        };

        const randomThought = (status) => {
            const list = thoughts[status] || thoughts.IDLE;
            return list[Math.floor(Math.random() * list.length)];
        };

        return (
            <motion.div
                layout
                className={`${colors.card} ${colors.border} border rounded-2xl p-5 flex flex-col gap-4 relative group`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${agent.status === 'WORKING' ? 'border-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'border-white/10'}`}>
                        <img src={agent.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.role}`} alt={agent.name} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white uppercase tracking-tighter">{agent.name}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${agent.status === 'WORKING' ? 'bg-cyan-400/20 text-cyan-400' : 'bg-white/10 text-white/40'}`}>
                                {agent.status}
                            </span>
                        </div>
                        <p className="text-[10px] text-cyan-400/60 font-mono tracking-widest">{agent.role}</p>
                    </div>
                </div>

                <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-white/70 italic">"{randomThought(agent.status)}"</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setActiveTab('discussion');
                            document.querySelector('input[type="text"]')?.focus();
                        }}
                        className="flex-1 py-2 rounded-lg bg-cyan-400/10 text-cyan-400 text-[10px] font-bold uppercase hover:bg-cyan-400/20 transition-colors"
                    >
                        Discuter
                    </button>
                    <button className="px-3 py-2 rounded-lg bg-white/5 text-white/40 border border-white/10 hover:text-white transition-colors">
                        <Zap className="w-3 h-3" />
                    </button>
                </div>
            </motion.div>
        );
    };

    // --- RENDER ---

    if (projectId && project) {
        return (
            <div className={`min-h-screen ${colors.bg} text-white font-sans selection:bg-cyan-400/40 selection:text-white overflow-x-hidden`}>
                <ProjectSidebar projectId={projectId} projectName={project.name} />
                <main className="lg:ml-64 relative z-0 min-h-screen flex flex-col">
                    {/* Header Execution */}
                    <header className="p-8 border-b border-white/10 backdrop-blur-3xl sticky top-0 z-20 bg-black/40">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <Link to="/admin/dev-omax" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40">
                                    <Layout className="w-5 h-5" />
                                </Link>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-2 h-2 rounded-full ${project.status === 'DEVELOPMENT' ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]' : 'bg-white/20'}`} />
                                        <h1 className="text-2xl font-bold uppercase tracking-[0.2em]">{project.name}</h1>
                                    </div>
                                    <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">ID: {projectId} // MODE: {project.status}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
                                {['brief', 'discussion', 'kanban', 'files', 'security', 'stats'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => handleTabChange(t)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'bg-cyan-400 text-black shadow-[0_0_20px_#22d3ee]' : 'text-white/40 hover:text-white'}`}
                                    >
                                        {t === 'security' ? 'Cyber' : t === 'stats' ? 'KPIs' : t === 'brief' ? 'Brief' : t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </header>

                    {/* Content Execution */}
                    <div className="flex-1 p-8">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Left Panel: Workspace */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                <div className={`${colors.card} ${colors.border} border rounded-3xl h-[calc(100vh-9rem)] flex flex-col overflow-hidden relative shadow-2xl`}>
                                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                                        </div>
                                        <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">system_thread.log</span>
                                        <div className="w-10" />
                                    </div>
                                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                                        <AnimatePresence mode="wait">
                                            {activeTab === 'brief' && (
                                                <motion.div
                                                    key="brief"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="p-6 space-y-6"
                                                >
                                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                            <Terminal className="w-5 h-5 text-cyan-400" />
                                                            Cadrage Projet
                                                        </h3>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="text-[10px] uppercase text-white/40 mb-2 block tracking-widest">Objectif Client</label>
                                                                <p className="text-white/80 font-serif italic text-lg line-relaxed">"{project.lead?.goal || 'Non spécifié'}"</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase text-white/40 mb-2 block tracking-widest">Description Détaillée</label>
                                                                <div className="bg-black/20 p-4 rounded-xl text-sm text-white/60 leading-relaxed max-h-[200px] overflow-y-auto">
                                                                    {project.lead?.description || 'Aucune description disponible.'}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setMessage("Analyse ce projet et propose un plan d'action détaillé.");
                                                                    handleSendMessage();
                                                                    setActiveTab('discussion');
                                                                }}
                                                                className="w-full py-4 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all"
                                                            >
                                                                Lancer l'Analyse IA Dev'OMax
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {project.aiSummary && (
                                                        <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-2xl p-6">
                                                            <label className="text-[10px] uppercase text-cyan-400 mb-2 block tracking-widest font-bold">Résumé Stratégique (IA)</label>
                                                            <p className="text-white/80 text-sm italic">{project.aiSummary}</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}

                                            {activeTab === 'kanban' && (
                                                <motion.div
                                                    key="kanban"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="p-4 h-full"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
                                                        {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(col => (
                                                            <div key={col} className="bg-black/20 rounded-2xl p-3 flex flex-col gap-3 min-h-[500px]">
                                                                <div className="flex items-center justify-between px-2">
                                                                    <span className="text-[10px] font-bold uppercase tracking-tight text-white/40">{col}</span>
                                                                    <span className="bg-white/5 text-[9px] px-2 py-0.5 rounded-full text-white/60">
                                                                        {tasks.filter(t => t.status === col).length}
                                                                    </span>
                                                                </div>
                                                                <div className="flex-1 space-y-3">
                                                                    {tasks.filter(t => t.status === col).map(task => (
                                                                        <div
                                                                            key={task.id}
                                                                            onClick={() => handleToggleTask(task.id, task.status)}
                                                                            className="bg-white/5 border border-white/10 p-3 rounded-xl hover:border-cyan-400/30 cursor-pointer transition-all group"
                                                                        >
                                                                            <div className="flex items-center gap-1.5 mb-2">
                                                                                <div className={`w-1.5 h-1.5 rounded-full ${task.kind === 'DEV' ? 'bg-blue-400' :
                                                                                    task.kind === 'DESIGN' ? 'bg-pink-400' :
                                                                                        task.kind === 'QA' ? 'bg-yellow-400' : 'bg-cyan-400'
                                                                                    }`} />
                                                                                <span className="text-[9px] text-white/30 uppercase font-bold">{task.kind || 'GENERAL'}</span>
                                                                                {task.aiGenerated && <Zap className="w-2.5 h-2.5 text-yellow-400 animate-pulse" />}
                                                                            </div>
                                                                            <h4 className="text-xs font-bold text-white/90 group-hover:text-cyan-400 transition-colors">{task.title}</h4>
                                                                            {task.description && <p className="text-[10px] text-white/40 mt-1 line-clamp-2">{task.description}</p>}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'discussion' && (
                                                <motion.div
                                                    key="discussion"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="space-y-4"
                                                >
                                                    {project.messages?.length > 0 ? (
                                                        project.messages.map(msg => (
                                                            <div key={msg.id} className={`rounded-xl p-4 ${msg.type === 'SYSTEM'
                                                                ? 'bg-cyan-400/5 border border-cyan-400/20'
                                                                : 'bg-white/5 border border-white/10'
                                                                }`}>
                                                                {msg.agent && (
                                                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                                                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-400/40">
                                                                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${msg.agent.role}`} alt={msg.agent.name} />
                                                                        </div>
                                                                        <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider">{msg.agent.name}</span>
                                                                        <span className="text-white/30 text-[10px] font-mono">{msg.agent.role}</span>
                                                                    </div>
                                                                )}
                                                                <div className="prose prose-invert prose-sm max-w-none">
                                                                    <ReactMarkdown
                                                                        components={{
                                                                            p: ({ node, ...props }) => <p className="text-white/80 leading-relaxed mb-3 text-sm" {...props} />,
                                                                            code: ({ node, inline, ...props }) =>
                                                                                inline
                                                                                    ? <code className="bg-black/40 text-cyan-400 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                                                                                    : <code className="block bg-black/60 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto my-2" {...props} />,
                                                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside text-white/70 space-y-1 my-2" {...props} />,
                                                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-white/70 space-y-1 my-2" {...props} />,
                                                                            li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                                                                            strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                                                                            em: ({ node, ...props }) => <em className="text-cyan-400/80" {...props} />,
                                                                            h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mb-2 mt-4" {...props} />,
                                                                            h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-white mb-2 mt-3" {...props} />,
                                                                            h3: ({ node, ...props }) => <h3 className="text-base font-bold text-cyan-400 mb-2 mt-2" {...props} />,
                                                                        }}
                                                                    >
                                                                        {msg.content}
                                                                    </ReactMarkdown>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/20 gap-4">
                                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                                                                <MessageSquare className="w-8 h-8 opacity-50" />
                                                            </div>
                                                            <p className="text-sm font-mono tracking-widest text-center">INITIALISATION DU FLUX DE DONNÉES...</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}

                                            {activeTab === 'files' && (
                                                <motion.div
                                                    key="files"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="h-[600px] flex flex-col md:flex-row gap-6"
                                                >
                                                    <div className="w-full md:w-1/3 flex flex-col gap-2 overflow-y-auto pr-2">
                                                        {proposals.length > 0 ? proposals.map(file => (
                                                            <button
                                                                key={file.id}
                                                                onClick={() => setSelectedFile(file)}
                                                                className={`text-left p-3 rounded-xl border transition-all text-xs font-mono group flex items-center justify-between ${selectedFile?.id === file.id
                                                                    ? 'bg-cyan-400/10 border-cyan-400 text-cyan-400'
                                                                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-2 truncate">
                                                                    <FileCode className={`w-4 h-4 ${selectedFile?.id === file.id ? 'text-cyan-400' : 'text-white/40 group-hover:text-white'}`} />
                                                                    <span className="truncate">{file.path}</span>
                                                                </div>
                                                                <div className={`w-2 h-2 rounded-full ${file.status === 'APPROVED' ? 'bg-green-500' :
                                                                    file.status === 'REJECTED' ? 'bg-red-500' :
                                                                        'bg-yellow-500'
                                                                    }`} />
                                                            </button>
                                                        )) : (
                                                            <div className="flex flex-col items-center justify-center h-full text-white/20 gap-3 italic">
                                                                <FileCode className="w-8 h-8 opacity-20" />
                                                                <span className="text-xs">Aucun fichier généré.</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-inner">
                                                        {selectedFile ? (
                                                            <>
                                                                <div className="bg-[#2d2d2d] px-4 py-2 border-b border-white/5 flex justify-between items-center">
                                                                    <span className="text-xs text-white/60 font-mono">{selectedFile.path}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${selectedFile.status === 'APPROVED' ? 'text-green-400 bg-green-400/10' :
                                                                            selectedFile.status === 'REJECTED' ? 'text-red-400 bg-red-400/10' :
                                                                                'text-yellow-400 bg-yellow-400/10'
                                                                            }`}>{selectedFile.status}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 overflow-auto bg-[#1e1e1e]">
                                                                    <SyntaxHighlighter
                                                                        language={selectedFile.path.split('.').pop()}
                                                                        style={atomDark}
                                                                        customStyle={{
                                                                            margin: 0,
                                                                            padding: '24px',
                                                                            background: 'transparent',
                                                                            fontSize: '12px'
                                                                        }}
                                                                    >
                                                                        {selectedFile.content}
                                                                    </SyntaxHighlighter>
                                                                </div>
                                                                <div className="p-4 bg-black/40 border-t border-white/5 flex justify-end gap-3">
                                                                    {selectedFile.status === 'PENDING' && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleUpdateProposal(selectedFile.id, 'REJECTED')}
                                                                                className="px-4 py-2 rounded-lg bg-red-400/10 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-400 hover:text-white transition-all"
                                                                            >
                                                                                Rejeter
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleUpdateProposal(selectedFile.id, 'APPROVED')}
                                                                                className="px-4 py-2 rounded-lg bg-green-400 text-black text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all"
                                                                            >
                                                                                Valider & Appliquer
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center h-full text-white/10 gap-4">
                                                                <Terminal className="w-12 h-12 opacity-10" />
                                                                <span className="text-xs font-mono tracking-widest">SÉLECTIONNEZ UN FICHIER POUR ANALYSE</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'security' && (
                                                <motion.div
                                                    key="security"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="flex flex-col items-center justify-center h-full min-h-[500px] text-cyan-400 gap-6"
                                                >
                                                    <div className="relative">
                                                        <ShieldAlert className="w-20 h-20 animate-pulse opacity-50" />
                                                        <div className="absolute inset-0 bg-cyan-400 blur-3xl opacity-10" />
                                                    </div>
                                                    <div className="text-center">
                                                        <h3 className="text-lg font-bold uppercase tracking-widest mb-2 text-white">Sentinel & Cypher Protection</h3>
                                                        <p className="text-xs text-white/40 max-w-sm font-mono uppercase tracking-widest">Scanning codebase for vulnerabilities... 100% Secure.</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'stats' && (
                                                <motion.div
                                                    key="stats"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-8 h-full"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-cyan-400/30 transition-all">
                                                            <TrendingUp className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                                                            <h4 className="text-4xl font-bold text-white mb-2">{tasks.filter(t => t.status === 'DONE').length}</h4>
                                                            <p className="text-xs text-white/40 uppercase tracking-widest">Tâches Accomplies</p>
                                                        </div>
                                                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-green-400/30 transition-all">
                                                            <Zap className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                                                            <h4 className="text-4xl font-bold text-white mb-2">{proposals.filter(p => p.status === 'APPROVED').length}</h4>
                                                            <p className="text-xs text-white/40 uppercase tracking-widest">Fichiers Validés</p>
                                                        </div>
                                                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-yellow-400/30 transition-all">
                                                            <Clock className="w-8 h-8 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                                                            <h4 className="text-4xl font-bold text-white mb-2">{tasks.filter(t => t.status !== 'DONE').length}</h4>
                                                            <p className="text-xs text-white/40 uppercase tracking-widest">Points en Attente</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}                                        </AnimatePresence>
                                    </div>
                                    <div className="p-4 bg-black/40 border-t border-white/10">
                                        <div className="relative">
                                            <textarea
                                                placeholder="Envoyer une directive à l'équipe... (Shift+Enter pour nouvelle ligne)"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                }}
                                                rows={1}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-12 text-sm focus:outline-none focus:border-cyan-400/50 transition-all font-mono resize-none overflow-hidden"
                                                style={{
                                                    minHeight: '56px',
                                                    maxHeight: '200px',
                                                    height: message.split('\n').length > 1 ? `${Math.min(56 + (message.split('\n').length - 1) * 24, 200)}px` : '56px'
                                                }}
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                className="absolute right-3 top-4 w-8 h-8 rounded-lg bg-cyan-400 text-black flex items-center justify-center hover:scale-105 transition-transform"
                                            >
                                                <Play className="w-4 h-4 fill-current" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Team Mobilized */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400">Équipe Mobilisée</h3>
                                    <Plus className="w-4 h-4 text-white/20 hover:text-cyan-400 cursor-pointer" />
                                </div>
                                <div className="space-y-4">
                                    {project.agents?.map(agent => (
                                        <AgentCard key={agent.id} agent={agent} />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </main>


            </div >
        );
    }

    return (
        <div className={`min-h-screen ${colors.bg} text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden`}>
            <AdminSidebar />

            {/* Cyber Grid Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)]" />
                <div className="absolute inset-0 border-t border-white/[0.02] bg-grid-white/[0.02]" />
            </div>

            <main className="lg:ml-64 p-8 relative z-0 min-h-screen">
                <header className="mb-12 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Terminal className={`w-8 h-8 ${colors.accent}`} />
                            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Dev'OMax<span className="text-cyan-400">.</span></h1>
                        </div>
                        <p className="text-white/40 max-w-lg">Système d'exécution agentique sécurisé. Transformez vos leads en solutions technologiques haute performance.</p>
                    </div>

                    <Link to="/admin/dashboard" className="px-6 py-3 rounded-xl bg-cyan-400 text-black font-bold uppercase text-xs tracking-widest hover:shadow-[0_0_30px_#22d3ee] transition-all flex items-center gap-3 group">
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        Initialiser Projet
                    </Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
                        ))
                    ) : projects.length > 0 ? (
                        projects.map(project => <ProjectCard key={project.id} project={project} />)
                    ) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                            <div className={`w-16 h-16 ${colors.accentBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                <Terminal className={`w-8 h-8 ${colors.accent}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 uppercase tracking-widest">Aucun système actif</h3>
                            <p className="text-white/40 mb-8">Convertissez un lead en projet pour initier la mobilisation Dev'OMax.</p>
                            <Link to="/admin/dashboard" className="text-cyan-400 underline uppercase text-xs font-bold tracking-widest">Voir les prospects</Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DevOMaxPage;
