import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load models
import Category from "./src/models/Category.js";
import Product from "./src/models/Product.js";
import HeroBanner from "./src/models/HeroBanner.js";
import SpecialOffer from "./src/models/special.js";
import CustomProduct from "./src/models/CustomProduct.js";
import Admin from "./src/models/Admin.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get random image from uploads
const getImages = () => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) return [];
    return fs.readdirSync(uploadDir).filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
};

const images = getImages();

const getRandomImage = () => {
    if (images.length === 0) return "/placeholder.jpg";
    const randomImg = images[Math.floor(Math.random() * images.length)];
    return `/uploads/${randomImg}`; // Path stored in DB
};

const categoriesData = [
    { name: "Album", subTypes: [
        "Vibrantradient", "emarald", "classic", "Empossed", "Acrlyili covers", 
        "Sandy model royal", "Woodengrev", "leathering grey", "package albums"
    ]},
    { name: "Visiting card", subTypes: [
        "Tearable", "Non - Tearable", "Golden metallic", "Luster", "Soft touch"
    ]},
    { name: "Brochure", subTypes: [
        "A4", "A3", "A5"
    ]},
    { name: "Wedding cards", subTypes: [
        "Golden metallic", "Silver metallic", "Book type", "acrylic", "Paper"
    ]},
    { name: "Gift items", subTypes: [
        "Photo mug", "Family photo", "Magic mug", "Diary", "Calendar", "Table top", "Custom notebook"
    ]},
    { name: "Photo frame", subTypes: [
        "Floating frame", "acrylic frame", "Collage frame", "Table top", "Poster"
    ]},
    { name: "Custom momento", subTypes: [
        "Acrylic", "Fiber", "Wood", "Stick"
    ]}
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔥 Connected to MongoDB...");

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        await HeroBanner.deleteMany({});
        await SpecialOffer.deleteMany({});
        await CustomProduct.deleteMany({});
        await Admin.deleteMany({});
        console.log("🗑️  Cleared existing data.");

        // 1. Create Hero Banners
        const banners = [
            { title: "The future of style.", description: "Experience next-gen premium design." },
            { title: "Capture the moment.", description: "Premium albums for your memories." },
            { title: "Gift the extraordinary.", description: "Personalized gifts for everyone." }
        ];

        for (const banner of banners) {
            await HeroBanner.create({
                title: banner.title,
                description: banner.description,
                image: getRandomImage(),
                active: true,
                createdAt: new Date()
            });
        }
        console.log("✅ Created Hero Banners.");

        // 2. Create Special Offers
        const offers = [
            { title: "Wedding Bundles", description: "Get 20% off on complete wedding packages.", category: "Bundles" },
            { title: "Frame Your Memories", description: "Buy 1 get 1 free on select photo frames.", category: "Frames" },
            { title: "Premium Albums", description: "Exclusive access to our new leather collection.", category: "Albums" },
            { title: "Corporate Gifts", description: "Bulk order discounts available now.", category: "Other" }
        ];

        for (const offer of offers) {
            await SpecialOffer.create({
                title: offer.title,
                description: offer.description,
                category: offer.category,
                image: getRandomImage(),
                isActive: true,
                displayOrder: 1
            });
        }
        console.log("✅ Created Special Offers.");

        // 3. Create Custom Products (for Bespoke Books)
        const customProducts = [
            { name: "Wedding Edition", price: "₹4,999", tag: "Signature", shortDesc: "The ultimate premium wedding album with heavy layflat pages." },
            { name: "Essential Edition", price: "₹2,999", tag: "Essential", shortDesc: "Perfect for travel memories and everyday moments." },
            { name: "Baby Heirloom", price: "₹2,499", tag: "Gift", shortDesc: "Cherish those first milestones forever." },
            { name: "Premium Portfolio", price: "₹3,499", tag: "Premium", shortDesc: "Professional portfolio book for models and artists." },
            { name: "Anniversary Special", price: "₹5,999", tag: "Limited", shortDesc: "Gold-foiled custom cover for special occasions." }
        ];

        for (const cp of customProducts) {
            await CustomProduct.create({
                ...cp,
                image: getRandomImage(),
                fullDesc: cp.shortDesc + " Includes premium printing, hardcover binding, and 20 pages default.",
                createdAt: new Date()
            });
        }
        console.log("✅ Created Custom Products.");

        // 3. Insert Categories & Products
        for (const cat of categoriesData) {
            // Create Main Category
            const newCat = await Category.create({
                name: cat.name,
                image: getRandomImage(),
                description: `Premium ${cat.name} collection`
            });
            console.log(`✅ Created Category: ${cat.name}`);

            // Create 5 Products for EACH sub-type
            for (const subType of cat.subTypes) {
                const productsToInsert = [];
                for (let i = 1; i <= 5; i++) {
                    productsToInsert.push({
                        name: `${subType} ${cat.name} ${i}`,
                        description: `High quality ${subType} style ${cat.name}. Variant ${i}.`,
                        price: Math.floor(Math.random() * 5000) + 500, // Random price 500-5500
                        originalPrice: Math.floor(Math.random() * 2000) + 6000, 
                        category: newCat.name, 
                        image: getRandomImage(),
                        images: [getRandomImage(), getRandomImage()], // Additional images
                        stock: 50,
                        isActive: true,
                        isTrending: Math.random() > 0.8,
                        isBestSeller: Math.random() > 0.8
                    });
                }
                await Product.insertMany(productsToInsert);
                console.log(`   ✨ Added 5 products for: ${subType}`);
            }
        }

        // 5. Create Admin User
        await Admin.create({
            username: "admin",
            password: "admin123"
        });
        console.log("✅ Created Admin User (admin/admin123).");

        console.log("🎉 Seeding Completed Successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedDB();
