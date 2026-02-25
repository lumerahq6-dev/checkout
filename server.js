require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");
const crypto = require("crypto");
const { Readable } = require("stream");
const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState, StreamType, generateDependencyReport } = require("@discordjs/voice");
const googleTTS = require("google-tts-api");

// Point prism-media / @discordjs/voice at the bundled ffmpeg binary
const ffmpegPath = process.env.FFMPEG_PATH || require("ffmpeg-static");

const app = express();
const PORT = process.env.PORT || 4000;
const DOMAIN = (process.env.DOMAIN || "").replace(/\/+$/, "");
const MAIN_SITE_ORIGIN = (process.env.MAIN_SITE_ORIGIN || "https://omeglepay.xyz").replace(/\/+$/, "");
const OMEGLEPAY_ORIGIN = (process.env.OMEGLEPAY_ORIGIN || "https://omeglepay.xyz").replace(/\/+$/, "");
// Public URL of THIS checkout server (required so success URLs are never localhost)
const CHECKOUT_ORIGIN = (process.env.CHECKOUT_ORIGIN || process.env.DOMAIN || "").replace(/\/+$/, "");

const CUSTOMACCESS_TEST_PRODUCT_ID = process.env.CUSTOMACCESS_TEST_PRODUCT_ID || "prod_U1UD0G3lkaYLxf";
const REQUEST_PRICE_ID = "price_1T4ZacHEVolaZx25l8lMR9KP";
const REQUEST_VC_CHANNEL_ID = "1475001455298478132";
const REQUEST_PRODUCT_ID = process.env.REQUEST_PRODUCT_ID || "prod_U1v89duV551rGi";
const CHECKOUT_SECRET = process.env.CHECKOUT_SECRET || "";

app.set("trust proxy", true);

function getPublicOrigin(req) {
  if (DOMAIN) return DOMAIN;
  const forwardedProto = (req.headers["x-forwarded-proto"] || "").toString().split(",")[0].trim();
  const proto = forwardedProto || req.protocol || "https";
  const forwardedHost = (req.headers["x-forwarded-host"] || "").toString().split(",")[0].trim();
  const host = forwardedHost || req.get("host");
  return `${proto}://${host}`.replace(/\/+$/, "");
}

function generateAccessKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  const bytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) key += chars[bytes[i] % chars.length];
  return key;
}

const PRODUCTS = {
  basic:   process.env.BASIC_PRODUCT_ID,
  premium: process.env.PREMIUM_PRODUCT_ID,
  test:    process.env.TEST_PRODUCT_ID,
  customaccess: process.env.CUSTOMACCESS_PRODUCT_ID || "prod_U1vLTDg4tLyXxR",
};

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const GUILD_ID  = process.env.GUILD_ID  || "1472050464659865742";
const ROLE_ID   = process.env.ROLE_ID   || "1475133268931252315";

const DISCORD_WEBHOOK_URL =
  process.env.DISCORD_WEBHOOK_URL ||
  "https://canary.discord.com/api/webhooks/1471629017869455491/EOwPBvSUuWYs-GzPm8Pix2P4Cgzb-FxzilH4WaZhOMGD2OXcmg4-bhCZ24XOhV0Ejair";

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

const ALLOWED_ENDPOINTS = new Set(["yard"]);
const ALLOWED_TIERS = new Set(["basic", "premium"]);

const rootDir = path.resolve(__dirname);

// ── Stripe webhook (raw body — must be before static/json middleware) ─
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const tier = session.metadata?.tier || "n/a";
      const endpointKey = session.metadata?.endpoint || "n/a";
      const amountTotal = typeof session.amount_total === "number" ? session.amount_total : null;
      const currency = session.currency ? session.currency.toUpperCase() : null;
      const amountText = amountTotal === null
        ? "n/a"
        : `${(amountTotal / 100).toFixed(2)} ${currency || ""}`.trim();
      const paymentMethod = session.payment_method_types?.[0] || "card";

      console.log("✅ Payment successful!", { tier, endpoint: endpointKey });

      try {
        await sendDiscordWebhook({
          embeds: [{
            title: "💸 Payment Successful",
            color: 0x00c853,
            fields: [
              { name: "Endpoint", value: endpointKey, inline: true },
              { name: "Tier", value: tier, inline: true },
              { name: "Amount", value: amountText, inline: true },
              { name: "Payment Method", value: paymentMethod, inline: true },
            ],
            timestamp: new Date().toISOString(),
          }],
        });
      } catch (err) {
        console.error("❌ Failed to send Discord webhook:", err.message);
      }
    }

    res.json({ received: true });
  }
);

