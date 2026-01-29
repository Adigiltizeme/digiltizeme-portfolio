import React from 'react';
import { GraduationCap, Users, Code } from 'lucide-react';

const trainings = [
    {
        title: "Formateur en programmation informatique",
        organization: "Cymalabs - Free-lance Full remote",
        period: "Octobre 2022 - novembre 2024",
        description: "Formations d'apprenants d'écoles supérieures ainsi que des professionnels d'entreprises",
        topics: [
            "Développement web fullstack",
            "Gestion de bases de données relationnelles (SQL) et non relationnelles (MongoDB)",
            "Modélisation des données (Data Modeling), structures des données",
            "UML",
            "Programmation Orientée Objet",
            "C#/Unity (avec création d'un jeu vidéo), Java"
        ],
        color: "from-blue-500 to-cyan-500"
    }
];

const Trainings = () => {
    return (
        <section id="formations" className="max-w-7xl mx-auto px-6 py-24 relative z-20">
            <div className="mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Formations Dispensées</h2>
                <p className="text-gray-400 max-w-2xl">
                    Transmission de compétences techniques à des apprenants et professionnels.
                </p>
            </div>

            <div className="space-y-6">
                {trainings.map((training, index) => (
                    <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-start gap-6">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${training.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">{training.title}</h3>
                                <p className="text-cyan-400 font-medium mb-1">{training.organization}</p>
                                <p className="text-gray-400 text-sm mb-4">{training.period}</p>

                                <p className="text-gray-300 mb-6">{training.description}</p>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                        <Code className="w-4 h-4" />
                                        <span className="font-semibold">Technologies & Compétences enseignées :</span>
                                    </div>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {training.topics.map((topic, i) => (
                                            <li key={i} className="flex items-center gap-2 text-gray-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                                <span>{topic}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Trainings;
