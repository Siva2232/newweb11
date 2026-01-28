import mongoose from "mongoose";

const heroBannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const HeroBanner = mongoose.model("HeroBanner", heroBannerSchema);
export default HeroBanner;
