import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Code2, Rocket, Users } from 'lucide-react';

const Director = () => {
    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Logo Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative flex items-center justify-center group"
                    >
                        <div className="aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-purple-500/20 to-orange-500/20 flex items-center justify-center p-8 backdrop-blur-sm group-hover:border-orange-500/30 transition-colors duration-500">
                            {/* Logo Digiltizème */}
                            <img
                                src="/images/digiltizeme_logo_mono.png"
                                alt="Digiltizème Logo"
                                className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    </motion.div>

                    {/* Right: Bio */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-purple-400 text-sm font-bold mb-6 border border-white/5">
                            <Users size={16} /> Le Directeur
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            Hadama <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">SAMASSA</span>
                        </h2>

                        <p className="text-xl text-gray-300 mb-6 font-medium">
                            Développeur Full-Stack & Entrepreneur Tech
                        </p>

                        <p className="text-gray-400 leading-relaxed mb-8">
                            Passionné par la création de solutions digitales innovantes, je dirige Digiltizème avec une vision claire :
                            transformer vos idées en produits performants. Façonnant une forte expérience en développement web et mobile,
                            je m'engage personnellement sur chaque projet pour garantir qualité, rapidité et satisfaction client.
                        </p>

                        {/* Skills/Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                                <Code2 className="mx-auto mb-2 text-orange-400" size={24} />
                                <div className="text-2xl font-black text-white">3+</div>
                                <div className="text-xs text-gray-500 uppercase">Ans d'XP</div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                                <Rocket className="mx-auto mb-2 text-cyan-400" size={24} />
                                <div className="text-2xl font-black text-white">20+</div>
                                <div className="text-xs text-gray-500 uppercase">Projets</div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                                <Users className="mx-auto mb-2 text-green-400" size={24} />
                                <div className="text-2xl font-black text-white">++</div>
                                <div className="text-xs text-gray-500 uppercase">Satisfaction</div>
                            </div>
                        </div>

                        {/* LinkedIn CTA */}
                        <a
                            href="https://www.linkedin.com/in/hadama-samassa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white font-bold rounded-xl transition-all duration-300 group shadow-lg hover:shadow-[#0A66C2]/30"
                        >
                            <Linkedin size={20} />
                            Voir mon profil LinkedIn
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Director;
