import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-urban-black text-white font-sans selection:bg-orange-500 overflow-hidden relative">
            {/* Global Grain/Noise overlay if needed in future */}
            {children}
        </div>
    );
};

export default MainLayout;
