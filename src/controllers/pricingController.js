const PricingRule = require('../models/PricingRule');
const { estimatePrice } = require('../services/pricingService');
const { estimateShipping } = require('../services/shippingService');
const logger = require('../middleware/logger');

// Get all pricing rules (Admin only)
exports.getAllRules = async (req, res) => {
  try {
    const rules = await PricingRule.find().sort({ priority: 1 });
    res.json({
      status: 'success',
      data: { rules }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create pricing rule (Admin only)
exports.createRule = async (req, res) => {
  try {
    const rule = await PricingRule.create(req.body);
    logger.info('Pricing rule created', { ruleId: rule._id });
    res.status(201).json({
      status: 'success',
      data: { rule }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update pricing rule (Admin only)
exports.updateRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!rule) {
      return res.status(404).json({
        status: 'error',
        message: 'Pricing rule not found'
      });
    }

    logger.info('Pricing rule updated', { ruleId: rule._id });
    res.json({
      status: 'success',
      data: { rule }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete pricing rule (Admin only)
exports.deleteRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndDelete(req.params.id);

    if (!rule) {
      return res.status(404).json({
        status: 'error',
        message: 'Pricing rule not found'
      });
    }

    logger.info('Pricing rule deleted', { ruleId: rule._id });
    res.json({
      status: 'success',
      message: 'Pricing rule deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Calculate price
exports.calculatePrice = async (req, res) => {
  try {
    const { material, pattern, quantity, complexity } = req.body;

    if (!material || !pattern) {
      return res.status(400).json({
        status: 'error',
        message: 'Material and pattern are required'
      });
    }

    const price = await estimatePrice({
      material,
      pattern,
      quantity: quantity || 1,
      complexity: complexity || 'medium'
    });

    res.json({
      status: 'success',
      data: price
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Calculate shipping
exports.calculateShipping = async (req, res) => {
  try {
    const { from, to, weight } = req.body;

    if (!to) {
      return res.status(400).json({
        status: 'error',
        message: 'Destination is required'
      });
    }

    const shipping = await estimateShipping({
      from: from || 'Gujarat',
      to,
      weight: weight || 1
    });

    res.json({
      status: 'success',
      data: shipping
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Calculate full estimate (price + shipping)
exports.calculateFullEstimate = async (req, res) => {
  try {
    const { material, pattern, quantity, complexity, from, to } = req.body;

    const [price, shipping] = await Promise.all([
      estimatePrice({ material, pattern, quantity, complexity }),
      estimateShipping({ from: from || 'Gujarat', to })
    ]);

    const total = (price.total || 0) + (shipping.cost || 0);

    res.json({
      status: 'success',
      data: {
        total,
        currency: 'INR',
        breakdown: {
          price,
          shipping
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};