const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { teamMembers as defaultTeam } from '../data/studioData';

export default function Team() {
  const [team, setTeam] = useState(defaultTeam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/team`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setTeam(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="team" className="bg-slate-950 h-[calc(100vh-105px)] flex items-center justify-center overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header Section Compact */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-xl mx-auto mb-6"
        >
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase mb-1">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">The Contributors</span>
          </h2>
          <p className="text-slate-400 text-[11px] px-4">
            Orang-orang di balik pengembangan proyek dan ekosistem Studio Si Mamang.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-slate-400 py-8">
            <p className="animate-pulse text-xs">Mengambil data avatar tim dari Roblox...</p>
          </div>
        ) : (
          /* Grid 2 Kolom Terpusat */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto justify-center">
            {Array.isArray(team) && team.map((member, index) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
                className="group bg-slate-900/40 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/10"
              >
                <div className="relative w-14 h-14 mx-auto mb-2.5">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border border-slate-700 bg-slate-950 p-0.5">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition duration-300" 
                    />
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition mb-0.5">
                  {member.name}
                </h3>
                <p className="text-[10px] text-slate-500 mb-1.5">{member.username}</p>
                
                <span className="inline-block bg-blue-950/60 text-blue-400 border border-blue-800/40 text-[9px] font-semibold px-2.5 py-0.5 rounded-full mb-3">
                  {member.role}
                </span>
                
                <div>
                  <a
                    href={member.robloxProfile}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full text-[10px] text-slate-300 hover:text-white bg-slate-800/80 hover:bg-red-600/90 px-3 py-1.5 rounded-lg border border-slate-700 transition duration-300 font-semibold"
                  >
                    Roblox Profile
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