const axios = require('axios');

exports.estimateShipping = async (params) => {
  try {
    const { from, to, weight = 1, dimensions = null } = params;

    // Default shipping rates by state
    const shippingRates = {
      'Gujarat': { 'Delhi': 180, 'Mumbai': 120, 'Bangalore': 200, 'Chennai': 220, 'Kolkata': 250 },
      'default': { 'default': 200 }
    };

    // Calculate shipping cost
    let cost = 200; // Default
    let days = 5; // Default

    if (shippingRates[from] && shippingRates[from][to]) {
      cost = shippingRates[from][to];
      days = cost <= 150 ? 3 : 5;
    } else if (shippingRates['default']) {
      cost = shippingRates['default']['default'];
      days = 7;
    }

    // Add weight factor
    if (weight > 1) {
      cost += (weight - 1) * 50;
    }

    return {
      cost: Math.round(cost),
      currency: 'INR',
      estimatedDays: days,
      from: from,
      to: to,
      weight: weight,
      deliveryOptions: [
        { name: 'Standard', cost: cost, days: days },
        { name: 'Express', cost: cost * 1.5, days: Math.max(1, days - 2) }
      ]
    };
  } catch (error) {
    console.error('Shipping service error:', error);
    return {
      cost: 200,
      currency: 'INR',
      estimatedDays: 5,
      error: 'Unable to calculate shipping'
    };
  }
};