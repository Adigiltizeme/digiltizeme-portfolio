import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, CreditCard, Calendar } from 'lucide-react';

const FinancingModal = ({ isOpen, onClose, initialBudget = 10000 }) => {
    const [budget, setBudget] = useState(initialBudget);

    if (!isOpen) return null;

    // Pricing Logic
    const plans = [
        {
            id: 'cash',
            icon: Zap,
            title: "Comptant (Flash)",
            desc: "L'option la plus économique.",
            discount: "-5%",
            markup: 0.95,
            months: 1,
            color: "from-green-400 to-emerald-600",
            bestFor: "ROI Immédiat"
        },
        {
            id: 'standard',
            icon: CreditCard,
            title: "Standard (3x)",
            desc: "L'équilibre parfait. Sans frais.",
            discount: "0%",
            markup: 1,
            months: 3,
            color: "from-blue-400 to-cyan-600",
            bestFor: "Trésorerie Saine"
        },
        {
            id: 'long',
            icon: Calendar,
            title: "Croissance (10x)",
            desc: "Investissez maintenant, payez plus tard.",
            discount: "+15% (Service)",
            markup: 1.15,
            months: 10,
            color: "from-purple-400 to-pink-600",
            bestFor: "Startup / Scale-up"
        }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    className="relative bg-urban-gray border border-white/10 w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex justify-between items-center relative overflow-hidden shrink-0">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600" />
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black mb-1">Simulateur de Financement</h2>
                            <p className="text-gray-400 text-sm md:text-base">Trouvez la formule adaptée à votre ambition.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 overflow-y-auto">
                        {/* Budget Slider */}
                        <div className="mb-12 text-center">
                            <label className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-4 block">Montant Estimé du Projet</label>
                            <div className="text-4xl md:text-5xl font-black text-white mb-6 font-inter">
                                {budget.toLocaleString('fr-FR')} €
                            </div>
                            <input
                                type="range"
                                min="3000"
                                max="50000"
                                step="500"
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                                <span>3 000 €</span>
                                <span>50 000 €</span>
                            </div>
                        </div>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map(plan => {
                                const total = budget * plan.markup;
                                const monthly = total / plan.months;
                                const Icon = plan.icon;

                                return (
                                    <div key={plan.id} className="relative group rounded-2xl border border-white/10 bg-black/20 p-6 hover:bg-white/5 transition-all hover:-translate-y-1">
                                        {plan.id === 'cash' && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-black text-xs font-bold rounded-full">
                                                MEILLEUR PRIX
                                            </div>
                                        )}
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                                        <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{plan.desc}</p>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Total :</span>
                                                <span className={plan.id === 'cash' ? 'text-green-400 font-bold' : 'text-gray-300'}>
                                                    {total.toLocaleString('fr-FR')} €
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Mensualités :</span>
                                                <span className="text-white font-bold">
                                                    {plan.months}x {monthly.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                                                </span>
                                            </div>
                                        </div>

                                        <button className="w-full py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all font-bold text-sm">
                                            Choisir cette offre
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Footer Notice */}
                    <div className="p-6 bg-black/20 border-t border-white/5 text-center shrink-0">
                        <p className="text-xs text-gray-500">
                            *Le financement 10x est soumis à l'acceptation du dossier par nos soins.
                            Un acompte de 30% est requis au démarrage pour les offres standards.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FinancingModal;
