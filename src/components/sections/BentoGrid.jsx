import React, { useState } from 'react';
import ProjectCard from '../ui/ProjectCard';
import Modal from '../ui/Modal';
import ProjectDetail from './ProjectDetail';

const projects = [
    {
        name: "My Truck Transport",
        category: "Desktop / Web / Mobile Apps & SaaS",
        color: "from-orange-500 to-red-600",
        description: "Solution complète de gestion logistique utilisée en production. Dashboard Admin puissant, Communication temps réel et Suivi de flotte.",
        tags: ["Electron", "React/NestJS", "PostGreSQL", "Real-time Messaging & Tracking", "Mapbox", "WebSocket"],
        features: [
            "Dashboard Admin Temps Réel (Vue Satellite)",
            "Messagerie instantanée Chauffeur <-> Admin",
            "Génération automatique des bordereaux de livraison",
            "Mode Déconnecté (Sync automatique)"
        ],
        className: "md:col-span-8",
        image: "/projects/mytruck_hero.png",
        gallery: [
            "/projects/mytruck_dashboard_privacy.png",
            "/projects/mytruck_map_raw.png",
            "/projects/mytruck_drivers_privacy.png",
            "/projects/mytruck_features.png"
        ],
        liveUrl: "https://mytruck-transport.vercel.app/"
    },
    {
        name: "Semwee",
        category: "Web Marketing & SaaS",
        color: "from-pink-500 to-rose-600",
        description: "Application de web marketing avec outil d'étude de marché intégré. Développeur Frontend Full Remote (5 mois).",
        tags: ["Angular", "TypeScript", "Node/Express", "MongoDB", "Trello", "Git"],
        features: [
            "Création de nouvelles fonctionnalités et refonte",
            "Gestion de projet",
            "Formation des nouveaux stagiaires à l'environnement de développement, git, Trello, etc.",
            "Gestion serveur et base de données"
        ],
        className: "md:col-span-4",
        image: "/projects/semwee.png"
    },
    {
        name: "O'Boricienne Burgers",
        category: "Web / Mobile Apps & FoodTech",
        color: "from-yellow-400 to-orange-600",
        description: "L'expérience de commande ultime. 3 clics pour manger, un programme de fidélité addictif et une identité de marque forte.",
        tags: ["NextJS", "PWA", "Gamification"],
        features: [
            "Commande ultra-rapide en 3 étapes",
            "Programme fidélité 'Adventure' (Badges & Niveaux)",
            "Suivi de commande GPS type 'Uber Eats'",
            "Design 'Dark Mode' immersif"
        ],
        className: "md:col-span-4",
        image: "/projects/oboricienne_hero.png",
        gallery: ["/projects/oboricienne_hits.png"],
        liveUrl: "https://oboricienne-burger.vercel.app/"
    },
    {
        name: "CheckAll Eat",
        category: "Mobile App / FoodTech & Delivery",
        color: "from-emerald-400 to-cyan-500",
        description: "L'avenir de la livraison avec suivi live.",
        tags: ["React Native", "Geolocation", "UX/UI"],
        features: [
            "Géolocalisation haute précision",
            "Algorithme de matching livreur/resto",
            "Paiement in-app sécurisé"
        ],
        className: "md:col-span-6",
        image: "/projects/checkalleat.png"
    },
    {
        name: "Finded",
        category: "Marketplace & Social",
        color: "from-purple-500 to-indigo-600",
        description: "Plateforme de mise en relation clients / prestataires. Géolocalisation, messagerie temps réel et gestion de profil avancée.",
        tags: ["React Native", "Node.js", "Socket.io", "MongoDB"],
        features: [
            "Recherche de prestataires géolocalisée (Map)",
            "Chat en temps réel (Socket.io)",
            "Système de notation et avis",
            "Authentification sécurisée (JWT)"
        ],
        className: "md:col-span-6",
        video: "/projects/finded_demo.mp4",
        contributors: [
            { name: "Benjamin D'ONOFRIO", role: "Dev Fullstack" },
            { name: "Santiago TONOLI", role: "Dev Frontend" },
            { name: "Hadama SAMASSA", role: "Dev Fullstack" },
            { name: "Léo BACCIALONE", role: "Lead Dev / Dev Fullstack" }
        ],
        image: "/projects/finded_preview.png"
    }
];

const BentoGrid = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <section id="projects" className="max-w-7xl mx-auto px-6 py-24 relative z-20">
            <div className="mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Nos Réalisations</h2>
                <p className="text-gray-400 max-w-2xl">
                    Cliquez sur un projet pour découvrir l'envers du décor : stack technique, défis relevés et résultats.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[450px]">
                {projects.map((project, index) => (
                    <div key={project.name} onClick={() => setSelectedProject(project)} className={`${project.className} cursor - pointer`}>
                        <ProjectCard
                            project={project}
                            className="h-full"
                        />
                    </div>
                ))}
            </div>

            <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)}>
                <ProjectDetail project={selectedProject} />
            </Modal>
        </section>
    );
};

export default BentoGrid;
