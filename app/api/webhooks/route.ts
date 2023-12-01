import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/libs/stripe";
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
} from "@/libs/supabaseAdmin";
import { error } from "console";

const releventEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  // 'invoice.paid',
  // 'invoice.payment_failed',
  // 'customer.subscription.trial_will_end',
]);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      return;
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`⚠️ Webhook signature verification failed.`, err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (releventEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          const product = event.data.object as Stripe.Product;
          await upsertProductRecord(product);
          break;
        case "price.created":
        case "price.updated":
          const price = event.data.object as Stripe.Price;
          await upsertPriceRecord(price);
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        default:
          throw new Error("Unhandled relevant event.");
      }
    } catch (err: any) {
      console.log(`⚠️ Webhook handler failed.`, err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
