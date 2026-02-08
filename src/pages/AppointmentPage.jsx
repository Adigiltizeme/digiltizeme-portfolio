import React from 'react';
import { Helmet } from 'react-helmet-async';
import AppointmentBooking from '../components/sections/AppointmentBooking';
import { Calendar, Clock, Video, CheckCircle } from 'lucide-react';

const AppointmentPage = () => {
    return (
        <>
            <Helmet>
                <title>Prendre Rendez-vous | Digiltizème</title>
                <meta
                    name="description"
                    content="Planifiez une consultation gratuite avec Digiltizème pour discuter de votre projet web, mobile ou SaaS."
                />
            </Helmet>

            <div className="min-h-screen bg-black text-white">
                {/* Header Section */}
                <section className="py-20 px-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-orange-200">
                            Parlons de Votre Projet
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-medium">
                            Rendez-vous <span className="text-orange-500 font-bold drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">gratuit et sans engagement</span>
                        </p>
                    </div>
                </section>

                {/* Appointment Booking Component */}
                <AppointmentBooking />

                {/* FAQ Section */}
                <section className="py-16 px-6 bg-urban-gray/20">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-3xl font-black mb-8 text-center">Questions Fréquentes</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 hover:border-orange-500/30 transition-all group">
                                <div className="flex items-start gap-4">
                                    <Clock className="text-orange-500 shrink-0 mt-1 group-hover:scale-110 transition-transform" size={24} />
                                    <div>
                                        <h4 className="font-bold mb-2 text-white">Combien de temps dure la consultation ?</h4>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            Le premier rendez-vous dure 30 minutes. C'est suffisant pour comprendre votre projet et vous proposer une première approche.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 hover:border-orange-500/30 transition-all group">
                                <div className="flex items-start gap-4">
                                    <Video className="text-orange-500 shrink-0 mt-1 group-hover:scale-110 transition-transform" size={24} />
                                    <div>
                                        <h4 className="font-bold mb-2 text-white">Comment se déroule le rendez-vous ?</h4>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            Visioconférence (Google Meet/Zoom) ou appel téléphonique selon votre préférence. Lien envoyé par email avant le RDV.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 hover:border-orange-500/30 transition-all group">
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="text-orange-500 shrink-0 mt-1 group-hover:scale-110 transition-transform" size={24} />
                                    <div>
                                        <h4 className="font-bold mb-2 text-white">Que dois-je préparer ?</h4>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            Rien d'obligatoire ! Mais si vous avez un brief, des maquettes ou un cahier des charges, c'est un plus.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 hover:border-orange-500/30 transition-all group">
                                <div className="flex items-start gap-4">
                                    <Calendar className="text-orange-500 shrink-0 mt-1 group-hover:scale-110 transition-transform" size={24} />
                                    <div>
                                        <h4 className="font-bold mb-2 text-white">Puis-je annuler ou reporter ?</h4>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            Oui, jusqu'à 24h avant le rendez-vous. Contactez-moi par email pour reporter à une autre date.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AppointmentPage;
