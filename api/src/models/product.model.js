import mongoose from "mongoose";

// Define the Product schema for MongoDB
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: Array, default: [] },
    description: { type: String, default: "" },
    code: { type: String, required: true, unique: true },
    price: { type: Number, default: 0 },
    image_url: { type: String, default: "" },
    brand: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    tags: { type: Array, default: [] },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
