import Product from "../models/Product.js";

// Get all products (Optimized)
export const getProducts = async (req, res) => {
  try {
    // Determine if we need full details or list view
    const { full, category, subcategory } = req.query; 

    let filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    let query = Product.find(filter).sort({ createdAt: -1 });

    if (!full) {
      // For list views, don't fetch heavy fields
      query = query.select("-description -images");
    }

    const products = await query.lean(); // Return plain JS objects (faster)
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const { 
      name, category, subcategory, price, originalPrice, 
      description, detailedDescription, specifications,
      image, mainImage, 
      images, carouselImages 
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Name, category, and price are required" });
    }

    const product = new Product({
      name,
      category,
      subcategory,
      price,
      originalPrice,
      description,
      detailedDescription,
      specifications,
      image: image || mainImage,
      images: images || carouselImages,
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Helper to check if value is provided
    const { 
      name, category, subcategory, price, originalPrice, 
      description, detailedDescription, specifications,
      image, mainImage, 
      images, carouselImages 
    } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (price) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    
    if (description) product.description = description;
    if (detailedDescription) product.detailedDescription = detailedDescription;
    if (specifications) product.specifications = specifications;
    
    if (image || mainImage) product.image = image || mainImage;
    if (images || carouselImages) product.images = images || carouselImages;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Toggle Trending
export const toggleTrending = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isTrending = !product.isTrending;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Best Seller
export const toggleBestSeller = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isBestSeller = !product.isBestSeller;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
