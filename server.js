require("dotenv").config();
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState, StreamType } = require("@discordjs/voice");
const googleTTS = require("google-tts-api");

const ffmpegPath = process.env.FFMPEG_PATH || require("ffmpeg-static");

const app = express();
const PORT = process.env.PORT || 4000;
const CHECKOUT_ORIGIN = (process.env.CHECKOUT_ORIGIN || "").replace(/\/+$/, "");
const OMEGLEPAY_ORIGIN = (process.env.OMEGLEPAY_ORIGIN || "").replace(/\/+$/, "");
const CHECKOUT_SECRET = process.env.CHECKOUT_SECRET || "";

// ── Paddle config ────────────────────────────────────────────────────
const PADDLE_API_KEY = process.env.PADDLE_API_KEY || "";
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || "";
const PADDLE_CLIENT_TOKEN = process.env.PADDLE_CLIENT_TOKEN || "";
const PADDLE_ENV = process.env.PADDLE_ENV || "production"; // "sandbox" or "production"
const PADDLE_API_BASE = PADDLE_ENV === "sandbox"
  ? "https://sandbox-api.paddle.com"
  : "https://api.paddle.com";

// ── Price IDs (from Paddle dashboard) ────────────────────────────────
const PRICES = {
  basic:        process.env.BASIC_PRICE_ID || "",
  premium:      process.env.PREMIUM_PRICE_ID || "",
  test:         process.env.TEST_PRICE_ID || "",
  customaccess: process.env.CUSTOMACCESS_PRICE_ID || "",
  request:      process.env.REQUEST_PRICE_ID || "",
};

// ── Discord config ───────────────────────────────────────────────────
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const GUILD_ID  = process.env.GUILD_ID  || "1472050464659865742";
const ROLE_ID   = process.env.ROLE_ID   || "1475133268931252315";
const REQUEST_VC_CHANNEL_ID = "1475001455298478132";

const DISCORD_WEBHOOK_URL =
  process.env.DISCORD_WEBHOOK_URL ||
  "https://canary.discord.com/api/webhooks/1471629017869455491/EOwPBvSUuWYs-GzPm8Pix2P4Cgzb-FxzilH4WaZhOMGD2OXcmg4-bhCZ24XOhV0Ejair";

app.set("trust proxy", true);

// ── Helpers ──────────────────────────────────────────────────────────

function generateAccessKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  const bytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) key += chars[bytes[i] % chars.length];
  return key;
}

async function sendDiscordWebhook(payload) {
  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Discord webhook error ${response.status}: ${body}`);
  }
}

// ── Paddle helpers ───────────────────────────────────────────────────

function verifyPaddleSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const parts = {};
  signature.split(";").forEach(p => {
    const idx = p.indexOf("=");
    if (idx > 0) parts[p.slice(0, idx)] = p.slice(idx + 1);
  });
  if (!parts.ts || !parts.h1) return false;
  const payload = `${parts.ts}:${rawBody}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(parts.h1));
  } catch {
    return false;
  }
}

