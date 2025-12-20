import React from 'react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ project, className }) => {
    return (
        <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            perspective={1000}
            scale={1.02}
            transitionSpeed={1500}
            className={`relative h-full ${className}`}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden group flex flex-col justify-end min-h-[400px] relative"
            >
                {/* Image Background */}
                {project.image && (
                    <div className="absolute inset-0">
                        <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                )}

                {/* Abstract Background Gradient (Fallback or Overlay) */}
                {!project.image && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 mix-blend-overlay`} />

                {/* Content */}
                <div className="relative z-10 pointer-events-none">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-mono text-orange-500 uppercase tracking-wider">{project.category}</span>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ArrowUpRight size={18} className="text-white" />
                        </div>
                    </div>

                    <h3 className="text-4xl font-bold mb-3 text-white leading-tight">{project.name}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">{project.description}</p>

                    {/* Tags/Badges */}
                    <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        {project.tags?.map(tag => (
                            <span key={tag} className="px-3 py-1 text-xs rounded-full border border-white/20 bg-white/5 text-gray-300">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </Tilt>
    );
};

export default ProjectCard;
