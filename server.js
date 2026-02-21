require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;

const PRODUCTS = {
  basic:   process.env.BASIC_PRODUCT_ID,
  premium: process.env.PREMIUM_PRODUCT_ID,
};

const rootDir = path.resolve(__dirname);

app.use(express.static(rootDir));

// ── Instant checkout redirect ─────────────────────────────────────────
async function instantCheckout(tier, req, res) {
  const productId = PRODUCTS[tier];

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

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { tier },
      success_url: `${DOMAIN}/success?tier=${tier}`,
      cancel_url:  `${DOMAIN}/`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error(`❌ Checkout error (${tier}):`, err.message);
    res.status(500).send("Failed to create checkout session: " + err.message);
  }
}

app.get("/basic",   (req, res) => instantCheckout("basic",   req, res));
app.get("/premium", (req, res) => instantCheckout("premium", req, res));

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