async function paddleGetTransaction(txnId) {
  const res = await fetch(`${PADDLE_API_BASE}/transactions/${txnId}`, {
    headers: { Authorization: `Bearer ${PADDLE_API_KEY}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paddle API ${res.status}: ${text}`);
  }
  return (await res.json()).data;
}

function isPaid(txn) {
  return txn.status === "paid" || txn.status === "completed";
}

// Idempotent key store: txnId → { key, tier }
const txnKeys = {};

// ── Paddle webhook (raw body — must be before json middleware) ───────
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["paddle-signature"];
    const rawBody = req.body.toString();

    if (!verifyPaddleSignature(rawBody, sig, PADDLE_WEBHOOK_SECRET)) {
      console.error("Webhook signature verification failed");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody);
    console.log(`📩 Paddle event: ${event.event_type}`);

    if (event.event_type === "transaction.completed" || event.event_type === "transaction.paid") {
      const txn = event.data;
      const customData = txn.custom_data || {};
      const tier = customData.tier || "n/a";
      const endpoint = customData.endpoint || "n/a";
      const total = txn.details?.totals?.total || "0";
      const currency = txn.currency_code || "USD";
      const amountText = `${total} ${currency}`;
      const paymentMethod = txn.payments?.[0]?.method_details?.type || "card";

      console.log("✅ Payment successful!", { tier, endpoint, txnId: txn.id });

      // Discord notification
      try {
        await sendDiscordWebhook({
          embeds: [{
            title: "💸 Payment Successful",
            color: 0x00c853,
            fields: [
              { name: "Endpoint", value: endpoint, inline: true },
              { name: "Tier", value: tier, inline: true },
              { name: "Amount", value: amountText, inline: true },
              { name: "Payment Method", value: paymentMethod, inline: true },
              { name: "Transaction", value: txn.id, inline: false },
            ],
            timestamp: new Date().toISOString(),
          }],
        });
      } catch (err) {
        console.error("❌ Failed to send Discord webhook:", err.message);
      }

      // Pre-generate key for yard tiers
      if (["basic", "premium"].includes(tier) && !txnKeys[txn.id]) {
        const key = generateAccessKey();
        txnKeys[txn.id] = { key, tier };

        if (CHECKOUT_SECRET && OMEGLEPAY_ORIGIN) {
          try {
            await fetch(`${OMEGLEPAY_ORIGIN}/api/store-key`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key, tier, sessionId: txn.id, checkoutSecret: CHECKOUT_SECRET }),
            });
            console.log(`🔑 Key stored: ${key} (${tier})`);
          } catch (err) {
            console.error("⚠️ Failed to store key on main site:", err.message);
          }
        }
      }

      // Handle request notifications
      if (endpoint === "request" && customData.preferredName) {
        const preferredName = customData.preferredName;
        const requestText = customData.requestText || "";
        const amountDollars = total;
        const channelId = "1475355092323667968";

        try {
          const discordBase = "https://discord.com/api/v10";
          const headers = {
            Authorization: `Bot ${BOT_TOKEN}`,
            "Content-Type": "application/json",
          };

          await fetch(`${discordBase}/channels/${channelId}/messages`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              embeds: [{
                description: `**${preferredName}** just unlocked a custom request.`,
                fields: [
                  { name: "Amount Paid", value: amountText, inline: true },
                  ...(requestText
                    ? [{ name: "Request", value: requestText.slice(0, 60), inline: true }]
                    : []),
                ],
                color: 0x10b981,
                timestamp: new Date().toISOString(),
              }],
            }),
          });
          console.log(`✅ Request notification sent for ${preferredName}`);

          const numericTotal = parseFloat(total);
          const shouldTTS = (numericTotal >= 1) || preferredName.toLowerCase() === "tester";
          if (shouldTTS) {
            const ttsText = `${preferredName} spent ${amountDollars} dollars and requested ${requestText}`;
            speakInVoiceChannel(ttsText)
              .then(() => console.log("✅ TTS announcement played"))
              .catch(err => console.error("⚠️ TTS failed:", err.message));
          }
        } catch (err) {
          console.error("❌ Request notification error:", err.message);
        }
      }
    }

    res.json({ received: true });
  }
);

// ── Static files ─────────────────────────────────────────────────────
const rootDir = path.resolve(__dirname);
app.use(express.static(rootDir));

// ── CORS helper ──────────────────────────────────────────────────────
function cors(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
}

// ── /api/claim-key — verify payment, return access key ──────────────
app.options("/api/claim-key", (req, res) => { cors(res); res.sendStatus(204); });

