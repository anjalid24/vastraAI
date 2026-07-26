const axios = require('axios');
const fs = require('fs');
const logger = require('../middleware/logger');

// AI Service configuration
const AI_CONFIG = {
  baseURL: process.env.AI_API_URL || 'http://localhost:8000',
  apiKey: process.env.AI_API_KEY,
  timeout: parseInt(process.env.AI_TIMEOUT) || 300000,
  defaultParams: {
    steps: 50,
    cfg: 7,
    sampler: 'Euler',
    scheduler: 'Karras',
    width: 1024,
    height: 1024
  }
};

// Generate design using AI
exports.generateDesign = async (params) => {
  try {
    const {
      prompt,
      negativePrompt,
      pattern,
      material,
      seed,
      steps,
      cfg,
      width,
      height,
      sampler,
      referenceImage,
      loraModels
    } = params;

    // Prepare payload
    const payload = {
      prompt: prompt,
      negative_prompt: negativePrompt || '',
      seed: seed || Math.floor(Math.random() * 1000000),
      steps: steps || AI_CONFIG.defaultParams.steps,
      cfg: cfg || AI_CONFIG.defaultParams.cfg,
      width: width || AI_CONFIG.defaultParams.width,
      height: height || AI_CONFIG.defaultParams.height,
      sampler: sampler || AI_CONFIG.defaultParams.sampler,
      scheduler: AI_CONFIG.defaultParams.scheduler,
      pattern: pattern,
      material: material,
      lora_models: loraModels || []
    };

    // If reference image is provided, convert to base64
    if (referenceImage) {
      if (referenceImage.startsWith('http')) {
        const response = await axios.get(referenceImage, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        payload.reference_image = base64;
      } else if (fs.existsSync(referenceImage)) {
        const imageBuffer = fs.readFileSync(referenceImage);
        payload.reference_image = imageBuffer.toString('base64');
      } else {
        payload.reference_image = referenceImage;
      }
    }

    // Call AI API
    const response = await axios.post(
      `${AI_CONFIG.baseURL}/generate`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: AI_CONFIG.timeout
      }
    );

    logger.info('AI generation successful', { pattern, seed: payload.seed });

    return {
      success: true,
      image: response.data.image,
      seed: response.data.seed || payload.seed,
      generationTime: response.data.generation_time || 0,
      metadata: response.data.metadata || {}
    };
  } catch (error) {
    logger.error('AI Generation Error:', error);
    return {
      success: false,
      error: error.message,
      image: null,
      seed: null
    };
  }
};

// Get available AI models
exports.getModels = async () => {
  try {
    const response = await axios.get(`${AI_CONFIG.baseURL}/models`, {
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      timeout: 5000
    });

    return {
      success: true,
      models: response.data.models || []
    };
  } catch (error) {
    logger.error('Get Models Error:', error);
    return {
      success: false,
      models: ['stable-diffusion-v2', 'stable-diffusion-xl']
    };
  }
};

// Get available LoRAs
exports.getLoras = async () => {
  try {
    const response = await axios.get(`${AI_CONFIG.baseURL}/loras`, {
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      timeout: 5000
    });

    return {
      success: true,
      loras: response.data.loras || []
    };
  } catch (error) {
    logger.error('Get LoRAs Error:', error);
    return {
      success: false,
      loras: []
    };
  }
};

// Check AI service health
exports.checkHealth = async () => {
  try {
    const response = await axios.get(`${AI_CONFIG.baseURL}/health`, {
      timeout: 5000
    });

    return {
      healthy: response.status === 200,
      status: response.data.status || 'ok'
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
};

// Get generation status
exports.getGenerationStatus = async (generationId) => {
  try {
    const response = await axios.get(`${AI_CONFIG.baseURL}/status/${generationId}`, {
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      timeout: 10000
    });

    return {
      success: true,
      status: response.data.status,
      progress: response.data.progress || 0,
      image: response.data.image || null
    };
  } catch (error) {
    logger.error('Get Status Error:', error);
    return {
      success: false,
      status: 'unknown',
      error: error.message
    };
  }
};

// Build prompt with pattern template
exports.buildPrompt = (pattern, material, userPrompt, additionalContext) => {
  let prompt = '';

  if (pattern.promptTemplate) {
    prompt = pattern.promptTemplate;
  }

  if (material) {
    prompt += `, ${material.name}`;
  }

  if (userPrompt) {
    prompt += `, ${userPrompt}`;
  }

  if (additionalContext) {
    prompt += `, ${additionalContext}`;
  }

  prompt += ', high quality, detailed, professional, stunning';

  return prompt;
};

// Build negative prompt
exports.buildNegativePrompt = (pattern, userNegativePrompt) => {
  let negativePrompt = '';

  if (pattern.negativePrompt) {
    negativePrompt = pattern.negativePrompt;
  }

  if (userNegativePrompt) {
    negativePrompt += `, ${userNegativePrompt}`;
  }

  negativePrompt += ', low quality, blurry, distorted, ugly, bad anatomy, deformed';

  return negativePrompt;
};

module.exports = exports;