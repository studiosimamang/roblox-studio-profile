import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { studioInfo } from '../data/studioData';

export default function Hero({ onNavigate }) {
  const [groupMembers, setGroupMembers] = useState('0');

  useEffect(() => {
    fetch('http://localhost:5000/api/group')
      .then((res) => res.json())
      .then((data) => {
        if (data.memberCount) setGroupMembers(data.memberCount);
      })
      .catch((err) => console.warn('Gagal fetch group stats:', err));
  }, []);

  return (
    /* Hapus border-b border-slate-900 di baris ini agar garis di bawah hilang */
    <section 
      id="hero" 
      className="relative bg-slate-950 flex items-center justify-center overflow-hidden py-12"
    >
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        
        {/* Badge Live Member Counter */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-red-500/40 px-4 py-2 rounded-full mb-8 shadow-md transition"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-300">
            Roblox Group Members: <span className="text-white font-bold">{groupMembers}</span> Players
          </span>
        </motion.div>

        {/* Heading Proporsional & Compact */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-snug mb-6"
        >
          We Create <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
            Next-Gen Roblox
          </span> Experiences
        </motion.h1>

        {/* Tagline / Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-xl mx-auto text-slate-400 text-xs sm:text-base leading-relaxed mb-10"
        >
          {studioInfo.tagline}
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={() => onNavigate('games')}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition shadow-lg shadow-red-600/20 border border-red-500/50 cursor-pointer"
          >
            Explore Games
          </button>
          <a
            href={studioInfo.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition border border-slate-800 hover:border-slate-700"
          >
            Join Discord
          </a>
        </motion.div>

      </div>
    </section>
  );
}