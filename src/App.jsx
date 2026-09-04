import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Games from './components/Games';
import About from './components/About';
import Structure from './components/Structure';
import Register from './components/Register';
import KtaGenerator from './components/KtaGenerator';
import Team from './components/Team';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  const [selectedMember, setSelectedMember] = useState(null);

  const handleRegisterSuccess = (member) => {
    setSelectedMember(member);
    setActiveTab('kta'); // Otomatis pindah ke Tab KTA dengan data terverifikasi
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setActiveTab('kta');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col justify-between selection:bg-red-500 selection:text-white">
      <div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1">
          {activeTab === 'hero' && <Hero onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'games' && <Games />}
          {activeTab === 'about' && <About />}
          {activeTab === 'structure' && <Structure onSelectMember={handleSelectMember} />}
          {activeTab === 'register' && <Register onRegisterSuccess={handleRegisterSuccess} />}
          {activeTab === 'kta' && <KtaGenerator selectedMember={selectedMember} />}
          {activeTab === 'team' && <Team />}
        </main>
      </div>

      <Footer />
    </div>
  );
}