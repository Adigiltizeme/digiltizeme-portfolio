import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, Smartphone, Monitor, Globe, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetail = ({ project }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!project) return null;

    return (
        <div className="flex flex-col lg:flex-row min-h-[600px] relative">

            {/* Zoom Overlay - Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
                        >
                            <X size={32} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            src={selectedImage}
                            alt="Zoom"
                            className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl select-none"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Column: Visuals */}
            <div className="lg:w-7/12 bg-black/30 p-8 flex flex-col gap-6">
                {/* Main Media (Video or Image) */}
                <div
                    className="rounded-2xl overflow-hidden border border-white/5 shadow-lg relative group"
                    onClick={() => !project.video && setSelectedImage(project.image)} // Only zoom if image
                >
                    {project.video ? (
                        <video
                            src={project.video}
                            controls
                            className="w-full h-auto object-cover"
                            loop
                            muted
                            autoPlay
                        />
                    ) : (
                        <>
                            <img
                                src={project.image}
                                alt={project.name}
                                className="w-full h-auto object-cover cursor-zoom-in"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold flex items-center gap-2 border border-white/10">
                                    <ZoomIn size={16} /> Agrandir
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Secondary Screenshots */}
                {project.gallery && (
                    <div className="grid grid-cols-2 gap-4">
                        {project.gallery.map((img, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl overflow-hidden border border-white/5 h-48 cursor-zoom-in relative group"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Detail" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <ZoomIn size={24} className="opacity-0 group-hover:opacity-100 text-white transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Info & Action */}
            <div className="lg:w-5/12 p-10 flex flex-col relative bg-gradient-to-br from-urban-gray to-black">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-4xl font-black mb-2 leading-tight">{project.name}</h2>
                    <p className={`text-transparent bg-clip-text bg-gradient-to-r ${project.color} font-bold text-xl`}>
                        {project.category}
                    </p>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    {project.description}
                </p>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                    <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider">Fonctionnalités Clés</h3>
                    <ul className="space-y-3">
                        {project.features?.map(feat => (
                            <li key={feat} className="flex items-start gap-3 text-gray-300">
                                <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                <span>{feat}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tech Stack */}
                <div className="mb-8">
                    <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-sm text-gray-400">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Contributors Section */}
                {project.contributors && (
                    <div className="mb-12">
                        <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">Équipe / Contributeurs</h3>
                        <div className="flex flex-wrap gap-4">
                            {project.contributors.map((contrib, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                                        {contrib.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white leading-none">{contrib.name}</span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">{contrib.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-auto">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all duration-300 group"
                        >
                            <Globe size={20} />
                            Visiter le site Live
                            <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
                        </a>
                    )}
                    <div className="mt-4 text-center">
                        <button className="text-sm text-gray-500 hover:text-white transition-colors">
                            Demander un devis similaire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