app.use(express.static(rootDir));

// ── /api/claim-key — called by success page to get access key ───────
app.options("/api/claim-key", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.sendStatus(204);
});

app.post("/api/claim-key", express.json(), async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId is required" });

  // Retry up to 4x waiting for Stripe to confirm payment
  let lastErr = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        if (attempt < 3) { await new Promise(r => setTimeout(r, 2000)); continue; }
        return res.status(402).json({ error: "Payment not completed" });
      }

      const tier = session.metadata?.tier || "basic";
      const key = generateAccessKey();

      // Persist the key on omeglepay so the main site can redeem it
      if (CHECKOUT_SECRET && OMEGLEPAY_ORIGIN) {
        try {
          await fetch(`${OMEGLEPAY_ORIGIN}/api/store-key`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, tier, sessionId, checkoutSecret: CHECKOUT_SECRET }),
          });
        } catch (storeErr) {
          console.error("⚠️ Failed to store key on omeglepay:", storeErr.message);
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

// ── /test → instant checkout with TEST_PRODUCT_ID (premium tier) ────
app.get("/test", async (req, res) => {
  const productId = PRODUCTS.test;
  if (!productId) {
    console.error("❌ Missing TEST_PRODUCT_ID in .env");
    return res.status(500).send("Server misconfigured: TEST_PRODUCT_ID is not set.");
  }

  try {
    const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });
    const price = prices.data[0];
    if (!price) return res.status(500).send(`No active price found for test product ${productId}.`);

    const mode = price.type === "recurring" ? "subscription" : "payment";
    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { endpoint: "test", tier: "premium" },
      success_url: `${MAIN_SITE_ORIGIN}/yard/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${getPublicOrigin(req)}/test`,
    });
    res.redirect(303, session.url);
  } catch (err) {
    console.error("❌ Test checkout error:", err.message);
    res.status(500).send("Failed to create test checkout session: " + err.message);
  }
});

// ── /customaccess → Stripe checkout for Discord role grant ──────────
app.get("/customaccess", async (req, res) => {
  const origin = CHECKOUT_ORIGIN || getPublicOrigin(req);
  if (!CHECKOUT_ORIGIN) {
    console.warn("⚠️  CHECKOUT_ORIGIN not set — success URL may use localhost. Set CHECKOUT_ORIGIN in .env");
  }
  const productId = PRODUCTS.customaccess;
  try {
    const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });
    const price = prices.data[0];
    if (!price) return res.status(500).send(`No active price found for product ${productId}.`);
    const mode = price.type === "recurring" ? "subscription" : "payment";
    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { endpoint: "customaccess", tier: "customaccess" },
      success_url: `${origin}/customaccess/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/`,
    });
    res.redirect(303, session.url);
  } catch (err) {
    console.error("❌ Customaccess checkout error:", err.message);
    res.status(500).send("Failed to create checkout session: " + err.message);
  }
});

