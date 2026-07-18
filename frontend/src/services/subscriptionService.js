import { PLANS } from '../data/plans.js';

/**
 * Subscription service — PLACEHOLDER for a future /api/subscriptions module.
 * Returns the static plan catalogue for now.
 */
const subscriptionService = {
  async plans() {
    return PLANS;
  },
};

export default subscriptionService;
