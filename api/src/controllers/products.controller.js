// API controllers for products
import Product from "../models/product.model.js";

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const payload = req.body;
    const newProduct = new Product(payload);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Prodotto non trovato" });
    res.json({ message: "Prodotto eliminato" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/products/categories
export const listCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/count-by-category
export const countProductsPerCategory = async (req, res) => {
  try {
    const counts = await Product.aggregate([
      { $unwind: "$category" },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { _id: 0, category: "$_id", count: 1 } },
      { $sort: { category: 1 } },
    ]);
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/by-category/:category
export const productsPerCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/brands
export const listBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.json(brands.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/codes
export const listCodes = async (req, res) => {
  try {
    const codes = await Product.distinct("code");
    res.json(codes.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
