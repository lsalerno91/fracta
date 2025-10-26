import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  listCategories,
  countProductsPerCategory,
  productsPerCategory,
  listBrands,
  listCodes,
} from "../controllers/products.controller.js";

const router = express.Router();

// ✅ Extra endpoints (specific routes first)
router.get("/categories", listCategories);
router.get("/count-by-category", countProductsPerCategory);
router.get("/by-category/:category", productsPerCategory);
router.get("/brands", listBrands);
router.get("/codes", listCodes);

// ✅ CRUD base routes (generic/dynamic last)
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

export default router;
