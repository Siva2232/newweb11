import HeroBanner from "../models/HeroBanner.js";

// Get all hero banners
export const getHeroBanners = async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create hero banner
export const createHeroBanner = async (req, res) => {
  const { title, description, image } = req.body;
  try {
    const banner = new HeroBanner({ title, description, image });
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update hero banner
export const updateHeroBanner = async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    banner.title = req.body.title || banner.title;
    banner.description = req.body.description || banner.description;
    banner.image = req.body.image || banner.image;

    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete hero banner
export const deleteHeroBanner = async (req, res) => {
  try {
    const banner = await HeroBanner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    res.json({ message: "Banner removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
