import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowUpRight } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/20 blur-[120px] rounded-full animate-blob cursor-none pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/10 blur-[100px] rounded-full cursor-none pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center"
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium mb-8 inline-block backdrop-blur-md text-gray-300"
                >
                    Applications Web & Mobile • Concepts Originaux • Formations
                </motion.span>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent leading-[1.1]">
                    DIGILTIZEME
                </h1>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent leading-[1.1]">
                    L'EXCELLENCE <br /> DIGITALE.
                </h1>

                <p className="max-w-xl mx-auto text-gray-400 text-lg md:text-xl mb-12 leading-relaxed">
                    Nous transformons vos projets en expériences interactives inoubliables.
                    <br />
                    <span className="text-white/60 text-sm mt-2 block">My Truck Transport • CheckAll Eat • O'Boricienne Burgers</span>
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <button
                        onClick={() => document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all duration-300 group shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]"
                    >
                        Démarrer un projet <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
                    </button>
                    <a href="https://wa.me/33616557039" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <MessageCircle size={20} />
                        <span>Discuter sur WhatsApp</span>
                    </a>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
