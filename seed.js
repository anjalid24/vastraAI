const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Pattern = require('./models/Pattern');
const Material = require('./models/Material');
const TextileEncyclopedia = require('./models/TextileEncyclopedia');
const Subscription = require('./models/Subscription');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Pattern.deleteMany({});
    await Material.deleteMany({});
    await TextileEncyclopedia.deleteMany({});
    await Subscription.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@vastraai.com',
      password: adminPassword,
      role: 'admin',
      generationCount: 0,
      emailVerified: true,
      isActive: true
    });

    console.log('✅ Admin user created');

    // Create sample patterns
    const patterns = await Pattern.insertMany([
      {
        name: 'Bandhani',
        category: 'bandhani',
        history: 'Bandhani is a traditional tie-dye technique from Gujarat and Rajasthan. The word "Bandhani" comes from the Sanskrit word "bandha" meaning "to tie".',
        origin: { state: 'Gujarat', city: 'Jamnagar', region: 'Saurashtra' },
        description: 'Intricate dot patterns created through tie-dye technique. The fabric is tied at various points and then dyed, creating beautiful patterns.',
        difficulty: 'intermediate',
        promptTemplate: 'bandhani traditional tie-dye pattern, intricate dots, Gujarati textile, vibrant colors, cultural heritage, Indian traditional craft',
        negativePrompt: 'ugly, distorted, low quality, blurry, modern, western',
        traditionalColors: [
          { name: 'Red', hexCode: '#FF0000' },
          { name: 'Yellow', hexCode: '#FFD700' },
          { name: 'Green', hexCode: '#008000' },
          { name: 'Maroon', hexCode: '#800000' }
        ],
        techniques: ['Tie-dye', 'Resist dyeing', 'Bandhani knotting'],
        tools: ['Thread', 'Needle', 'Dye vats', 'Cotton cloth'],
        culturalSignificance: 'Bandhani is deeply rooted in Gujarati culture and is worn during festivals and weddings.',
        regions: ['Gujarat', 'Rajasthan', 'Sindh'],
        festivals: ['Navratri', 'Diwali', 'Weddings'],
        isActive: true
      },
      {
        name: 'Ikat',
        category: 'ikat',
        history: 'Ikat is a dyeing technique used to pattern textiles that employs resist dyeing on the yarns before dyeing and weaving the fabric.',
        origin: { state: 'Odisha', city: 'Sambalpur', region: 'Eastern India' },
        description: 'Blurred pattern created by dyeing yarns before weaving. The characteristic "blur" is created by the slight bleeding of dyes during the process.',
        difficulty: 'advanced',
        promptTemplate: 'ikat textile pattern, blurred edges, traditional weaving, Odisha craft, geometric designs, intricate patterns, Indian heritage',
        negativePrompt: 'ugly, distorted, low quality, blurry beyond recognition, modern',
        traditionalColors: [
          { name: 'Indigo', hexCode: '#4B0082' },
          { name: 'Rust', hexCode: '#8B4513' },
          { name: 'White', hexCode: '#FFFFFF' },
          { name: 'Black', hexCode: '#000000' }
        ],
        techniques: ['Resist dyeing', 'Weaving', 'Ikat tying'],
        tools: ['Loom', 'Dye vats', 'Yarn', 'Tying materials'],
        culturalSignificance: 'Ikat is considered one of the most complex weaving techniques and represents the rich textile heritage of Odisha.',
        regions: ['Odisha', 'Telangana', 'Andhra Pradesh'],
        festivals: ['Rath Yatra', 'Pongal', 'Sankranti'],
        isActive: true
      },
      {
        name: 'Patola',
        category: 'patola',
        history: 'Patola is a double ikat weave from Patan, Gujarat. It is one of the most expensive and intricate textiles in the world.',
        origin: { state: 'Gujarat', city: 'Patan', region: 'North Gujarat' },
        description: 'Double ikat silk weave with precise geometric patterns. Both warp and weft threads are resist-dyed before weaving.',
        difficulty: 'advanced',
        promptTemplate: 'patola double ikat, silk weave, geometric patterns, Gujarati heritage, vibrant colors, intricate design, royal textile',
        negativePrompt: 'ugly, distorted, low quality, blurry, cheap, mass produced',
        traditionalColors: [
          { name: 'Maroon', hexCode: '#800000' },
          { name: 'Gold', hexCode: '#FFD700' },
          { name: 'Black', hexCode: '#000000' },
          { name: 'White', hexCode: '#FFFFFF' }
        ],
        techniques: ['Double ikat', 'Silk weaving', 'Resist dyeing'],
        tools: ['Silk loom', 'Dye vats', 'Silk yarn', 'Tying materials'],
        culturalSignificance: 'Patola is considered a royal textile and is highly valued for its intricate patterns and durability.',
        regions: ['Gujarat'],
        festivals: ['Navratri', 'Weddings', 'Diwali'],
        isActive: true
      }
    ]);

    console.log('✅ Sample patterns created');

    // Create sample materials
    const materials = await Material.insertMany([
      {
        name: 'Silk',
        category: 'silk',
        description: 'Luxurious natural fiber with high sheen and smooth texture. Ideal for traditional Indian garments.',
        texture: 'Smooth and lustrous',
        gsm: 120,
        width: 112,
        pricePerMeter: 1500,
        supplier: { name: 'Vastra Silk House', contact: '+91-9876543210', location: 'Varanasi, UP' },
        availability: true,
        colors: [
          { name: 'Gold', hexCode: '#FFD700' },
          { name: 'Ivory', hexCode: '#FFFFF0' },
          { name: 'Maroon', hexCode: '#800000' },
          { name: 'Royal Blue', hexCode: '#4169E1' }
        ],
        origin: { state: 'Uttar Pradesh', city: 'Varanasi', country: 'India' },
        careInstructions: ['Dry clean only', 'Store in cool dry place', 'Avoid direct sunlight'],
        images: ['https://via.placeholder.com/300x300/FFD700/000000?text=Silk+Fabric'],
        certifications: ['ISO 9001', 'Green Label'],
        sustainabilityScore: 85
      },
      {
        name: 'Cotton',
        category: 'cotton',
        description: 'Breathable natural fiber, comfortable and versatile. Perfect for everyday wear.',
        texture: 'Soft and comfortable',
        gsm: 80,
        width: 118,
        pricePerMeter: 400,
        supplier: { name: 'Cotton India', contact: '+91-9876543211', location: 'Ahmedabad, Gujarat' },
        availability: true,
        colors: [
          { name: 'White', hexCode: '#FFFFFF' },
          { name: 'Ecru', hexCode: '#C2B280' },
          { name: 'Indigo', hexCode: '#4B0082' },
          { name: 'Rust', hexCode: '#8B4513' }
        ],
        origin: { state: 'Gujarat', city: 'Ahmedabad', country: 'India' },
        careInstructions: ['Machine wash gentle', 'Tumble dry low', 'Iron medium heat'],
        images: ['https://via.placeholder.com/300x300/FFFFFF/000000?text=Cotton+Fabric'],
        certifications: ['GOTS Certified', 'Fair Trade'],
        sustainabilityScore: 90
      },
      {
        name: 'Georgette',
        category: 'georgette',
        description: 'Lightweight, crinkled crepe fabric with excellent drape. Popular for sarees and evening wear.',
        texture: 'Sheer and draped',
        gsm: 60,
        width: 112,
        pricePerMeter: 600,
        supplier: { name: 'Georgette House', contact: '+91-9876543212', location: 'Surat, Gujarat' },
        availability: true,
        colors: [
          { name: 'Pink', hexCode: '#FFC0CB' },
          { name: 'Blue', hexCode: '#0000FF' },
          { name: 'Red', hexCode: '#FF0000' },
          { name: 'Black', hexCode: '#000000' }
        ],
        origin: { state: 'Gujarat', city: 'Surat', country: 'India' },
        careInstructions: ['Hand wash cold', 'Hang to dry', 'Iron low heat'],
        images: ['https://via.placeholder.com/300x300/FF69B4/000000?text=Georgette+Fabric'],
        certifications: ['Oeko-Tex Standard 100'],
        sustainabilityScore: 75
      },
      {
        name: 'Chiffon',
        category: 'chiffon',
        description: 'Lightweight, sheer fabric with a smooth texture. Elegant and flowy.',
        texture: 'Sheer and flowy',
        gsm: 45,
        width: 112,
        pricePerMeter: 500,
        supplier: { name: 'Chiffon Traders', contact: '+91-9876543213', location: 'Mumbai, Maharashtra' },
        availability: true,
        colors: [
          { name: 'Pastel Pink', hexCode: '#FFB6C1' },
          { name: 'Sky Blue', hexCode: '#87CEEB' },
          { name: 'Lavender', hexCode: '#E6E6FA' },
          { name: 'White', hexCode: '#FFFFFF' }
        ],
        origin: { state: 'Maharashtra', city: 'Mumbai', country: 'India' },
        careInstructions: ['Dry clean only', 'Handle with care', 'Avoid stretching'],
        images: ['https://via.placeholder.com/300x300/E6E6FA/000000?text=Chiffon+Fabric'],
        certifications: ['Oeko-Tex Standard 100'],
        sustainabilityScore: 70
      }
    ]);

    console.log('✅ Sample materials created');

    // Create encyclopedia entries
    await TextileEncyclopedia.insertMany([
      {
        name: 'Bandhani',
        category: 'pattern',
        history: 'Bandhani is one of the oldest textile traditions in India, dating back to the Indus Valley Civilization (around 2000 BCE). The technique involves tying small portions of fabric with thread and then dyeing it to create intricate patterns. The word "Bandhani" is derived from the Sanskrit word "bandha" meaning "to tie".',
        origin: { state: 'Gujarat', city: 'Jamnagar', region: 'Saurashtra', country: 'India' },
        timeline: [
          { year: '2000 BCE', event: 'Origins in Indus Valley', description: 'Earliest evidence of tie-dye techniques found in archaeological sites' },
          { year: '1000 CE', event: 'Refinement in Gujarat', description: 'Bandhani technique refined and developed in the Gujarat region' },
          { year: '1900 CE', event: 'Recognition as Heritage', description: 'Bandhani recognized as an important cultural heritage of India' },
          { year: '2023', event: 'Modern Revival', description: 'Bandhani experiences a revival in contemporary fashion' }
        ],
        technique: 'Tie-dye technique using resist dyeing method. The fabric is tied at various points with thread, creating patterns. The tied portions resist the dye, creating the characteristic dots and patterns.',
        gallery: [
          { url: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Bandhani+1', caption: 'Traditional Bandhani saree' },
          { url: 'https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=Bandhani+2', caption: 'Bandhani dupatta' },
          { url: 'https://via.placeholder.com/600x400/45B7D1/FFFFFF?text=Bandhani+3', caption: 'Bandhani design detail' }
        ],
        videos: [
          { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Bandhani Making Process', platform: 'youtube' }
        ],
        materials: [
          { name: 'Silk', description: 'Traditional material for high-end Bandhani', image: 'https://via.placeholder.com/200x200/FFD700/000000?text=Silk' },
          { name: 'Cotton', description: 'Everyday wear Bandhani', image: 'https://via.placeholder.com/200x200/FFFFFF/000000?text=Cotton' },
          { name: 'Georgette', description: 'Modern lightweight Bandhani', image: 'https://via.placeholder.com/200x200/FF69B4/000000?text=Georgette' }
        ],
        traditionalColors: [
          { name: 'Red', hexCode: '#FF0000', description: 'Symbolizes marriage and fertility' },
          { name: 'Yellow', hexCode: '#FFD700', description: 'Symbolizes prosperity and happiness' },
          { name: 'Green', hexCode: '#008000', description: 'Symbolizes nature and peace' },
          { name: 'Maroon', hexCode: '#800000', description: 'Symbolizes strength and power' }
        ],
        interestingFacts: [
          { fact: 'Bandhani patterns are named after the number of dots in a pattern, like "21 dots" pattern', source: 'Textile Traditions of India' },
          { fact: 'The famous "Kutch Bandhani" is considered the most intricate form of this art', source: 'Gujarat Tourism' },
          { fact: 'Bandhani is one of the few crafts that is passed down through generations of women in Gujarat', source: 'Indian Textile Heritage' }
        ],
        references: [
          { title: 'Textile Traditions of India', author: 'Dr. R. Kumar', year: 2019, source: 'Academic Press' },
          { title: 'Gujarat: A Cultural Heritage', author: 'M. Shah', year: 2018, source: 'Heritage Publications' }
        ],
        map: {
          latitude: 22.4707,
          longitude: 70.0577,
          zoom: 8
        },
        culturalSignificance: 'Bandhani is deeply embedded in the culture of Gujarat. It is an integral part of weddings, festivals, and daily life. The patterns often tell stories of the region\'s history and traditions.',
        rituals: ['Worn during Navratri', 'Essential in wedding trousseau', 'Gifted during festivals'],
        festivals: ['Navratri', 'Diwali', 'Weddings', 'Makara Sankranti'],
        famousArtisans: [
          { name: 'Kanti Patel', description: 'Master Bandhani artisan from Jamnagar', image: 'https://via.placeholder.com/200x200/4A90D9/FFFFFF?text=Kanti+Patel' }
        ],
        isVerified: true,
        tags: ['tie-dye', 'gujarat', 'traditional', 'handicraft', 'heritage']
      },
      {
        name: 'Ikat',
        category: 'pattern',
        history: 'Ikat is a dyeing technique that originated in Southeast Asia and was perfected in India. The word "Ikat" comes from the Malay word "mengikat" meaning "to bind". Indian ikat is particularly famous from Odisha, Telangana, and Gujarat.',
        origin: { state: 'Odisha', city: 'Sambalpur', region: 'Eastern India', country: 'India' },
        timeline: [
          { year: '1000 CE', event: 'Development in Odisha', description: 'Ikat technique refined in eastern India' },
          { year: '1500 CE', event: 'Spread to Telangana', description: 'Ikat technique spread to Telangana and Andhra Pradesh' },
          { year: '1900 CE', event: 'International Recognition', description: 'Ikat gains international recognition as a unique textile art' },
          { year: '2023', event: 'Global Fashion', description: 'Ikat becomes popular in global fashion design' }
        ],
        technique: 'Resist dyeing of yarns before weaving. The yarns are tied and dyed, then woven into fabric. The characteristic "blur" is created by the slight bleeding of dyes during the process.',
        gallery: [
          { url: 'https://via.placeholder.com/600x400/4B0082/FFFFFF?text=Ikat+1', caption: 'Traditional Ikat saree from Odisha' },
          { url: 'https://via.placeholder.com/600x400/8B4513/FFFFFF?text=Ikat+2', caption: 'Ikat fabric pattern detail' },
          { url: 'https://via.placeholder.com/600x400/800000/FFFFFF?text=Ikat+3', caption: 'Pochampally Ikat design' }
        ],
        videos: [
          { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Ikat Weaving Process', platform: 'youtube' }
        ],
        materials: [
          { name: 'Silk', description: 'Traditional Ikat material', image: 'https://via.placeholder.com/200x200/FFD700/000000?text=Silk' },
          { name: 'Cotton', description: 'Everyday Ikat fabric', image: 'https://via.placeholder.com/200x200/FFFFFF/000000?text=Cotton' }
        ],
        traditionalColors: [
          { name: 'Indigo', hexCode: '#4B0082', description: 'Traditional color used in Odisha Ikat' },
          { name: 'Rust', hexCode: '#8B4513', description: 'Earthy color representing soil' },
          { name: 'White', hexCode: '#FFFFFF', description: 'Purity and simplicity' },
          { name: 'Black', hexCode: '#000000', description: 'Tradition and strength' }
        ],
        interestingFacts: [
          { fact: 'Double ikat is considered the most complex form of ikat, requiring immense skill', source: 'Encyclopedia of Textiles' },
          { fact: 'The famous Pochampally sarees are a type of ikat from Telangana', source: 'Telangana Tourism' },
          { fact: 'Ikat takes months to create as the process is extremely labor-intensive', source: 'Textile Heritage' }
        ],
        references: [
          { title: 'Encyclopedia of Textiles', author: 'Dr. S. Gupta', year: 2020, source: 'Academic Press' },
          { title: 'Indian Textile Heritage', author: 'P. Sharma', year: 2017, source: 'Heritage Publications' }
        ],
        map: {
          latitude: 21.4692,
          longitude: 83.9734,
          zoom: 7
        },
        culturalSignificance: 'Ikat represents the mastery of Indian textile artisans. It is considered a symbol of prestige and is often worn during important ceremonies.',
        rituals: ['Worn during festivals', 'Used in important ceremonies', 'Gifted as precious textiles'],
        festivals: ['Rath Yatra', 'Pongal', 'Sankranti', 'Weddings'],
        famousArtisans: [
          { name: 'Gandhi Rao', description: 'Master Ikat artisan from Sambalpur', image: 'https://via.placeholder.com/200x200/4A90D9/FFFFFF?text=Gandhi+Rao' }
        ],
        isVerified: true,
        tags: ['ikat', 'weaving', 'odisha', 'traditional', 'handicraft']
      }
    ]);

    console.log('✅ Encyclopedia entries created');

    // Create free subscription for admin
    await Subscription.create({
      user: admin._id,
      plan: 'free',
      status: 'active',
      startDate: new Date(),
      features: {
        unlimitedGeneration: false,
        pricingCalculator: false,
        shippingEstimator: false,
        designHistory: false,
        contactArtisans: false,
        downloadHD: false,
        commercialLicense: false
      }
    });

    console.log('✅ Subscription created for admin');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Admin created: ${admin.email}`);
    console.log(`   - Patterns: ${patterns.length}`);
    console.log(`   - Materials: ${materials.length}`);
    console.log(`   - Encyclopedia entries: 2`);
    console.log('\n🔑 Default Admin Login:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@vastraai.com'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();