import React from 'react';
import { Share2, Linkedin } from 'lucide-react';

/**
 * LinkedIn Share Button Component
 * Uses LinkedIn's native share URL scheme (no API key needed)
 */
const LinkedInShareButton = ({ project }) => {
    const handleShare = () => {
        // Build project URL (adjust to your portfolio domain)
        const projectUrl = project.liveUrl || `https://digiltizeme-portfolio.vercel.app/#projects`;

        // LinkedIn share URL scheme
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`;

        // Open in new window
        window.open(linkedInUrl, '_blank', 'width=600,height=600');
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg transition-all text-sm font-medium"
            title="Partager sur LinkedIn"
        >
            <Linkedin className="w-4 h-4" />
            <span>Partager sur LinkedIn</span>
        </button>
    );
};

export default LinkedInShareButton;
