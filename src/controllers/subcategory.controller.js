import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js";

// Get all subcategories, optionally filtered by category id or name
export const getSubCategories = async (req, res) => {
  try {
    const { category } = req.query; // could be id
    let filter = {};
    if (category) {
      // if category is a valid ObjectId, filter by id; else try name lookup
      if (/^[0-9a-fA-F]{24}$/.test(category)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ name: category });
        if (cat) filter.category = cat._id;
      }
    }
    const subs = await SubCategory.find(filter)
      .sort({ createdAt: -1 })
      .populate("category", "name");
    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create subcategory
export const createSubCategory = async (req, res) => {
  try {
    const { name, category, image, description } = req.body;
    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }
    // accept category as id or name
    let categoryId = category;
    if (!/^[0-9a-fA-F]{24}$/.test(category)) {
      const cat = await Category.findOne({ name: category });
      if (!cat) return res.status(400).json({ message: "Invalid category" });
      categoryId = cat._id;
    }

    const subCat = new SubCategory({ name, category: categoryId, image, description });
    await subCat.save();
    await subCat.populate("category", "name");
    res.status(201).json(subCat);
  } catch (error) {
    // handle uniqueness error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Subcategory already exists for this category" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update subcategory
export const updateSubCategory = async (req, res) => {
  try {
    const sub = await SubCategory.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subcategory not found" });

    const { name, category, image, description } = req.body;
    if (name) sub.name = name;
    if (image !== undefined) sub.image = image;
    if (description !== undefined) sub.description = description;
    if (category) {
      let categoryId = category;
      if (!/^[0-9a-fA-F]{24}$/.test(category)) {
        const cat = await Category.findOne({ name: category });
        if (!cat) return res.status(400).json({ message: "Invalid category" });
        categoryId = cat._id;
      }
      sub.category = categoryId;
    }

    await sub.save();
    await sub.populate("category", "name");
    res.json(sub);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Subcategory already exists for this category" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    const sub = await SubCategory.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subcategory not found" });

    res.json({ message: "Subcategory removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
