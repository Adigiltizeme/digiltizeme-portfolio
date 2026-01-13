
/**
 * Generates a Markdown string compatible with Markmap (mind map)
 * based on the lead data.
 */
export const generateMarkmap = (lead) => {
    const dateStr = new Date(lead.createdAt).toLocaleDateString();

    let md = `---
markmap:
  colorFreezeLevel: 2
---

# ${lead.company || lead.name} - ${lead.projectType || 'Projet'}
## 👤 Client
- **Nom:** ${lead.name}
- **Email:** ${lead.email}
- **Tél:** ${lead.phone}
- **Reçu le:** ${dateStr}

## 🎯 Vision
- **Objectif:** ${lead.goal || 'Non spécifié'}
- **Type:** ${lead.projectType || 'Non spécifié'}
- **Source:** ${lead.source || 'Non spécifié'}

## 📝 Description
- ${lead.description ? lead.description.replace(/\n/g, '\n- ') : 'Aucune description fournie.'}

## ⚙️ Technique
- **Volume:** ${lead.pageVolume || 'N/A'}
- **Contenu Prêt:** ${lead.contentReady === 'yes' ? '✅ Oui' :
            lead.contentReady === 'partial' ? '⚠️ Partiel' : '❌ Non'
        }
- **Aide requise:** ${lead.needHelp || 'N/A'}

## 💰 Budget & Délais
- **Budget:** ${lead.budget || 'N/A'}
- **Deadline:** ${lead.deadline || 'N/A'}
`;

    // Add extra details if they exist in the JSON field
    if (lead.details && Object.keys(lead.details).length > 0) {
        md += `\n## 🔧 Questionnaire (Extras)\n`;
        for (const [key, value] of Object.entries(lead.details)) {
            if (value === null || value === undefined) continue;
            const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
            md += `- **${label}:** ${value}\n`;
        }
    }

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
