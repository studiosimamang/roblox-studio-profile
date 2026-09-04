const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000; // ✅ BENAR

app.use(cors());
app.use(express.json()); // Parsing JSON body request
app.get("/", (req, res) => {
  res.send("Backend Studio Si Mamang Aktif!");
});


// Configuration
const ROBLOX_GROUP_ID = "485653618";
const ADMIN_SECRET_KEY = "Geadavids171202"; // Secret Key Admin
const DB_FILE = path.join(__dirname, "members.json");

// Helper database file JSON
const getMembersDB = () => {
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
};

const saveMembersDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Data Games
const gamesConfig = [
  {
    id: 1,
    universeId: "10482610962",
    title: "Thissky Obstacle",
    genre: "Roleplay",
    image: "/Thumbnail.png",
    link: "https://www.roblox.com/games/99615440041672/THISSKY-OBSTACLE",
  },
  {
    id: 2,
    universeId: "9096314052",
    title: "Kaduhung Obstacle",
    genre: "Action / Fighting",
    image: "/Kaduhung.png",
    link: "https://www.roblox.com/games/89442698104826/KADUHUNG-OBSTACLE",
  },
];

// Data Tim
const teamConfig = [
  {
    userId: "8972804479",
    role: "Lead Developer / Web Dev",
  },
  {
    userId: "9205433155",
    role: "Community & Financial Admin",
  },
];

// ==========================================
// 1. API ROUTES DATABASE MEMBERS & KTA
// ==========================================

// GET ALL MEMBERS (Tampilan Structure)
app.get("/api/members", (req, res) => {
  res.json(getMembersDB());
});

// REGISTER MEMBER BARU
// REGISTER MEMBER BARU
app.post("/api/members", async (req, res) => {
  const { keyword } = req.body;
  if (!keyword)
    return res.status(400).json({ error: "Roblox Username/ID wajib diisi!" });

  try {
    // Ambil data profil dari Roblox secara langsung (Tanpa Axios ke localhost)
    let targetUser = null;

    if (!isNaN(keyword)) {
      try {
        const directUserRes = await axios.get(
          `https://users.roblox.com/v1/users/${keyword}`,
        );
        targetUser = directUserRes.data;
      } catch (e) {}
    }

    if (!targetUser) {
      const searchRes = await axios.get(
        `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(keyword)}&limit=10`,
      );
      if (searchRes.data.data && searchRes.data.data.length > 0) {
        targetUser =
          searchRes.data.data.find(
            (u) => u.name.toLowerCase() === keyword.toLowerCase(),
          ) || searchRes.data.data[0];
      }
    }

    if (!targetUser)
      return res.status(404).json({ error: "User Roblox tidak ditemukan!" });

    const avatarRes = await axios.get(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${targetUser.id}&size=150x150&format=Png&isCircular=false`,
    );

    const userData = {
      id: targetUser.id,
      name: targetUser.displayName || targetUser.name,
      username: `@${targetUser.name}`,
      avatar:
        avatarRes.data.data?.[0]?.imageUrl || "https://via.placeholder.com/150",
    };

    const db = getMembersDB();
    if (db.some((m) => m.id.toString() === userData.id.toString())) {
      return res
        .status(400)
        .json({ error: "User ini sudah terdaftar sebagai Member!" });
    }

    const newMember = {
      ...userData,
      role: "Community Member",
      registeredAt: new Date().toISOString(),
    };

    db.push(newMember);
    saveMembersDB(db);

    res.json({ message: "Berhasil mendaftar member!", member: newMember });
  } catch (err) {
    res.status(500).json({
      error: err.response?.data?.error || "Gagal memproses data Roblox.",
    });
  }
});

// VERIFIKASI MEMBER UNTUK KTA
app.get("/api/members/check", (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: "Keyword wajib diisi!" });

  const db = getMembersDB();
  const cleanKeyword = keyword.toLowerCase().replace("@", "");

  const member = db.find(
    (m) =>
      m.id.toString() === keyword ||
      m.name.toLowerCase() === cleanKeyword ||
      m.username.toLowerCase().replace("@", "") === cleanKeyword,
  );

  if (!member) {
    return res.status(404).json({
      error:
        "User belum terdaftar sebagai Member! Silakan daftar terlebih dahulu.",
    });
  }

  res.json(member);
});

// HAPUS MEMBER (KHUSUS ADMIN)
// HAPUS MEMBER (KHUSUS ADMIN)
app.delete("/api/members/:id", (req, res) => {
  // Ambil header admin-key (Express membaca header dalam lowercase)
  const secretKey = req.headers["admin-key"];
  const EXPECTED_KEY = "Geadavids171202"; // Sesuaikan dengan key rahasia yang diinginkan

  if (!secretKey || secretKey.trim() !== EXPECTED_KEY) {
    return res.status(403).json({ error: "Akses Ditolak! Admin Key Salah." });
  }

  let db = getMembersDB();
  const initialLength = db.length;
  db = db.filter((m) => m.id.toString() !== req.params.id);

  if (db.length === initialLength) {
    return res
      .status(404)
      .json({ error: "Member tidak ditemukan di database." });
  }

  saveMembersDB(db);
  res.json({ message: "Member berhasil dihapus dari database!" });
});

// ==========================================
// 2. API ROUTES ROBLOX PROXY (LIVE DATA)
// ==========================================

// Fetch Group Stats
app.get("/api/group", async (req, res) => {
  try {
    const groupRes = await axios.get(
      `https://groups.roblox.com/v1/groups/${ROBLOX_GROUP_ID}`,
    );
    res.json({
      id: groupRes.data.id,
      name: groupRes.data.name,
      memberCount: groupRes.data.memberCount
        ? groupRes.data.memberCount.toLocaleString("id-ID")
        : "0",
    });
  } catch (error) {
    console.error("Error fetch group data:", error.message);
    res.status(500).json({ memberCount: "0" });
  }
});

