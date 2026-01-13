
/**
 * Generates a Markdown string compatible with Markmap (mind map)
 * based on the lead data.
 */
export const generateMarkmap = (lead) => {
    const dateStr = new Date(lead.createdAt).toLocaleDateString();
    const companyName = lead.company || lead.name;
    const projectType = lead.projectType || 'Solution Numérique';

    let md = `---
markmap:
  colorFreezeLevel: 3
---

# 🚀 PROPOSITION : ${companyName}
## 📂 1. Synthèse du Projet
- **Type:** ${projectType}
- **Client:** ${lead.name} (${lead.email})
- **Objectif Principal:** ${lead.goal || 'Transformation Digitale'}
- **Date d'Audit:** ${dateStr}

## 🎯 2. Analyse Stratégique (Vision)
- **Problématique:** ${lead.description ? lead.description.substring(0, 100) + '...' : 'Optimisation de la présence en ligne'}
- **Objectifs de Valeur:**
  - Amélioration de la visibilité
  - Acquisition de nouveaux clients
  - Automatisation des processus
- **Source du Lead:** ${lead.source || 'Direct'}

## 🏗️ 3. Spécifications Techniques (Cahier des Charges)
- **Architecture Recommandée:**
  - Framework: ${projectType === 'webapp' ? 'React / NestJS' : 'React / Vite'}
  - Base de données: PostgreSQL (Prisma)
  - Hébergement: Cloud (Vercel/Railway)
- **Périmètre:**
  - Volume: ${lead.pageVolume || 'À définir'}
  - Complexité: ${lead.needHelp ? 'Accompagnement complet' : 'Exécution technique'}
- **Contenu & Assets:**
  - État: ${lead.contentReady === 'yes' ? 'Prêt' : 'À produire'}

## ⚙️ 4. Fonctionnalités Clés
- **Core Business Logic:**
  - Interface Utilisateur Premium
  - SEO Technique Optimisé
  - Responsive Design (Mobile First)
- **Backend & Data:**
  - Gestion des données sécurisée
  - API REST Performance`;

    // Add questionnaire details as functional requirements
    if (lead.details && Object.keys(lead.details).length > 0) {
        md += `\n- **Besoins Spécifiques (Questionnaire):**\n`;
        for (const [key, value] of Object.entries(lead.details)) {
            if (value === null || value === undefined) continue;
            const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
            md += `  - ${label}: ${value}\n`;
        }
    }

    md += `
## 📅 5. Plan d'Exécution (Phases)
- **Phase 1: Audit & UX Design (1-2 semaines)**
  - Wireframes & Maquettes
  - Validation du parcours utilisateur
- **Phase 2: Développement Fullstack (3-6 semaines)**
  - Setup environnement
  - Codage des fonctionnalités prioritaires
- **Phase 3: Tests & Déploiement (1 semaine)**
  - QA & Correction de bugs
  - Mise en production

## 💰 6. Budget & Investissement
- **Estimation Budget:** ${lead.budget || 'Sur devis'}
- **Délai Souhaité:** ${lead.deadline || 'À définir'}
- **Livrables:**
  - Code Source (GitHub)
  - Documentation technique
  - Formation utilisation
`;

    return md;
};

/**
 * Utility to trigger the download of the .md file
 */
export const downloadMarkmap = (lead) => {
    const content = generateMarkmap(lead);
    const fileName = `MindMap_${lead.company || lead.name.replace(/\s+/g, '_')}_${lead.id.substring(0, 5)}.md`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
