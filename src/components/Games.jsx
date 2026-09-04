import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gamesData as defaultGames } from '../data/studioData';

// Variabel API URL ditaruh setelah import
const API_URL = import.meta.env.VITE_API_URL || "https://roblox-studio-profile-production.up.railway.app";

export default function Games() {
  const [games, setGames] = useState(defaultGames);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/games`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setGames(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    /* h-[calc(100vh-105px)] mengunci tinggi pas setinggi sisa viewport layar */
    <section id="games" className="bg-slate-950 h-[calc(100vh-105px)] flex items-center justify-center overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header Section Super Compact */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-xl mx-auto mb-4"
        >
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase mb-1">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">Games & Projects</span>
          </h2>
          <p className="text-slate-400 text-[11px] px-4">
            Daftar game Roblox resmi buatan Studio Si Mamang yang aktif dikembangkan.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-slate-400 py-6">
            <p className="animate-pulse text-xs">Mengambil data real-time dari Roblox...</p>
          </div>
        ) : (
          /* Grid Card Compact */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {Array.isArray(games) && games.map((game, index) => (
              <motion.div 
                key={game.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group bg-slate-900/50 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/10 flex flex-col justify-between"
              >
                {/* Banner Thumbnail (24 = ~96px) */}
                <div className="relative h-24 sm:h-28 overflow-hidden bg-slate-950">
                  <img 
                    src={game.image} 
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out" 
                  />
                  <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-red-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-red-500/30 uppercase">
                    {game.genre}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition truncate">
                      {game.title}
                    </h3>
                  </div>

                  {/* Live Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
                    <div>
                      <span className="block text-slate-500 text-[8px] uppercase font-bold">Total Visits</span>
                      <span className="text-slate-200 font-extrabold text-[10px]">{game.visits}</span>
                    </div>
                    <div className="border-l border-slate-800/80 pl-2">
                      <span className="block text-slate-500 text-[8px] uppercase font-bold">Active Players</span>
                      <span className="text-blue-400 font-extrabold text-[10px] flex items-center gap-1">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        {game.activePlayers}
                      </span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <a
                    href={game.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center bg-slate-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-blue-600 text-white font-bold py-1.5 rounded-lg text-[10px] transition duration-300 border border-slate-700 hover:border-transparent"
                  >
                    Play on Roblox
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}