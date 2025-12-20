import React from 'react';
import { CreditCard, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

const features = [
    {
        icon: RefreshCw,
        title: "Méthode Agile & Transparente",
        desc: "Nous avançons par itérations de 2 semaines. Vous validez chaque étape. Pas d'effet tunnel, pas de mauvaises surprises."
    },
    {
        icon: CreditCard,
        title: "Facilités de Paiement",
        desc: "Nous croyons en votre croissance. Profitez de nos offres de paiement échelonné en 3x ou 4x sans frais pour lancer votre projet sans trésorerie lourde."
    },
    {
        icon: ShieldCheck,
        title: "Maintenance & Garantie",
        desc: "Votre app est garantie 3 mois après la livraison. Nous assurons les mises à jour de sécurité et le monitoring 24/7."
    },
    {
        icon: Zap,
        title: "Livraison Ultra-Rapide",
        desc: "Grâce à notre stack optimisée (Next.js / React Native / Electron...), nous livrons des MVP fonctionnels en moins de 4 semaines."
    }
];

const Methodology = ({ onOpenFinancing }) => {
    return (
        <section className="py-24 px-6 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text */}
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black mb-6">
                            L'Excellence Technique, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                La Flexibilité en Plus.
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Nous ne sommes pas juste des développeurs. Nous sommes des partenaires de votre croissance.
                            Notre méthodologie est conçue pour réduire vos risques et maximiser votre ROI.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 shrink-0 text-cyan-400">
                                        <feature.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                                        <p className="text-sm text-gray-400 leading-snug">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visual/Card */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-[100px] opacity-20" />
                        <div className="relative bg-urban-gray border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                                <div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Budget Moyen Projet</div>
                                    <div className="text-3xl font-bold text-white">5 000€ - 25 000€</div>
                                </div>
                                <div className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-bold border border-green-500/20">
                                    ROI ÉLEVÉ
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Sprint 1 : Design & Maquettes</span>
                                    <span className="text-white">J+7</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-full bg-cyan-500" />
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Sprint 2 : Développement MVP</span>
                                    <span className="text-white">J+21</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[70%] bg-cyan-500" />
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Sprint 3 : Tests & Livraison</span>
                                    <span className="text-white">J+30</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[30%] bg-cyan-500" />
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                <p className="text-sm text-gray-400 mb-4">Besoin d'étaler le paiement ?</p>
                                <button
                                    onClick={onOpenFinancing}
                                    className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors"
                                >
                                    Voir nos offres de financement (Jusqu'à 10x)
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Methodology;
