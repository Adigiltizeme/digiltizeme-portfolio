import React from 'react';
import { Mail, MessageCircle, Phone, Calendar } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="relative bg-urban-gray border-t border-white/10 py-24 px-6 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                    PRÊT À <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">PASSER AU NIVEAU SUPÉRIEUR</span> ?
                </h2>
                <p className="text-gray-400 text-xl mb-12">
                    Devis gratuit • Tarifs concurrentiels • Facilités de paiement
                    <br />
                    <span className="text-sm mt-2 block opacity-60">Réponse garantie sous 24h.</span>
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    <a href="https://wa.me/33600000000" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all group">
                        <MessageCircle className="mb-3 text-green-500" size={32} />
                        <span className="font-bold">WhatsApp</span>
                    </a>
                    <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group">
                        <Calendar className="mb-3 text-blue-500" size={32} />
                        <span className="font-bold">RDV (Calendly)</span>
                    </a>
                    <a href="mailto:contact@elite-portfolio.com" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all group">
                        <Mail className="mb-3 text-purple-500" size={32} />
                        <span className="font-bold">Email</span>
                    </a>
                    <a href="tel:+33600000000" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/50 transition-all group">
                        <Phone className="mb-3 text-orange-500" size={32} />
                        <span className="font-bold">Appel</span>
                    </a>
                </div>

                <div className="mt-24 text-gray-600 text-sm">
                    © {new Date().getFullYear()} Digiltizème Portfolio. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
