const express = require("express");
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");

// This defines your endpoint
router.post("/api/products", createProduct);
router.get("/api/products", getAllProducts);
router.get("/api/products/:id", getProductById);
router.put("/api/products/:id", updateProduct);
router.delete("/api/products/:id", deleteProduct);

// FIXED: Export the 'router' variable you created on line 2
module.exports = router; 
