const PricingRule = require('../models/PricingRule');
const Material = require('../models/Material');

exports.estimatePrice = async (params) => {
  try {
    const { material, pattern, quantity = 1, complexity = 'medium' } = params;

    // Get material price
    const materialData = await Material.findOne({ name: material });
    const materialPrice = materialData ? materialData.pricePerMeter : 0;

    // Get pricing rules
    const rules = await PricingRule.find({
      'applicability.isActive': true
    });

    let total = 0;
    let breakdown = {};

    // Material cost
    const materialCost = materialPrice * quantity;
    total += materialCost;
    breakdown.materialCost = materialCost;

    // Printing cost (based on complexity)
    let printingCost = 0;
    const printingRule = rules.find(r => r.category === 'printing');
    if (printingRule) {
      if (complexity === 'low') printingCost = 200;
      else if (complexity === 'medium') printingCost = 350;
      else printingCost = 500;
      
      total += printingCost * quantity;
      breakdown.printingCost = printingCost;
    }

    // Artisan cost
    const artisanRule = rules.find(r => r.category === 'artisan');
    if (artisanRule) {
      const artisanCost = 500 * quantity;
      total += artisanCost;
      breakdown.artisanCost = artisanCost;
    }

    // GST (5%)
    const taxRule = rules.find(r => r.category === 'tax');
    if (taxRule) {
      const gst = total * 0.05;
      total += gst;
      breakdown.gst = gst;
    }

    return {
      total: Math.round(total),
      currency: 'INR',
      breakdown: breakdown,
      breakdownDetails: {
        material: `${material} @ ₹${materialPrice}/meter`,
        printing: `${printingCost} per piece`,
        artisan: '₹500 per piece',
        gst: '5%'
      }
    };
  } catch (error) {
    console.error('Pricing service error:', error);
    return {
      total: 0,
      currency: 'INR',
      breakdown: {},
      error: 'Unable to calculate price'
    };
  }
};