require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;
const MAIN_SITE_ORIGIN = (process.env.MAIN_SITE_ORIGIN || "https://omeglepay.xyz").replace(/\/+$/, "");

const PRODUCTS = {
  basic:   process.env.BASIC_PRODUCT_ID,
  premium: process.env.PREMIUM_PRODUCT_ID,
};

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

app.listen(PORT, () => {
  console.log(`🚀 Checkout server running on port ${PORT}`);
  console.log(`🌐 ${DOMAIN}`);
  console.log(`📦 Basic product:   ${PRODUCTS.basic   || "⚠️  NOT SET"}`);
  console.log(`📦 Premium product: ${PRODUCTS.premium || "⚠️  NOT SET"}`);
});
