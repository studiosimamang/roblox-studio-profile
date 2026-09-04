// Buat variabel ini di file helper API atau di bagian atas komponen kamu:
const API_URL = import.meta.env.VITE_API_URL || "https://roblox-studio-profile-production.up.railway.app";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Register({ onRegisterSuccess }) {
  const [robloxInput, setRobloxInput] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreed) return setErrorMsg('Kamu wajib menyetujui Rules Komunitas!');

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_URL}/api/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: robloxInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRobloxInput('');
      setAgreed(false);
      setSuccessMsg(`Selamat ${data.member.name}, kamu berhasil terdaftar! Mengalihkan ke KTA...`);

      setTimeout(() => {
        onRegisterSuccess(data.member);
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="bg-slate-950 h-[calc(100vh-105px)] flex items-center justify-center overflow-hidden relative">
      <div className="max-w-md mx-auto px-4 w-full">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
          <div className="text-center mb-4">
            <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest block mb-0.5">Join Community</span>
            <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Daftar Member Resmi</h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Roblox Username / ID</label>
              <input
                type="text"
                placeholder="Contoh: Geadavids17"
                value={robloxInput}
                onChange={(e) => setRobloxInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-red-500"
                required
              />
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-400">
              <input type="checkbox" id="rules" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-red-600 rounded cursor-pointer" />
              <label htmlFor="rules" className="cursor-pointer leading-tight">Saya menyetujui & mematuhi <strong>Rules Komunitas Studio Si Mamang</strong>.</label>
            </div>

            {errorMsg && <p className="text-red-400 text-[11px] bg-red-950/40 border border-red-800/40 p-2 rounded-lg text-center">{errorMsg}</p>}
            {successMsg && <p className="text-emerald-400 text-[11px] bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-lg text-center">{successMsg}</p>}

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider border border-red-500/50 shadow-lg disabled:opacity-50">
              {loading ? 'Memproses Pendaftaran...' : 'Daftar Sekarang'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}