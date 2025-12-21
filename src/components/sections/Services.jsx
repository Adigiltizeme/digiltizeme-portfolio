import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Gauge, Server, Terminal, ShieldCheck } from 'lucide-react';

const services = [
    {
        icon: Search,
        title: "Audit & Conseil CTO",
        desc: "Analyse d'architecture, choix technologiques et stratégie digitale pour startups."
    },
    {
        icon: BookOpen,
        title: "Formation & Mentoring",
        desc: "Programme sur-mesure : React, Node.js, Clean Code. Pour individus ou équipes."
    },
    {
        icon: Gauge,
        title: "Optimisation Perf",
        desc: "Core Web Vitals, chargement ultra-rapide et SEO technique avancé."
    },
    {
        icon: Server,
        title: "Backend & API",
        desc: "Architecture robuste, NestJS, Microservices et bases de données scalables."
    },
    {
        icon: ShieldCheck,
        title: "Code Review & QA",
        desc: "Audit de sécurité, mise en place de tests et standards de qualité (CI/CD)."
    },
    {
        icon: Terminal,
        title: "Automatisation",
        desc: "Scripts, Scrapping de données et workflows pour gagner du temps."
    }
];

const Services = () => {
    return (
        <section className="py-24 px-6 relative z-10 bg-black/40">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-2 bg-white/5 rounded-full text-orange-400 text-sm font-bold mb-4 border border-white/5"
                    >
                        ⚡ Au-delà du Code
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black mb-6"
                    >
                        Expertise 360° & Formation
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        Le développement n'est qu'une partie de l'équation. J'accompagne aussi vos équipes et optimise vos existants.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-3xl bg-urban-gray border border-white/5 hover:border-orange-500/50 hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors text-orange-500">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {service.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;
