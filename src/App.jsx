import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import Hero from './components/sections/Hero';
import BentoGrid from './components/sections/BentoGrid';
import QuoteSimulator from './components/sections/QuoteSimulator';
import Methodology from './components/sections/Methodology';
import Footer from './components/sections/Footer';
import FinancingModal from './components/ui/FinancingModal';

function App() {
  const [isFinancingOpen, setIsFinancingOpen] = useState(false);

  return (
    <MainLayout>
      <Hero />
      <BentoGrid />
      <QuoteSimulator />
      <Methodology onOpenFinancing={() => setIsFinancingOpen(true)} />
      <Footer />
      <FinancingModal isOpen={isFinancingOpen} onClose={() => setIsFinancingOpen(false)} />
    </MainLayout>
  )
}

export default App;