// Fetch Data Tim
app.get("/api/team", async (req, res) => {
  try {
    const userIds = teamConfig.map((t) => t.userId).join(",");

    const userDetailsReq = axios.post("https://users.roblox.com/v1/users", {
      userIds: teamConfig.map((t) => parseInt(t.userId)),
      excludeBannedUsers: false,
    });

    const avatarReq = axios.get(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds}&size=150x150&format=Png&isCircular=false`,
    );

    const [userRes, avatarRes] = await Promise.all([userDetailsReq, avatarReq]);

    const updatedTeam = teamConfig.map((member) => {
      const userInfo = userRes.data.data.find((u) => u.id == member.userId);
      const avatarInfo = avatarRes.data.data.find(
        (a) => a.targetId == member.userId,
      );

      return {
        id: member.userId,
        name: userInfo ? userInfo.displayName : "Roblox Dev",
        username: userInfo ? `@${userInfo.name}` : "@roblox",
        role: member.role,
        avatar: avatarInfo
          ? avatarInfo.imageUrl
          : "https://via.placeholder.com/150",
        robloxProfile: `https://www.roblox.com/users/${member.userId}/profile`,
      };
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error("Error fetch team data:", error.message);
    res.status(500).json([]);
  }
});

// Fetch Data Games
app.get("/api/games", async (req, res) => {
  try {
    const universeIds = gamesConfig.map((g) => g.universeId).join(",");

    const response = await axios.get(
      `https://games.roblox.com/v1/games?universeIds=${universeIds}`,
    );
    const robloxData = response.data.data;

    const updatedGames = gamesConfig.map((game) => {
      const liveData = robloxData.find((d) => d.id == game.universeId);

      return {
        ...game,
        visits: liveData ? liveData.visits.toLocaleString("id-ID") : "0",
        activePlayers: liveData
          ? liveData.playing.toLocaleString("id-ID")
          : "0",
      };
    });

    res.json(updatedGames);
  } catch (error) {
    console.error("Error fetch games data:", error.message);
    res.status(500).json([]);
  }
});

// Proxy Fetch User Roblox Single / Keyword
app.get("/api/kta", async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: "Keyword wajib diisi." });

  try {
    let targetUser = null;
    if (!isNaN(keyword)) {
      try {
        const directUserRes = await axios.get(
          `https://users.roblox.com/v1/users/${keyword}`,
        );
        targetUser = directUserRes.data;
      } catch (e) {}
    }

    if (!targetUser) {
      const searchRes = await axios.get(
        `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(keyword)}&limit=10`,
      );
      if (searchRes.data.data && searchRes.data.data.length > 0) {
        targetUser =
          searchRes.data.data.find(
            (u) => u.name.toLowerCase() === keyword.toLowerCase(),
          ) || searchRes.data.data[0];
      }
    }

    if (!targetUser)
      return res.status(404).json({ error: "User Roblox tidak ditemukan!" });

    const avatarRes = await axios.get(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${targetUser.id}&size=150x150&format=Png&isCircular=false`,
    );

    res.json({
      id: targetUser.id,
      name: targetUser.displayName || targetUser.name,
      username: `@${targetUser.name}`,
      avatar:
        avatarRes.data.data?.[0]?.imageUrl || "https://via.placeholder.com/150",
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data dari Roblox." });
  }
});


app.listen(PORT, () => {
  console.log(`Server Express jalan di http://localhost:${PORT}`);
});
