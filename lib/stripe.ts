import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export const STRIPE_PLANS = {
  pro_monthly: {
    name: "CareerForge Pro",
    price: 1900, // $19/month in cents
    interval: "month" as const,
    features: [
      "Unlimited resume generations",
      "AI-powered bullet rewriting",
      "ATS score optimization",
      "Premium templates (Classic, Modern, Creative)",
      "Cover letter generator",
      "PDF export",
      "Resume dashboard",
    ],
  },
};

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: userEmail,
    metadata: { userId },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "CareerForge Pro",
            description: "Unlimited resumes, AI rewriting, premium templates",
          },
          unit_amount: STRIPE_PLANS.pro_monthly.price,
          recurring: { interval: STRIPE_PLANS.pro_monthly.interval },
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

export function constructWebhookEvent(payload: string | Buffer, sig: string) {
  return stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
