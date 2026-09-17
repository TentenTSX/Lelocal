import Stripe from "stripe";

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(apiKey);
};

const createPaymentIntent = async (amount: number) => {
  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "eur",
  });

  return paymentIntent.client_secret;
};

export default { createPaymentIntent };