// ── /customaccess/test → same as /customaccess but forced test product ───────
app.get("/customaccess/test", async (req, res) => {
  const origin = CHECKOUT_ORIGIN || getPublicOrigin(req);
  if (!CHECKOUT_ORIGIN) {
    console.warn("⚠️  CHECKOUT_ORIGIN not set — success URL may use localhost. Set CHECKOUT_ORIGIN in .env");
  }

  const productId = CUSTOMACCESS_TEST_PRODUCT_ID;
  try {
    const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });
    const price = prices.data[0];
    if (!price) return res.status(500).send(`No active price found for product ${productId}.`);
    const mode = price.type === "recurring" ? "subscription" : "payment";

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { endpoint: "customaccess", tier: "customaccess", test: "1" },
      success_url: `${origin}/customaccess/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });
    res.redirect(303, session.url);
  } catch (err) {
    console.error("❌ Customaccess test checkout error:", err.message);
    res.status(500).send("Failed to create checkout session: " + err.message);
  }
});

app.get("/customaccess/success", (req, res) => {
  res.sendFile(path.join(rootDir, "customaccess-success.html"));
});

// ── /request → instantly queue Stripe checkout (form lives on omeglepay) ──────
app.get("/request", async (req, res) => {
  const preferredName = (req.query.name || "").toString().trim();
  const requestText   = (req.query.request || "").toString().trim();
  if (!preferredName) return res.status(400).send("Preferred name is required");
  if (!requestText)   return res.status(400).send("Request is required");
  if (requestText.length > 60) return res.status(400).send("Request must be 60 characters or less");

  try {
    const price = await stripe.prices.retrieve(REQUEST_PRICE_ID);
    const mode = price.type === "recurring" ? "subscription" : "payment";

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: REQUEST_PRICE_ID, quantity: 1 }],
      metadata: { endpoint: "request", tier: "request", preferredName, requestText },
      success_url: `${MAIN_SITE_ORIGIN}/request/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${MAIN_SITE_ORIGIN}/request`,
    });
    res.redirect(303, session.url);
  } catch (err) {
    console.error("❌ Request checkout error:", err.message);
    res.status(500).send("Failed to create checkout session: " + err.message);
  }
});

app.post("/api/send-request-notification", express.json(), async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId is required" });

  // Verify payment with retry
  let session;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        if (attempt < 3) { await new Promise(r => setTimeout(r, 1500)); continue; }
        return res.status(402).json({ error: "Payment not completed" });
      }
      break;
    } catch (err) {
      if (attempt < 3) { await new Promise(r => setTimeout(r, 1500)); continue; }
      console.error("❌ send-request-notification stripe error:", err.message);
      return res.status(500).json({ error: "Failed to verify payment" });
    }
  }

  const preferredName = session.metadata?.preferredName || "Unknown";
  const requestText = session.metadata?.requestText || "";
  const amountTotal = typeof session.amount_total === "number" ? session.amount_total : null;
  const currency = session.currency ? session.currency.toUpperCase() : "USD";
  const amountText = amountTotal !== null
    ? `$${(amountTotal / 100).toFixed(2)} ${currency}`
    : "(unknown amount)";
  const amountDollars = amountTotal !== null ? (amountTotal / 100).toFixed(2) : "unknown";
  const channelId = "1475355092323667968";

  // Send embed to Discord channel using bot token
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
      console.error("❌ Discord message send error:", messageRes.status, errText);
      return res.status(500).json({ error: "Failed to send Discord notification" });
    }

    console.log(`✅ Custom request notification sent for ${preferredName}`);

    // Join voice channel and TTS announce (skip if under $1 unless name is "tester")
    // Fire-and-forget so the HTTP response is not blocked by TTS playback
    const shouldTTS = (amountTotal !== null && amountTotal >= 100) || preferredName.toLowerCase() === "tester";
    if (shouldTTS) {
      const ttsText = `${preferredName} spent ${amountDollars} dollars and requested ${requestText}`;
      speakInVoiceChannel(ttsText)
        .then(() => console.log("✅ TTS announcement played in voice channel"))
        .catch(vcErr => console.error("⚠️ Voice channel TTS failed (non-fatal):", vcErr.message));
    } else {
      console.log(`⏭️ Skipping TTS — amount $${amountDollars} is under $1 and name is not "tester"`);
    }

    return res.json({ success: true, preferredName });
  } catch (err) {
    console.error("❌ Failed to send request notification:", err.message);
    return res.status(500).json({ error: "Failed to send notification" });
  }
});

app.options("/api/send-request-notification", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.sendStatus(204);
});

app.get("/api/verify-session", async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });
  // Retry up to 4x to handle Stripe's brief post-redirect delay
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") return res.json({ paid: true });
      if (attempt < 3) { await new Promise(r => setTimeout(r, 1500)); continue; }
      return res.status(402).json({ paid: false });
    } catch (err) {
      if (attempt < 3) { await new Promise(r => setTimeout(r, 1500)); continue; }
      return res.status(500).json({ error: err.message });
    }
  }
});

// ── /api/grant-discord-role — verify payment, find user, assign role ─
app.post("/api/grant-discord-role", express.json(), async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const { sessionId, discordUsername } = req.body || {};
  if (!sessionId || !discordUsername)
    return res.status(400).json({ error: "sessionId and discordUsername are required" });

  const username = String(discordUsername).trim().replace(/^@/, "");
  if (!username) return res.status(400).json({ error: "Invalid Discord username" });

  // Verify payment with Stripe
  let session;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        if (attempt < 3) { await new Promise(r => setTimeout(r, 2000)); continue; }
        return res.status(402).json({ error: "Payment not completed" });
      }
      break;
    } catch (err) {
      if (attempt < 3) { await new Promise(r => setTimeout(r, 2000)); continue; }
      console.error("❌ grant-discord-role stripe error:", err.message);
      return res.status(500).json({ error: "Failed to verify payment" });
    }
  }

  const discordBase = "https://discord.com/api/v10";
  const headers = {
    Authorization: `Bot ${BOT_TOKEN}`,
    "Content-Type": "application/json",
    "X-Audit-Log-Reason": "CustomAccess purchase",
  };

  // Search guild members by username
  let memberId = null;
  try {
    const searchRes = await fetch(
      `${discordBase}/guilds/${GUILD_ID}/members/search?query=${encodeURIComponent(username)}&limit=10`,
      { headers }
    );
    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error("❌ Discord member search error:", searchRes.status, errText);
      return res.status(500).json({ error: "Failed to search guild members. Is the bot in the server?" });
    }
    const members = await searchRes.json();
    // Find exact match on username or global_name (case-insensitive)
    const lower = username.toLowerCase();
    const match = members.find(m =>
      (m.user.username || "").toLowerCase() === lower ||
      (m.user.global_name || "").toLowerCase() === lower ||
      (m.nick || "").toLowerCase() === lower
    );
    if (!match) {
      return res.status(404).json({ error: `Discord user "${username}" not found in the server. Make sure you've joined the server first and your username is correct.` });
    }
    memberId = match.user.id;
  } catch (err) {
    console.error("❌ Discord search fetch error:", err.message);
    return res.status(500).json({ error: "Network error contacting Discord" });
  }

  // Grant the role
  try {
    const roleRes = await fetch(
      `${discordBase}/guilds/${GUILD_ID}/members/${memberId}/roles/${ROLE_ID}`,
      { method: "PUT", headers }
    );
    if (!roleRes.ok && roleRes.status !== 204) {
      const errText = await roleRes.text();
      console.error("❌ Discord role grant error:", roleRes.status, errText);
      return res.status(500).json({ error: "Failed to assign role. Please contact support." });
    }
  } catch (err) {
    console.error("❌ Discord role fetch error:", err.message);
    return res.status(500).json({ error: "Network error assigning role" });
  }

  // Notify Discord webhook
  try {
    await sendDiscordWebhook({
      embeds: [{
        title: "🎉 CustomAccess Role Granted",
        color: 0x7c3aed,
        fields: [
          { name: "Discord Username", value: username, inline: true },
          { name: "User ID", value: memberId, inline: true },
          { name: "Session", value: sessionId, inline: false },
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

app.options("/api/grant-discord-role", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.sendStatus(204);
});

// ── Instant checkout redirect /:endpoint/:tier ──────────────────────
app.get("/:endpoint/:tier", async (req, res, next) => {
  const endpoint = req.params.endpoint.toLowerCase();
  const tier = req.params.tier.toLowerCase();

  if (!ALLOWED_ENDPOINTS.has(endpoint) || !ALLOWED_TIERS.has(tier)) return next();

  const productId = PRODUCTS[tier];
  const ref = (req.query.ref || "").toString().trim();

  if (!productId) {
    console.error(`❌ Missing ${tier.toUpperCase()}_PRODUCT_ID in .env`);
    return res.status(500).send(`Server misconfigured: ${tier.toUpperCase()}_PRODUCT_ID is not set.`);
  }

  try {
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 1,
    });

    const price = prices.data[0];
    if (!price) {
      return res.status(500).send(`No active price found for product ${productId}.`);
    }

    const mode = price.type === "recurring" ? "subscription" : "payment";

    const successUrl = `${MAIN_SITE_ORIGIN}/${endpoint}/${tier}/success?session_id={CHECKOUT_SESSION_ID}` +
      (ref ? `&ref=${encodeURIComponent(ref)}` : "");
    const cancelUrl = `${MAIN_SITE_ORIGIN}/?cancelled=1&endpoint=${encodeURIComponent(endpoint)}&tier=${encodeURIComponent(tier)}` +
      (ref ? `&ref=${encodeURIComponent(ref)}` : "");

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { endpoint, tier, ...(ref ? { ref } : {}) },
      success_url: successUrl,
      cancel_url:  cancelUrl,
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error(`❌ Checkout error (${endpoint}/${tier}):`, err.message);
    res.status(500).send("Failed to create checkout session: " + err.message);
  }
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(rootDir, "success.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

// ── /test-tts — temporary test endpoint to verify voice channel TTS ──
app.get("/test-tts", async (req, res) => {
  const text = req.query.text || "Testing text to speech. If you can hear this, it works.";
  const mode = req.query.mode || "tone"; // "tone" or "tts"
  if (!discordReady) return res.status(503).json({ success: false, error: "Discord bot not ready" });
  // Respond immediately, run TTS in background
  res.json({ success: true, message: `TTS triggered (mode=${mode}) — listen in the voice channel` });
  try {
    if (mode === "tone") {
      await playToneInVoiceChannel();
    } else {
      await speakInVoiceChannel(text);
    }
    console.log(`✅ test-tts (${mode}) completed`);
  } catch (err) {
    console.error(`❌ test-tts (${mode}) error:`, err);
  }
});

app.get("/test-tts-status", (req, res) => {
  res.json({
    discordReady,
    botTag: discordReady ? discordClient.user?.tag : null,
    hasBotToken: !!BOT_TOKEN,
    botTokenLength: BOT_TOKEN ? BOT_TOKEN.length : 0,
    guildId: GUILD_ID,
    vcChannelId: REQUEST_VC_CHANNEL_ID,
    guildsInCache: discordClient.guilds?.cache?.size || 0,
    loginError: discordLoginError || null,
  });
});

app.get("/test-tts-diag", (req, res) => {
  res.type("text/plain").send(generateDependencyReport());
});

// ── Discord.js client for voice channel TTS ─────────────────────────
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

let discordReady = false;
let discordLoginError = null;
discordClient.once("ready", () => {
  console.log(`🤖 Discord bot logged in as ${discordClient.user.tag}`);
  discordReady = true;
});

discordClient.on("error", (err) => {
  console.error("❌ Discord client error:", err.message);
  discordLoginError = err.message;
});

// Check for Opus encoder at startup
try {
  const opusCheck = require("opusscript");
  console.log("✅ opusscript Opus encoder found");
} catch {
  console.warn("⚠️ No Opus encoder found — audio will NOT work");
}

if (BOT_TOKEN) {
  discordClient.login(BOT_TOKEN).catch(err => {
    console.error("⚠️ Discord bot login failed:", err.message);
    discordLoginError = err.message;
  });
} else {
  console.warn("⚠️ BOT_TOKEN not set — voice TTS will not work");
}

// ── Generate a test tone via ffmpeg lavfi → OggOpus ────────────────
async function playToneInVoiceChannel() {
  if (!discordReady) throw new Error("Discord bot not ready");

  const guild = discordClient.guilds.cache.get(GUILD_ID);
  if (!guild) throw new Error(`Guild ${GUILD_ID} not found in cache`);

  const { spawn } = require("child_process");

  // Let ffmpeg generate a 3-second 440Hz sine and encode as OggOpus
  const ffmpeg = spawn(ffmpegPath, [
    "-f", "lavfi", "-i", "sine=frequency=440:duration=3:sample_rate=48000",
    "-ac", "2",
    "-c:a", "libopus",
    "-f", "ogg",
    "pipe:1",
  ], { stdio: ["ignore", "pipe", "pipe"] });

  ffmpeg.stderr.on("data", d => console.log("ffmpeg tone stderr:", d.toString()));

  console.log("🔊 Spawned ffmpeg for OggOpus tone generation");

  const connection = joinVoiceChannel({
    channelId: REQUEST_VC_CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });

  await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
  console.log("🔊 Voice connection ready");

  const player = createAudioPlayer();
  const resource = createAudioResource(ffmpeg.stdout, { inputType: StreamType.OggOpus });
  connection.subscribe(player);
  player.play(resource);
  console.log("🔊 Player started, resource type:", resource.playbackDuration);

  player.on("stateChange", (oldState, newState) => {
    console.log(`🎵 Player: ${oldState.status} → ${newState.status}`);
  });
  player.on("error", (err) => {
    console.error("🎵 Player error:", err);
  });

  return new Promise((resolve) => {
    player.on(AudioPlayerStatus.Idle, () => {
      console.log("🔊 Tone playback finished");
      connection.destroy();
      resolve();
    });
    setTimeout(() => {
      try { connection.destroy(); } catch {}
      resolve();
    }, 15_000);
  });
}

async function speakInVoiceChannel(text) {
  if (!discordReady) throw new Error("Discord bot not ready");

  const guild = discordClient.guilds.cache.get(GUILD_ID);
  if (!guild) throw new Error(`Guild ${GUILD_ID} not found in cache`);

  const voiceChannel = guild.channels.cache.get(REQUEST_VC_CHANNEL_ID);
  if (!voiceChannel) throw new Error(`Voice channel ${REQUEST_VC_CHANNEL_ID} not found`);

  // Get TTS audio URL from Google
  const ttsUrl = googleTTS.getAudioUrl(text, {
    lang: "en",
    slow: false,
    host: "https://translate.google.com",
  });

  // Download to a temp MP3 file
  const fs = require("fs");
  const os = require("os");
  const { spawn } = require("child_process");
  const tmpFile = path.join(os.tmpdir(), `tts-${Date.now()}.mp3`);
  const audioRes = await fetch(ttsUrl);
  if (!audioRes.ok) throw new Error(`Google TTS fetch failed: ${audioRes.status}`);
  const arrayBuf = await audioRes.arrayBuffer();
  fs.writeFileSync(tmpFile, Buffer.from(arrayBuf));
  console.log(`🔊 TTS audio saved: ${tmpFile} (${arrayBuf.byteLength} bytes, ffmpeg: ${ffmpegPath})`);

  // Join the voice channel (undeafened + unmuted)
  const connection = joinVoiceChannel({
    channelId: REQUEST_VC_CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });

  // Wait for the connection to be ready
  await entersState(connection, VoiceConnectionStatus.Ready, 10_000);

  // Spawn ffmpeg to convert MP3 → raw s16le PCM at 48kHz stereo (Discord format)
  const ffmpeg = spawn(ffmpegPath, [
    "-i", tmpFile,
    "-f", "s16le",
    "-ar", "48000",
    "-ac", "2",
    "pipe:1",
  ]);

  ffmpeg.stderr.on("data", (d) => console.log("ffmpeg:", d.toString().trim()));

  // Create audio player and play raw PCM stream
  const player = createAudioPlayer();
  const resource = createAudioResource(ffmpeg.stdout, { inputType: StreamType.Raw });
  player.play(resource);
  connection.subscribe(player);

  // Wait for the audio to finish, then disconnect and clean up
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      try { connection.destroy(); } catch {}
      try { ffmpeg.kill(); } catch {}
      try { fs.unlinkSync(tmpFile); } catch {}
    };
    player.on(AudioPlayerStatus.Idle, () => { cleanup(); resolve(); });
    player.on("error", (err) => { cleanup(); reject(err); });
    // Safety timeout: disconnect after 30s no matter what
    setTimeout(() => { cleanup(); resolve(); }, 30_000);
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Checkout server running on port ${PORT}`);
  console.log(`🌐 DOMAIN: ${DOMAIN || "(derived from request)"}`);
  console.log(`📦 Basic product:   ${PRODUCTS.basic   || "⚠️  NOT SET"}`);
  console.log(`📦 Premium product: ${PRODUCTS.premium || "⚠️  NOT SET"}`);
  console.log(`📦 Test product:    ${PRODUCTS.test    || "⚠️  NOT SET"}`);
  if (!CHECKOUT_ORIGIN) {
    console.warn("⚠️  CHECKOUT_ORIGIN is not set — /customaccess success URLs will fall back to request-derived origin (may be localhost). Set CHECKOUT_ORIGIN=https://your-checkout-domain.com in .env");
  } else {
    console.log(`🌐 CHECKOUT_ORIGIN: ${CHECKOUT_ORIGIN}`);
  }
});
