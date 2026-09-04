import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Variabel API URL ditaruh setelah import
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://roblox-studio-profile-production.up.railway.app";

export default function Structure({ onSelectMember }) {
  const [membersList, setMembersList] = useState([]);
  const [adminKey, setAdminKey] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);

  // State Toast & Modal Konfirmasi Hapus
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    member: null,
  });

  // ✅ BENAR: Menggunakan CDN Avatar Roblox Langsung
  const DEFAULT_AVATAR =
    "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-38C0160CBF08D325F42FD42644AC8D35-Png/150/150/AvatarHeadshot/Png/noFilter";

  const [ownerData, setOwnerData] = useState({
    id: "8972804479",
    name: "Mangsky",
    username: "@Mangsky",
    role: "Owner / Lead Dev",
    avatar: DEFAULT_AVATAR,
  });
  const [headAdminData, setHeadAdminData] = useState({
    id: "9205433155",
    name: "Riri",
    username: "@Riri",
    role: "Head Administrator",
    avatar: DEFAULT_AVATAR,
  });
  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const fetchMembers = () => {
    fetch(`${API_URL}/api/members`)
      .then((res) => res.json())
      .then((data) => setMembersList(data))
      .catch((err) => console.warn("Gagal fetch members:", err));
  };

  useEffect(() => {
    fetchMembers();
    fetch(`${API_URL}/api/kta?keyword=8972804479`)
      .then((res) => res.json())
      .then(
        (data) => data.avatar && setOwnerData((prev) => ({ ...prev, ...data })),
      );
    fetch(`${API_URL}/api/kta?keyword=9205433155`)
      .then((res) => res.json())
      .then(
        (data) =>
          data.avatar && setHeadAdminData((prev) => ({ ...prev, ...data })),
      );
  }, []);

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminKey.trim() === "Geadavids171202") {
      setIsAdminMode(true);
      setShowAdminInput(false);
      triggerToast("Admin Mode Aktif! Akses hapus terbuka.", "success");
    } else {
      triggerToast("Admin Key Salah! Akses ditolak.", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.member) return;
    const memberId = confirmModal.member.id;

    try {
      const res = await fetch(`${API_URL}/api/members/${memberId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "admin-key": adminKey.trim(),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      triggerToast(
        `Member ${confirmModal.member.name} berhasil dihapus!`,
        "success",
      );
      setConfirmModal({ show: false, member: null });
      fetchMembers();
    } catch (err) {
      triggerToast(err.message, "error");
      setConfirmModal({ show: false, member: null });
    }
  };

  return (
    <section
      id="structure"
      className="bg-slate-950 min-h-[calc(100vh-105px)] flex items-center justify-center py-4 relative"
    >
      <div className="max-w-6xl mx-auto px-4 w-full">
        {/* TOAST NOTIFICATION */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-16 right-5 z-50 px-4 py-2.5 rounded-xl border text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 ${
                toast.type === "success"
                  ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                  : "bg-red-950/80 border-red-500/50 text-red-300"
              }`}
            >
              <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL KONFIRMASI HAPUS CUSTOM */}
        <AnimatePresence>
          {confirmModal.show && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-center shadow-2xl space-y-4"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-xl text-red-400">
                  🗑️
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-sm uppercase mb-1">
                    Konfirmasi Hapus Member
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Apakah kamu yakin ingin mengeluarkan{" "}
                    <span className="text-red-400 font-bold">
                      {confirmModal.member?.name}
                    </span>{" "}
                    dari database komunitas?
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() =>
                      setConfirmModal({ show: false, member: null })
                    }
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-xl text-xs transition shadow-lg shadow-red-600/20"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="text-center max-w-xl mx-auto mb-3 relative">
          <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest block mb-0.5">
            Community Hierarchy
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            Struktur Komunitas
          </h2>

          <button
            onClick={() => setShowAdminInput(!showAdminInput)}
            className="absolute right-0 top-0 text-[11px] bg-slate-900 border border-slate-800 hover:border-red-500/50 p-1.5 rounded-lg text-slate-400 hover:text-white transition"
          >
            ⚙️ {isAdminMode ? "Admin Active" : "Admin Auth"}
          </button>
        </div>

        {/* Input Key Admin */}
        <AnimatePresence>
          {showAdminInput && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAdminAuth}
              className="max-w-xs mx-auto mb-3 flex gap-1.5"
            >
              <input
                type="password"
                placeholder="Masukkan Key Admin..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-red-500 text-white text-xs p-2 rounded-xl flex-1 outline-none"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 rounded-xl transition"
              >
                Auth
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center">
          {/* OWNER */}
          <div className="flex flex-col items-center">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border border-red-500/50 bg-red-950/30 text-red-400 mb-1">
              Owner / Founder
            </span>
            <div className="bg-slate-900/80 border border-red-500/40 p-2 rounded-xl text-center w-32">
              <img
                src={ownerData.avatar}
                alt="Owner"
                className="w-8 h-8 mx-auto mb-1 rounded-full border border-red-500 p-0.5"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
              <h4 className="text-white font-bold text-[11px] truncate">
                {ownerData.name}
              </h4>
              <p className="text-slate-400 text-[9px] truncate">
                {ownerData.username}
              </p>
            </div>
          </div>

          <div className="w-0.5 h-2 bg-slate-800 my-0.5"></div>

          {/* HEAD ADMIN */}
          <div className="flex flex-col items-center">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border border-purple-500/50 bg-purple-950/30 text-purple-400 mb-1">
              Head Admin
            </span>
            <div className="bg-slate-900/80 border border-purple-500/40 p-2 rounded-xl text-center w-32">
              <img
                src={headAdminData.avatar}
                alt="Head Admin"
                className="w-8 h-8 mx-auto mb-1 rounded-full border border-purple-500 p-0.5"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
              <h4 className="text-white font-bold text-[11px] truncate">
                {headAdminData.name}
              </h4>
              <p className="text-slate-400 text-[9px] truncate">
                {headAdminData.username}
              </p>
            </div>
          </div>

          <div className="w-0.5 h-2 bg-slate-800 my-0.5"></div>

          {/* MEMBERS FROM DATABASE */}
          <div className="w-full">
            <div className="text-center mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border border-blue-500/50 bg-blue-950/30 text-blue-400">
                Official Members ({membersList.length})
              </span>
            </div>

            {membersList.length === 0 ? (
              <p className="text-center text-slate-500 text-[11px] py-1">
                Belum ada member terdaftar di database.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-w-4xl mx-auto">
                <AnimatePresence>
                  {membersList.map((member) => (
                    <motion.div
                      key={member.id}
                      className="bg-slate-900/60 border border-slate-800/80 p-1.5 rounded-lg text-center relative group"
                    >
                      {isAdminMode && (
                        <button
                          onClick={() =>
                            setConfirmModal({ show: true, member })
                          }
                          className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full w-5 h-5 text-[10px] font-bold flex items-center justify-center shadow-lg border border-slate-950 transition"
                          title="Hapus Member"
                        >
                          ✕
                        </button>
                      )}
                      <img
                        src={member.avatar || DEFAULT_AVATAR}
                        alt={member.name}
                        className="w-8 h-8 mx-auto mb-1 rounded-full border border-slate-700 p-0.5"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_AVATAR;
                        }}
                      />
                      <h4 className="text-white font-bold text-[10px] truncate">
                        {member.name}
                      </h4>
                      <p className="text-slate-400 text-[8px] truncate mb-0.5">
                        {member.username}
                      </p>
                      <button
                        onClick={() => onSelectMember(member)}
                        className="text-[8px] text-blue-400 hover:text-blue-300 font-semibold underline block mx-auto"
                      >
                        Cetak KTA
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
