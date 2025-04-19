import Stripe from 'stripe';
import config from './index';

export const stripe = new Stripe(config.stripe.stripeSecretKey as string, {
  apiVersion: '2025-03-31.basil',
});
