import React, { useState } from 'react';
import Hero from '../components/sections/Hero';
import BentoGrid from '../components/sections/BentoGrid';
import Services from '../components/sections/Services';
import Trainings from '../components/sections/Trainings';
import QuoteSimulator from '../components/sections/QuoteSimulator';
import Methodology from '../components/sections/Methodology';
import Director from '../components/sections/Director';
import Footer from '../components/sections/Footer';
import FinancingModal from '../components/ui/FinancingModal';
import QuickContact from '../components/sections/QuickContact'; // Keeping it on Home for now or removing? Plan says dedicated. 
// Plan says: "QuickContact: Update usage to fit full page". 
// But also "Main layout". 
// Let's decide: Home Page usually has a contact section at bottom. 
// The user said "chaque formulaire dans une page dédiée". 
// So I should REMOVE QuickContact from HomePage and only link to it?
// Or keep a teaser? "Hero CTA -> /contact". 
// I will keep Footer (with link to Plan) and Hero (with link to Contact).
// I'll remove QuickContact section from Home Page to strictly follow "page dédiée".

const HomePage = () => {
    const [isFinancingOpen, setIsFinancingOpen] = useState(false);

    return (
        <>
            <Hero />
            <BentoGrid />
            <Trainings />
            <Services />
            <QuoteSimulator />
            <Methodology onOpenFinancing={() => setIsFinancingOpen(true)} />
            <Director />
            <Footer />
            <FinancingModal isOpen={isFinancingOpen} onClose={() => setIsFinancingOpen(false)} />
        </>
    );
};

export default HomePage;
