const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';

export default function KtaGenerator({ selectedMember }) {
  const [searchKey, setSearchKey] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cardRef = useRef(null);

  useEffect(() => {
    if (selectedMember) {
      setUserData(selectedMember);
      setErrorMsg('');
    }
  }, [selectedMember]);

  const handleVerifyKta = async (e) => {
    e.preventDefault();
    if (!searchKey.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/api/members/check?keyword=${encodeURIComponent(searchKey)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setUserData(data);
      setSearchKey('');
    } catch (err) {
      setUserData(null);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (cardRef.current === null || !userData) return;
    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `KTA-${userData.name}-PrintReady.png`;
        link.href = dataUrl;
        link.click();
      });
  };

  return (
    <section id="kta" className="bg-slate-950 h-[calc(100vh-105px)] flex items-center justify-center overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-4 w-full">
        
        {/* Header Section */}
        <div className="text-center mb-4">
          <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest block mb-0.5">
            Member Identity Card
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase mb-1">
            Cetak <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">KTA Digital</span>
          </h2>
        </div>

        {/* Form Cek Member */}
        <div className="max-w-md mx-auto mb-4">
          <form onSubmit={handleVerifyKta} className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan Username / ID Roblox..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition disabled:opacity-50"
            >
              {loading ? 'Cek...' : 'Buka KTA'}
            </button>
          </form>

          {errorMsg && (
            <p className="text-red-400 text-[11px] bg-red-950/40 border border-red-800/40 p-2 rounded-lg text-center mt-2">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Display Gembok / Kartu Depan & Belakang */}
        {!userData ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 max-w-md mx-auto text-center backdrop-blur-md">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="text-white font-bold text-xs mb-1 uppercase">Akses KTA Terkunci</h3>
            <p className="text-slate-400 text-[11px]">
              Ketik username Roblox kamu di atas untuk mengecek status pendaftaran & membuka KTA.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            
            {/* WRAPPER TRANSPARAN - KARTU TERPISAH TOTAL */}
            <div 
              ref={cardRef} 
              className="bg-transparent p-2 flex flex-col sm:flex-row gap-8 items-center justify-center"
            >
              
              {/* SISI DEPAN */}
              <div className="w-[300px] sm:w-[320px] h-[190px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-800 rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-extrabold text-[9px] uppercase text-white">STUDIO SIMAMANG</span>
                  <span className="text-[7px] font-bold text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded">FRONT SIDE</span>
                </div>
                <div className="flex items-center space-x-3 my-1">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-red-500/60 p-0.5 bg-slate-950 shrink-0">
                    <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-xs font-extrabold text-white truncate">{userData.name}</h3>
                    <p className="text-[10px] text-slate-400 truncate mb-1">{userData.username}</p>
                    <span className="bg-red-950 text-red-400 text-[8px] font-bold px-2 py-0.5 rounded-full border border-red-800/50">
                      {userData.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[8px] text-slate-500 border-t border-slate-800 pt-1">
                  <span>ID: #{userData.id.toString().substring(0, 6)}</span>
                  <span className="text-slate-400 font-semibold">VERIFIED MEMBER</span>
                </div>
              </div>

              {/* SISI BELAKANG */}
              <div className="w-[300px] sm:w-[320px] h-[190px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-800 rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-extrabold text-[9px] text-slate-300 uppercase">COMMUNITY RULES</span>
                  <span className="text-[7px] font-bold text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded">BACK SIDE</span>
                </div>
                <div className="my-1 text-[8px] text-slate-300 space-y-1">
                  <p>1. Bukti keanggotaan resmi Studio Si Mamang.</p>
                  <p>2. Wajib mematuhi seluruh peraturan komunitas.</p>
                  <p>3. Dilarang menyalahgunakan KTA ini.</p>
                </div>
                <div className="flex items-center justify-between text-[8px] text-slate-500 border-t border-slate-800 pt-1">
                  <span>Issued by Studio Si Mamang</span>
                  <span className="text-slate-400 font-semibold">OFFICIAL ID</span>
                </div>
              </div>

            </div>

            {/* Tombol Download */}
            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-600/20 transition cursor-pointer"
            >
              Download Ready-To-Print KTA (HD)
            </button>

          </div>
        )}

      </div>
    </section>
  );
}