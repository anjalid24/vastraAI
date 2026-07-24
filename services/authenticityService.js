const Pattern = require('../models/Pattern');

// Service to calculate authenticity score for generated designs
exports.authenticateDesign = async (design, pattern, material) => {
  try {
    let score = 0;
    const details = {
      region: '',
      traditionalColors: false,
      traditionalMotifs: false,
      recommendedFabric: '',
      historicalContext: '',
      culturalAccuracy: 0
    };

    // Check if pattern is authentic
    if (pattern) {
      score += 30;
      details.region = pattern.origin?.state || 'Unknown';
      details.historicalContext = pattern.history?.substring(0, 200) || '';
      
      // Check if pattern has traditional colors defined
      if (pattern.traditionalColors && pattern.traditionalColors.length > 0) {
        details.traditionalColors = true;
        score += 20;
      }

      // Check for traditional motifs
      if (pattern.techniques && pattern.techniques.length > 0) {
        details.traditionalMotifs = true;
        score += 20;
      }

      // Check for recommended materials
      if (material && pattern.recommendedMaterials && 
          pattern.recommendedMaterials.includes(material._id)) {
        details.recommendedFabric = material.name;
        score += 15;
      } else if (material) {
        // Check if material is in recommended list
        const recommended = await Pattern.findById(pattern._id)
          .populate('recommendedMaterials');
        if (recommended.recommendedMaterials.some(m => m.name === material.name)) {
          details.recommendedFabric = material.name;
          score += 15;
        } else {
          // Suggest alternative
          const firstRecommended = await Pattern.findById(pattern._id)
            .populate('recommendedMaterials');
          if (firstRecommended.recommendedMaterials.length > 0) {
            details.recommendedFabric = firstRecommended.recommendedMaterials[0].name;
          }
        }
      }

      // Calculate cultural accuracy
      let accuracyScore = 0;
      if (details.traditionalColors) accuracyScore += 30;
      if (details.traditionalMotifs) accuracyScore += 30;
      if (details.recommendedFabric) accuracyScore += 20;
      if (pattern.origin?.region) accuracyScore += 20;
      
      details.culturalAccuracy = Math.min(accuracyScore, 100);
    }

    // Final score calculation
    const finalScore = Math.min(
      score + (details.culturalAccuracy || 0),
      100
    );

    return {
      score: finalScore,
      details: {
        ...details,
        authenticityLevel: finalScore >= 80 ? 'High' : 
                          finalScore >= 60 ? 'Medium' : 'Low'
      }
    };
  } catch (error) {
    console.error('Authenticity service error:', error);
    return {
      score: 50,
      details: {
        region: 'Unknown',
        traditionalColors: false,
        traditionalMotifs: false,
        recommendedFabric: 'Not available',
        historicalContext: 'Information not available',
        culturalAccuracy: 50,
        authenticityLevel: 'Medium'
      }
    };
  }
};