app.post("/api/claim-key", express.json(), async (req, res) => {
  cors(res);
  const txnId = req.body?.transactionId || req.body?.sessionId;
  if (!txnId) return res.status(400).json({ error: "transactionId is required" });

  // Check if key already generated (idempotent)
  if (txnKeys[txnId]) {
    return res.json(txnKeys[txnId]);
  }

  // Verify with Paddle
  let lastErr = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const txn = await paddleGetTransaction(txnId);
      if (!isPaid(txn)) {
        if (attempt < 3) { await new Promise(r => setTimeout(r, 2000)); continue; }
        return res.status(402).json({ error: "Payment not completed" });
      }

      const customData = txn.custom_data || {};
      const tier = customData.tier || "basic";
      const key = generateAccessKey();
      txnKeys[txnId] = { key, tier };

      // Store on omeglepay
      if (CHECKOUT_SECRET && OMEGLEPAY_ORIGIN) {
        try {
          await fetch(`${OMEGLEPAY_ORIGIN}/api/store-key`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, tier, sessionId: txnId, checkoutSecret: CHECKOUT_SECRET }),
          });
        } catch (storeErr) {
          console.error("⚠️ Failed to store key:", storeErr.message);
        }
      }

      console.log(`🔑 Key generated via claim-key: ${key} (${tier})`);
      return res.json({ key, tier });
    } catch (err) {
      lastErr = err.message;
      if (attempt < 3) { await new Promise(r => setTimeout(r, 2000)); continue; }
    }
  }
  console.error("❌ claim-key error:", lastErr);
  return res.status(500).json({ error: "Failed to verify payment" });
});

// ── /api/verify-transaction — check if transaction is paid ──────────
app.get("/api/verify-transaction", async (req, res) => {
  cors(res);
  const txnId = req.query.txn || req.query.transactionId || req.query.sessionId;
  if (!txnId) return res.status(400).json({ error: "txn required" });

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const txn = await paddleGetTransaction(txnId);
      if (isPaid(txn)) return res.json({ paid: true, customData: txn.custom_data || {} });
      if (attempt < 3) { await new Promise(r => setTimeout(r, 1500)); continue; }
      return res.status(402).json({ paid: false });
    } catch (err) {
      if (attempt < 3) { await new Promise(r => setTimeout(r, 1500)); continue; }
      return res.status(500).json({ error: err.message });
    }
  }
});

// Keep old endpoint name as alias
app.get("/api/verify-session", (req, res) => {
  req.query.txn = req.query.txn || req.query.sessionId;
  app.handle(req, res);
});

// ── /api/grant-discord-role — verify payment + assign Discord role ───
app.options("/api/grant-discord-role", (req, res) => { cors(res); res.sendStatus(204); });

app.post("/api/grant-discord-role", express.json(), async (req, res) => {
  cors(res);
  const txnId = req.body?.transactionId || req.body?.sessionId;
  const discordUsername = req.body?.discordUsername;
  if (!txnId || !discordUsername)
    return res.status(400).json({ error: "transactionId and discordUsername are required" });

  const username = String(discordUsername).trim().replace(/^@/, "");
  if (!username) return res.status(400).json({ error: "Invalid Discord username" });

  // Verify payment with Paddle
  let txn;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      txn = await paddleGetTransaction(txnId);
      if (!isPaid(txn)) {
        if (attempt < 3) { await new Promise(r => setTimeout(r, 2000)); continue; }
        return res.status(402).json({ error: "Payment not completed" });
      }
      break;
    } catch (err) {
      if (attempt < 3) { await new Promise(r => setTimeout(r, 2000)); continue; }
      console.error("❌ grant-discord-role paddle error:", err.message);
      return res.status(500).json({ error: "Failed to verify payment" });
    }
  }

  const discordBase = "https://discord.com/api/v10";
  const headers = {
    Authorization: `Bot ${BOT_TOKEN}`,
    "Content-Type": "application/json",
    "X-Audit-Log-Reason": "CustomAccess purchase",
  };

  // Search guild members
  let memberId = null;
  try {
    const searchRes = await fetch(
      `${discordBase}/guilds/${GUILD_ID}/members/search?query=${encodeURIComponent(username)}&limit=10`,
      { headers }
    );
    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error("❌ Discord member search error:", searchRes.status, errText);
      return res.status(500).json({ error: "Failed to search guild members." });
    }
    const members = await searchRes.json();
    const lower = username.toLowerCase();
    const match = members.find(m =>
      (m.user.username || "").toLowerCase() === lower ||
      (m.user.global_name || "").toLowerCase() === lower ||
      (m.nick || "").toLowerCase() === lower
    );
    if (!match) {
      return res.status(404).json({ error: `Discord user "${username}" not found in the server.` });
    }
    memberId = match.user.id;
  } catch (err) {
    console.error("❌ Discord search error:", err.message);
    return res.status(500).json({ error: "Network error contacting Discord" });
  }

  // Grant role
  try {
    const roleRes = await fetch(
      `${discordBase}/guilds/${GUILD_ID}/members/${memberId}/roles/${ROLE_ID}`,
      { method: "PUT", headers }
    );
    if (!roleRes.ok && roleRes.status !== 204) {
      const errText = await roleRes.text();
      console.error("❌ Discord role grant error:", roleRes.status, errText);
      return res.status(500).json({ error: "Failed to assign role." });
    }
  } catch (err) {
    console.error("❌ Discord role error:", err.message);
    return res.status(500).json({ error: "Network error assigning role" });
  }

  // Notify
  try {
    await sendDiscordWebhook({
      embeds: [{
        title: "🎉 CustomAccess Role Granted",
        color: 0x7c3aed,
        fields: [
          { name: "Discord Username", value: username, inline: true },
          { name: "User ID", value: memberId, inline: true },
          { name: "Transaction", value: txnId, inline: false },
        ],
        timestamp: new Date().toISOString(),
      }],
    });
  } catch (err) {
    console.error("⚠️ Discord webhook notify failed:", err.message);
  }

  console.log(`✅ Role granted to ${username} (${memberId})`);
  return res.json({ success: true, username });
});

