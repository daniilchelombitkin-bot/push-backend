import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// === API для отправки пуша ===
app.post("/send-push", async (req, res) => {
  try {
    const { playerId, title, message } = req.body; // ⚡️ playerId приходит с фронта

    if (!playerId) {
      return res.status(400).json({ error: "playerId обязателен" });
    }

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${process.env.ONESIGNAL_REST_API_KEY}`, // REST API Key из OneSignal
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID, // App ID из OneSignal
        include_player_ids: [playerId],
        headings: { en: title || "Default title" },
        contents: { en: message || "Default message" },
      }),
    });

    const data = await response.json();
    console.log("✅ Push отправлен:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Ошибка при отправке push:", err);
    res.status(500).json({ error: "Failed to send push" });
  }
});

// === Запуск сервера ===
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
