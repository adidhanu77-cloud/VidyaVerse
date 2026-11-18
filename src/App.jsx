import React, { useState } from 'react';
import ConfettiBackground from './components/ConfettiBackground';
import Navbar from './components/Navbar';
import PocketLabStudio from './components/PocketLabStudio';
import ImpactStrip from './components/ImpactStrip';
import CoreFeatures from './components/CoreFeatures';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  // null = spacious home feature directory grid; string = full-page dedicated feature view
  const [activeTab, setActiveTab] = useState(null);

  const handleSelectSection = (id) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveTab(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f5efe2' }}>
        {/* Background Animated Geometric Memphis Confetti (Pure CSS, No JS) */}
        <ErrorBoundary>
          <ConfettiBackground />
        </ErrorBoundary>

        {/* Main App Canvas */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ErrorBoundary>
            <Navbar
              currentLang={currentLang}
              setLang={setCurrentLang}
              onOpenScanner={() => handleSelectSection('scanner')}
              onSelectSection={(id) => handleSelectSection(id)}
              onGoHome={handleGoHome}
              activeTab={activeTab}
            />
          </ErrorBoundary>

          <main>
            {/* Main Studio: Either spacious Feature Directory or Dedicated Full-Page Module */}
            <ErrorBoundary>
              <PocketLabStudio
                activeTabId={activeTab}
                currentLang={currentLang}
                onSelectTab={setActiveTab}
              />
            </ErrorBoundary>

            {/* Show promotional / platform overview strips only on the main home directory */}
            {!activeTab && (
              <>
                {/* 2. Full-Bleed Partner Strip */}
                <ErrorBoundary>
                  <ImpactStrip />
                </ErrorBoundary>

                {/* 3. Core Features Overview */}
                <ErrorBoundary>
                  <CoreFeatures onSelectSection={(id) => handleSelectSection(id)} />
                </ErrorBoundary>
              </>
            )}
          </main>

          <ErrorBoundary>
            <Footer />
          </ErrorBoundary>
        </div>
      </div>
    </AuthProvider>
  );
}
