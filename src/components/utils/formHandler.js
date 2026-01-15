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
 * Handles nested objects (like 'details') recursively
 */
export const formatFormData = (data, title = "Nouveau Lead", indent = "") => {
    let formattedText = indent === "" ? `=== ${title} ===\n\nDate: ${new Date().toLocaleString("fr-FR")}\n` : "";

    for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) continue;

        // Skip keys that are duplicates of what's in 'details' to avoid redundancy
        if (indent === "" && key === "details") {
            formattedText += `\n--- DÉTAILS DU QUESTIONNAIRE ---\n`;
            formattedText += formatFormData(value, "", "  ");
            continue;
        }

        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

        if (typeof value === 'object' && !Array.isArray(value)) {
            formattedText += `${indent}${label}:\n`;
            formattedText += formatFormData(value, "", indent + "  ");
        } else {
            formattedText += `${indent}${label}: ${value}\n`;
        }
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

    // Priority: URL from env > window origin port 4000 > default localhost:4000
    const API_URL = import.meta.env.VITE_API_URL ||
        (window.location.hostname === 'localhost' ? 'http://localhost:4000' : 'https://backend-portfolio-production-871c.up.railway.app');

    // 1. 🚀 Send to NestJS Backend (First Priority)
    try {
        const response = await fetch(`${API_URL}/leads`, {
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

    // Flatten details for EmailJS template if it exists
    const emailData = {
        ...data,
        ...(data.details || {}), // Spread details into top level for template access
        full_summary: formattedMessage,
        to_name: "Admin",
        from_name: data.name || "Prospect",
        reply_to: data.email
    };

    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            templateId,
            emailData,
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