// ── /api/send-request-notification ──────────────────────────────────
app.options("/api/send-request-notification", (req, res) => { cors(res); res.sendStatus(204); });

app.post("/api/send-request-notification", express.json(), async (req, res) => {
  cors(res);
  const txnId = req.body?.transactionId || req.body?.sessionId;
  if (!txnId) return res.status(400).json({ error: "transactionId is required" });

  let txn;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      txn = await paddleGetTransaction(txnId);
      if (!isPaid(txn)) {
        if (attempt < 3) { await new Promise(r => setTimeout(r, 1500)); continue; }
        return res.status(402).json({ error: "Payment not completed" });
      }
      break;
    } catch (err) {
      if (attempt < 3) { await new Promise(r => setTimeout(r, 1500)); continue; }
      console.error("❌ send-request-notification error:", err.message);
      return res.status(500).json({ error: "Failed to verify payment" });
    }
  }

  const customData = txn.custom_data || {};
  const preferredName = customData.preferredName || "Unknown";
  const requestText = customData.requestText || "";
  const total = txn.details?.totals?.total || "0";
  const currency = txn.currency_code || "USD";
  const amountText = `$${total} ${currency}`;
  const channelId = "1475355092323667968";

  try {
    const discordBase = "https://discord.com/api/v10";
    const headers = {
      Authorization: `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json",
    };

    const messageRes = await fetch(`${discordBase}/channels/${channelId}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        embeds: [{
          description: `**${preferredName}** just unlocked a custom request.`,
          fields: [
            { name: "Amount Paid", value: amountText, inline: true },
            ...(requestText
              ? [{ name: "Request", value: requestText.slice(0, 60), inline: true }]
              : []),
          ],
          color: 0x10b981,
          timestamp: new Date().toISOString(),
        }],
      }),
    });

    if (!messageRes.ok) {
      const errText = await messageRes.text();
      console.error("❌ Discord message error:", messageRes.status, errText);
      return res.status(500).json({ error: "Failed to send notification" });
    }

    console.log(`✅ Request notification sent for ${preferredName}`);

    const numericTotal = parseFloat(total);
    const shouldTTS = numericTotal >= 1 || preferredName.toLowerCase() === "tester";
    if (shouldTTS) {
      const ttsText = `${preferredName} spent ${total} dollars and requested ${requestText}`;
      speakInVoiceChannel(ttsText)
        .then(() => console.log("✅ TTS played"))
        .catch(err => console.error("⚠️ TTS failed:", err.message));
    }

    return res.json({ success: true, preferredName });
  } catch (err) {
    console.error("❌ Request notification error:", err.message);
    return res.status(500).json({ error: "Failed to send notification" });
  }
});

