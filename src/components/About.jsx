import React from 'react';
import { motion } from 'framer-motion';
import { studioInfo } from '../data/studioData';

export default function About() {
  const features = [
    {
      title: "Game Development",
      desc: "Mengembangkan game Roblox yang engaging, unik, dan seru untuk dimainkan.",
      icon: "🎮",
    },
    {
      title: "UI/UX & Scripting",
      desc: "Desain interface modern serta logika koding Luau yang optimal dan stabil.",
      icon: "💻",
    },
    {
      title: "Active Community",
      desc: "Wadah diskusi, belajar bareng, dan kolaborasi bagi Roblox Dev Indonesia.",
      icon: "👥",
    },
    {
      title: "Project Support",
      desc: "Saling mendukung promosi dan testing game antar sesama anggota studio.",
      icon: "🚀",
    },
  ];

  return (
    /* h-[calc(100vh-105px)] mengunci tinggi pas setinggi sisa layar */
    <section id="about" className="bg-slate-950 h-[calc(100vh-105px)] flex items-center justify-center overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Main Grid 2 Kolom Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Kolom Kiri: Deskripsi & Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6 space-y-4"
          >
            <div>
              <span className="text-red-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest block mb-1">
                About Our Community
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white uppercase tracking-tight leading-tight">
                Membangun Ruang <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">Kreativitas</span> Dev Roblox
              </h2>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {studioInfo.description}
            </p>

            <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">
              Kami percaya bahwa membuat game bukan cuma soal koding, tapi juga tentang komunitas yang saling mendukung. Di studio ini, kami membagikan ide, belajar arsitektur game, hingga berkolaborasi dalam proyek-proyek seru.
            </p>

            {/* Live Stats Cards Compact */}
            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-800/80">
              <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-xl text-center">
                <span className="block text-lg sm:text-xl font-black text-white">2+</span>
                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Active Games</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-xl text-center">
                <span className="block text-lg sm:text-xl font-black text-red-500">100%</span>
                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Community</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-xl text-center">
                <span className="block text-lg sm:text-xl font-black text-blue-500">Indo</span>
                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Roblox Devs</span>
              </div>
            </div>
          </motion.div>

          {/* Kolom Kanan: 4 Feature Cards (Compact) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {features.map((item, index) => (
              <div 
                key={index}
                className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 p-3.5 rounded-xl transition duration-300 backdrop-blur-md group hover:-translate-y-0.5"
              >
                <div className="text-xl mb-2 bg-slate-950 w-8 h-8 rounded-lg flex items-center justify-center border border-slate-800 group-hover:border-red-500/40 transition">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-xs mb-1 group-hover:text-red-400 transition">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-[11px] leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}