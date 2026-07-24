const Design = require('../models/Design');
const User = require('../models/User');
const Pattern = require('../models/Pattern');
const Material = require('../models/Material');
const { authenticateDesign } = require('../services/authenticityService');
const logger = require('../middleware/logger');

// Generate a new design (AI integration)
exports.generateDesign = async (req, res) => {
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
      isCommercial 
    } = req.body;

    // Check generation limit
    const user = await User.findById(req.user.id);
    if (!user.canGenerateDesign()) {
      return res.status(403).json({
        status: 'error',
        message: 'You have reached your monthly generation limit. Please upgrade to continue.',
        limit: 1,
        used: user.generationCount
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

    // Validate material (optional)
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

    // Build prompt with pattern template
    const finalPrompt = prompt || pattern.promptTemplate;
    const finalNegativePrompt = negativePrompt || pattern.negativePrompt || '';

    // TODO: Call AI service to generate design
    // For now, simulate generation
    const generatedImageUrl = `https://via.placeholder.com/${width || 1024}x${height || 1024}/4A90D9/FFFFFF?text=Vastra+AI+Design+${Date.now()}`;

    // Create design record
    const design = await Design.create({
      user: req.user.id,
      pattern: patternId,
      material: materialId || null,
      prompt: finalPrompt,
      negativePrompt: finalNegativePrompt,
      referenceImage: referenceImage || null,
      generatedImage: generatedImageUrl,
      seed: seed || Math.floor(Math.random() * 1000000),
      steps: steps || 50,
      cfg: cfg || 7,
      width: width || 1024,
      height: height || 1024,
      isCommercial: isCommercial || false,
      status: 'completed',
      aiModel: 'stable-diffusion-v2'
    });

    // Increment generation count
    await user.incrementGenerationCount();

    // Calculate authenticity score
    const authenticityResult = await authenticateDesign(design, pattern, material);
    design.authenticityScore = authenticityResult.score;
    design.authenticityDetails = authenticityResult.details;
    await design.save();

    logger.info('Design generated', { 
      userId: req.user.id, 
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
          material: material ? material.name : null,
          authenticityScore: design.authenticityScore,
          authenticityDetails: design.authenticityDetails,
          createdAt: design.createdAt
        }
      }
    });
  } catch (error) {
    logger.error('Design generation error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get user's designs
exports.getMyDesigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const designs = await Design.find({ user: req.user.id })
      .populate('pattern', 'name category')
      .populate('material', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Design.countDocuments({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      data: {
        designs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
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

// Get single design
exports.getDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate('pattern')
      .populate('material')
      .populate('user', 'name email');

    if (!design) {
      return res.status(404).json({
        status: 'error',
        message: 'Design not found'
      });
    }

    // Check if user has access
    if (!design.isPublic && design.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have access to this design'
      });
    }

    // Increment view count
    design.views += 1;
    await design.save();

    res.status(200).json({
      status: 'success',
      data: { design }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete design
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        status: 'error',
        message: 'Design not found'
      });
    }

    // Check ownership
    if (design.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to delete this design'
      });
    }

    await design.deleteOne();

    logger.info('Design deleted', { userId: req.user.id, designId: design._id });

    res.status(200).json({
      status: 'success',
      message: 'Design deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Regenerate design
exports.regenerateDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate('pattern')
      .populate('material');

    if (!design) {
      return res.status(404).json({
        status: 'error',
        message: 'Design not found'
      });
    }

    // Check ownership
    if (design.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to regenerate this design'
      });
    }

    // Check generation limit
    const user = await User.findById(req.user.id);
    if (!user.canGenerateDesign()) {
      return res.status(403).json({
        status: 'error',
        message: 'You have reached your monthly generation limit'
      });
    }

    // TODO: Regenerate with same parameters
    const regeneratedImage = `https://via.placeholder.com/${design.width}x${design.height}/FF6B6B/FFFFFF?text=Regenerated+Design+${Date.now()}`;

    // Create new design
    const newDesign = await Design.create({
      user: req.user.id,
      pattern: design.pattern._id,
      material: design.material ? design.material._id : null,
      prompt: design.prompt,
      negativePrompt: design.negativePrompt,
      referenceImage: design.referenceImage,
      generatedImage: regeneratedImage,
      seed: Math.floor(Math.random() * 1000000),
      steps: design.steps,
      cfg: design.cfg,
      width: design.width,
      height: design.height,
      isCommercial: design.isCommercial,
      status: 'completed',
      metadata: {
        regeneratedFrom: design._id
      }
    });

    await user.incrementGenerationCount();

    res.status(201).json({
      status: 'success',
      data: { design: newDesign }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Download design (HD)
exports.downloadDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        status: 'error',
        message: 'Design not found'
      });
    }

    // Check ownership or commercial license
    const isOwner = design.user.toString() === req.user.id;
    const hasCommercialLicense = req.user.role === 'brand' || req.user.role === 'admin';

    if (!isOwner && !hasCommercialLicense) {
      return res.status(403).json({
        status: 'error',
        message: 'You need a commercial license to download this design'
      });
    }

    // Increment download count
    design.downloads += 1;
    await design.save();

    // TODO: Generate HD version or return original
    res.status(200).json({
      status: 'success',
      data: {
        downloadUrl: design.generatedImage,
        message: 'Download ready'
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get public designs (gallery)
exports.getPublicDesigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { pattern, material, sort } = req.query;

    const filter = { isPublic: true, status: 'completed' };
    if (pattern) filter.pattern = pattern;
    if (material) filter.material = material;

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { views: -1, downloads: -1 };
    else if (sort === 'score') sortOption = { authenticityScore: -1 };

    const designs = await Design.find(filter)
      .populate('pattern', 'name category')
      .populate('material', 'name')
      .populate('user', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Design.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        designs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
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