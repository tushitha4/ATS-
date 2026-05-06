import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = constructWebhookEvent(body, sig);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      console.log(`✅ Pro subscription activated for user: ${userId}`);
      console.log(`   Stripe Customer: ${customerId}`);
      console.log(`   Subscription ID: ${subscriptionId}`);

      // TODO: Update your database here
      // await db.user.update({ where: { id: userId }, data: { tier: "pro", stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId } });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      const customerId = sub.customer;
      console.log(`❌ Subscription cancelled for customer: ${customerId}`);
      // TODO: Downgrade user to free tier in your database
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as any;
      console.log(`⚠️ Payment failed for customer: ${invoice.customer}`);
      // TODO: Notify user and handle retry logic
      break;
    }

    default:
      console.log(`Unhandled webhook event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