// ── Checkout page generator (Paddle overlay) ─────────────────────────

function checkoutPageHtml({ priceId, customData, successPath, cancelPath }) {
  const origin = CHECKOUT_ORIGIN || "";
  const successUrl = `${origin}${successPath}`;
  const cancelUrl = `${origin}${cancelPath || "/"}`;
  const envLine = PADDLE_ENV === "sandbox"
    ? `Paddle.Environment.set("sandbox");`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Checkout – Kaimatsu</title>
  <script src="https://cdn.paddle.com/paddle/v2/paddle.js"><\/script>
  <style>
    body{margin:0;min-height:100dvh;display:flex;align-items:center;justify-content:center;background:#0a0a0f;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
    .msg{text-align:center;padding:20px}
    .spinner{display:inline-block;width:40px;height:40px;border:4px solid rgba(139,92,246,0.2);border-top-color:#8b5cf6;border-radius:50%;animation:spin .7s linear infinite;margin-bottom:16px}
    @keyframes spin{to{transform:rotate(360deg)}}
  </style>
</head>
<body>
  <div class="msg">
    <div class="spinner"></div>
    <p>Loading checkout…</p>
  </div>
  <script>
    ${envLine}
    Paddle.Initialize({
      token: ${JSON.stringify(PADDLE_CLIENT_TOKEN)},
      eventCallback: function(ev) {
        if (ev.name === "checkout.completed") {
          window.location.href = ${JSON.stringify(successUrl)} + "?txn=" + ev.data.transaction_id;
        }
        if (ev.name === "checkout.closed") {
          window.location.href = ${JSON.stringify(cancelUrl)};
        }
      }
    });
    Paddle.Checkout.open({
      items: [{ priceId: ${JSON.stringify(priceId)}, quantity: 1 }],
      customData: ${JSON.stringify(customData)},
      settings: { displayMode: "overlay", theme: "dark" }
    });
  <\/script>
</body>
</html>`;
}

// ── Instant checkout routes ──────────────────────────────────────────

const ALLOWED_TIERS = new Set(["basic", "premium"]);

app.get("/yard/:tier", (req, res) => {
  const tier = req.params.tier.toLowerCase();
  if (!ALLOWED_TIERS.has(tier)) return res.status(404).send("Not found");

  const priceId = PRICES[tier];
  if (!priceId) return res.status(500).send(`Server misconfigured: ${tier.toUpperCase()}_PRICE_ID not set.`);

  const ref = (req.query.ref || "").toString().trim();
  res.send(checkoutPageHtml({
    priceId,
    customData: { endpoint: "yard", tier, ...(ref ? { ref } : {}) },
    successPath: `/yard/${tier}/success`,
    cancelPath: "/",
  }));
});

app.get("/test", (req, res) => {
  const priceId = PRICES.test;
  if (!priceId) return res.status(500).send("Server misconfigured: TEST_PRICE_ID not set.");
  res.send(checkoutPageHtml({
    priceId,
    customData: { endpoint: "test", tier: "premium" },
    successPath: "/yard/premium/success",
    cancelPath: "/test",
  }));
});

app.get("/customaccess", (req, res) => {
  const priceId = PRICES.customaccess;
  if (!priceId) return res.status(500).send("Server misconfigured: CUSTOMACCESS_PRICE_ID not set.");
  res.send(checkoutPageHtml({
    priceId,
    customData: { endpoint: "customaccess", tier: "customaccess" },
    successPath: "/customaccess/success",
    cancelPath: "/",
  }));
});

app.get("/request", (req, res) => {
  const preferredName = (req.query.name || "").toString().trim();
  const requestText = (req.query.request || "").toString().trim();
  if (!preferredName) return res.status(400).send("Preferred name is required");
  if (!requestText) return res.status(400).send("Request is required");
  if (requestText.length > 60) return res.status(400).send("Request must be 60 characters or less");

  const priceId = PRICES.request;
  if (!priceId) return res.status(500).send("Server misconfigured: REQUEST_PRICE_ID not set.");
  res.send(checkoutPageHtml({
    priceId,
    customData: { endpoint: "request", tier: "request", preferredName, requestText },
    successPath: "/request/success",
    cancelPath: "/",
  }));
});

// ── Success pages ────────────────────────────────────────────────────
app.get("/yard/:tier/success", (req, res) => {
  res.sendFile(path.join(rootDir, "yard-success.html"));
});

app.get("/customaccess/success", (req, res) => {
  res.sendFile(path.join(rootDir, "customaccess-success.html"));
});

app.get("/request/success", (req, res) => {
  res.sendFile(path.join(rootDir, "request-success.html"));
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(rootDir, "success.html"));
});

// ── Health check ─────────────────────────────────────────────────────
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

// ── Discord.js client for voice channel TTS ─────────────────────────
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

let discordReady = false;
discordClient.once("ready", () => {
  console.log(`🤖 Discord bot logged in as ${discordClient.user.tag}`);
  discordReady = true;
});

discordClient.on("error", (err) => {
  console.error("❌ Discord client error:", err.message);
});

if (BOT_TOKEN) {
  discordClient.login(BOT_TOKEN).catch(err => {
    console.error("⚠️ Discord bot login failed:", err.message);
  });
} else {
  console.warn("⚠️ BOT_TOKEN not set — voice TTS will not work");
}

async function speakInVoiceChannel(text) {
  if (!discordReady) throw new Error("Discord bot not ready");

  const guild = discordClient.guilds.cache.get(GUILD_ID);
  if (!guild) throw new Error(`Guild ${GUILD_ID} not found in cache`);

  const voiceChannel = guild.channels.cache.get(REQUEST_VC_CHANNEL_ID);
  if (!voiceChannel) throw new Error(`Voice channel ${REQUEST_VC_CHANNEL_ID} not found`);

  const ttsUrl = googleTTS.getAudioUrl(text, {
    lang: "en",
    slow: false,
    host: "https://translate.google.com",
  });

  const fs = require("fs");
  const os = require("os");
  const { spawn } = require("child_process");
  const tmpFile = path.join(os.tmpdir(), `tts-${Date.now()}.mp3`);
  const audioRes = await fetch(ttsUrl);
  if (!audioRes.ok) throw new Error(`Google TTS fetch failed: ${audioRes.status}`);
  const arrayBuf = await audioRes.arrayBuffer();
  fs.writeFileSync(tmpFile, Buffer.from(arrayBuf));

  const connection = joinVoiceChannel({
    channelId: REQUEST_VC_CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });

  await entersState(connection, VoiceConnectionStatus.Ready, 10_000);

  const ffmpeg = spawn(ffmpegPath, [
    "-i", tmpFile, "-f", "s16le", "-ar", "48000", "-ac", "2", "pipe:1",
  ]);

  const player = createAudioPlayer();
  const resource = createAudioResource(ffmpeg.stdout, { inputType: StreamType.Raw });
  player.play(resource);
  connection.subscribe(player);

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      try { connection.destroy(); } catch {}
      try { ffmpeg.kill(); } catch {}
      try { fs.unlinkSync(tmpFile); } catch {}
    };
    player.on(AudioPlayerStatus.Idle, () => { cleanup(); resolve(); });
    player.on("error", (err) => { cleanup(); reject(err); });
    setTimeout(() => { cleanup(); resolve(); }, 30_000);
  });
}

// ── Start ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Checkout server running on port ${PORT}`);
  console.log(`💳 Payment provider: Paddle (${PADDLE_ENV})`);
  console.log(`🌐 CHECKOUT_ORIGIN: ${CHECKOUT_ORIGIN || "(not set)"}`);
  console.log(`📦 Basic price:   ${PRICES.basic || "⚠️  NOT SET"}`);
  console.log(`📦 Premium price: ${PRICES.premium || "⚠️  NOT SET"}`);
  console.log(`📦 Test price:    ${PRICES.test || "⚠️  NOT SET"}`);
});
