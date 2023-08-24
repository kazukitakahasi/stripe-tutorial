const express = require("express");
const app = express();
const PORT = 3000;
// This is your test secret API key. /本番環境では値を見れないようにする
const stripe = require("stripe")('sk_test_51NiWzoKqr7G5Tsol7FhDij9fEsnBiTmYnyS4NX4kgQOrtprZQMHNN1q4Rl1dlrCb9tCjG1bqMuA4hqgvYV4298AO007c0Ytzuw');

const YOUR_DOMAIN = "http://localhost:3000"; //httpsではなくhttpにする

app.use(express.static("public"));

app.post("/create-checkout-session", async (req, res) => {
  try {
    // stripeと連携する
    const prices = await stripe.prices.list();
    // console.log(prices);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1
        }
      ],
      mode: "subscription",
      success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`
    });
    // console.log(session, 'session');
    res.redirect(303, session.url);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, console.log("サーバーが起動しました"));