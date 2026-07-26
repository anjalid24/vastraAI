const Design = require('../models/Design');
const Pattern = require('../models/Pattern');
const Material = require('../models/Material');
const { authenticateDesign } = require('../services/authenticityService');
const { estimatePrice } = require('../services/pricingService');
const { estimateShipping } = require('../services/shippingService');
const logger = require('../middleware/logger');

// Generate AI design with advanced options
exports.generateWithAI = async (req, res) => {
  try {
    const {
      patternId,
      materialId,
      prompt,
      negativePrompt,
      referenceImage,
      seed,
      steps,
      cfg,
      width,
      height,
      loraModels,
      sampler,
      isCommercial
    } = req.body;

    // Check generation limit
    const user = req.user;
    if (!user.canGenerateDesign()) {
      return res.status(403).json({
        status: 'error',
        message: 'Generation limit reached. Please upgrade your plan.'
      });
    }

    // Validate pattern
    const pattern = await Pattern.findById(patternId);
    if (!pattern) {
      return res.status(404).json({
        status: 'error',
        message: 'Pattern not found'
      });
    }

    // Validate material
    let material = null;
    if (materialId) {
      material = await Material.findById(materialId);
      if (!material) {
        return res.status(404).json({
          status: 'error',
          message: 'Material not found'
        });
      }
    }

    // Build AI generation parameters
    const generationParams = {
      prompt: prompt || pattern.promptTemplate,
      negativePrompt: negativePrompt || pattern.negativePrompt || '',
      seed: seed || Math.floor(Math.random() * 1000000),
      steps: steps || 50,
      cfg: cfg || 7,
      width: width || 1024,
      height: height || 1024,
      sampler: sampler || 'Euler',
      loraModels: loraModels || [],
      pattern: pattern.name,
      material: material ? material.name : null
    };

    // TODO: Call actual AI service
    // For demo, simulate generation with a placeholder
    const generatedImageUrl = `https://via.placeholder.com/${generationParams.width}x${generationParams.height}/4A90D9/FFFFFF?text=Vastra+AI+Design+${Date.now()}`;

    // Create design record
    const design = await Design.create({
      user: user._id,
      pattern: pattern._id,
      material: material ? material._id : null,
      prompt: generationParams.prompt,
      negativePrompt: generationParams.negativePrompt,
      referenceImage: referenceImage || null,
      generatedImage: generatedImageUrl,
      seed: generationParams.seed,
      steps: generationParams.steps,
      cfg: generationParams.cfg,
      width: generationParams.width,
      height: generationParams.height,
      isCommercial: isCommercial || false,
      status: 'completed',
      metadata: {
        modelUsed: 'stable-diffusion-v2',
        loraUsed: loraModels || [],
        sampler: generationParams.sampler,
        scheduler: 'Karras'
      }
    });

    // Increment generation count
    await user.incrementGenerationCount();

    // Calculate authenticity
    const authenticityResult = await authenticateDesign(design, pattern, material);
    design.authenticityScore = authenticityResult.score;
    design.authenticityDetails = authenticityResult.details;
    await design.save();

    // Estimate price if material available
    let priceEstimate = null;
    if (material) {
      priceEstimate = await estimatePrice({
        material: material.name,
        pattern: pattern.name,
        quantity: 1,
        complexity: 'medium'
      });
    }

    // Estimate shipping
    const shippingEstimate = await estimateShipping({
      from: pattern.origin?.state || 'Gujarat',
      to: req.body.location || 'Delhi'
    });

    logger.info('AI design generated', { 
      userId: user._id, 
      designId: design._id,
      pattern: pattern.name 
    });

    res.status(201).json({
      status: 'success',
      data: {
        design: {
          id: design._id,
          image: design.generatedImage,
          prompt: design.prompt,
          pattern: pattern.name,
          material: material ? material.name : null
        },
        authenticity: authenticityResult,
        price: priceEstimate,
        shipping: shippingEstimate
      }
    });
  } catch (error) {
    logger.error('AI generation error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get AI capabilities
exports.getAICapabilities = async (req, res) => {
  try {
    const patterns = await Pattern.find({ isActive: true })
      .select('name category description sampleImages');

    res.status(200).json({
      status: 'success',
      data: {
        availablePatterns: patterns,
        models: ['stable-diffusion-v2', 'stable-diffusion-xl'],
        samplers: ['Euler', 'DPM++ 2M Karras', 'LMS', 'DDIM'],
        loraModels: [
          { id: 'bandhani-v1', name: 'Bandhani Style' },
          { id: 'ikat-v1', name: 'Ikat Style' },
          { id: 'patola-v1', name: 'Patola Style' }
        ],
        maxResolution: { width: 2048, height: 2048 }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get generation status
exports.getGenerationStatus = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        status: 'error',
        message: 'Design not found'
      });
    }

    // Check access
    if (design.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        status: design.status,
        progress: design.status === 'processing' ? 50 : 100,
        imageUrl: design.generatedImage
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};