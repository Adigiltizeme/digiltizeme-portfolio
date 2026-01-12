import emailjs from '@emailjs/browser';

// CONFIGURATION
// Keys are loaded from .env file for security
// See .env.example for required variables
const EMAILJS_CONFIG = {
    SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    TEMPLATE_ID_CONTACT: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT,
    TEMPLATE_ID_PLAN: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_PLAN,
    PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};

/**
 * Formats the form data into a readable string for emails/logs
 */
export const formatFormData = (data, title = "Nouveau Lead") => {
    let formattedText = `=== ${title} ===\n\n`;
    const date = new Date().toLocaleString("fr-FR");
    formattedText += `Date: ${date}\n`;

    // Group fields if possible or list them
    for (const [key, value] of Object.entries(data)) {
        // Capitalize key and replace underscores
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
        formattedText += `${label}: ${value}\n`;
    }

    return formattedText;
};

/**
 * Handles the form submission (EmailJS + Console Log fallback)
 */
export const submitLead = async (formType, data) => {
    const templateId = formType === 'contact'
        ? EMAILJS_CONFIG.TEMPLATE_ID_CONTACT
        : EMAILJS_CONFIG.TEMPLATE_ID_PLAN;

    const formattedMessage = formatFormData(data, formType === 'contact' ? 'Contact Rapide' : 'Questionnaire Detaillé');

    console.log("🚀 [Simulation] Sending Data to Digiltizème:", data);

    // 1. 🚀 Send to NestJS Backend (First Priority)
    try {
        const response = await fetch('http://localhost:4000/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`⚠️ Backend returned ${response.status}:`, errorText);
            throw new Error(`Server error: ${response.status}`);
        }

        const savedLead = await response.json();
        console.log("✅ Lead saved to NestJS Database:", savedLead.id);
    } catch (dbError) {
        console.error("⚠️ Failed to save to Database:", dbError);
        throw dbError; // Re-throw to show error to user
    }

    // 2. EmailJS (Secondary / Notification)
    // If config is missing, return success simulation
    if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || !EMAILJS_CONFIG.PUBLIC_KEY) {
        console.warn("⚠️ EmailJS not configured. Submitting in 'Simulation Mode'.");
        return new Promise(resolve => setTimeout(() => resolve({ status: 'simulated' }), 1000));
    }

    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            templateId,
            {
                ...data, // Pass individual fields
                full_summary: formattedMessage, // Pass the formatted block
                to_name: "Admin",
                from_name: data.name || "Prospect",
                reply_to: data.email
            },
            EMAILJS_CONFIG.PUBLIC_KEY
        );
        return response;
    } catch (error) {
        console.error("❌ EmailJS Error:", error);
        throw error;
    }
};

/**
 * Helper to download the data as a text file (Client copy)
 */
export const downloadSummary = (data, filename = "mon_projet_digiltizeme.txt") => {
    const text = formatFormData(data, "Récapitulatif de votre demande - Digiltizème");
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
};
