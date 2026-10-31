const Product = require('../models/product');
const mongoose = require("mongoose");

const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;

        // 1. Safe validation: Check if fields exist before trimming
        if (!name || !name.trim() || price === undefined || price === null || !description || !description.trim()) {
            return res.status(400).json({ message: "all fields are required" });
        }

        // 2. Validate price
        if (Number(price) < 0) {
            return res.status(400).json({ message: "price must be valid" });
        }

        // 3. ADDED 'await' here so it waits for MongoDB to save
        const product = await Product.create({
            name,
            price,
            description
        });

        // 4. FIXED typo: changed 'printroduct' to 'product'
        return res.status(201).json({ message: "product created successfully", product });

    } catch (error) {
        // Helpful tip: logging the error in your terminal lets you read what went wrong
        console.error("Database Error:", error);
        return res.status(500).json({ message: "internal server error", error: error.message });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find();
        return res.status(200).json({ message: "Successfull", allProducts });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" }); // 404 means Not Found
        }

        return res.status(200).json({ message: "successfull", product });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // URL se ID nikali

        // 1. ID Validation (Jaise humne pichli baar seekha tha)
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // 2. Mongoose se query run ki
        // req.body ke andar jo bhi badlaav hain (jaise name, price) wo chale jayenge
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,           // Isse MongoDB hume updated data return karega
                runValidators: true  // Isse Schema ke rules (jaise price < 0 nahi hona) dobara check honge
            }
        );

        // 3. Check agar product database mein mila hi nahi
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Sab sahi hai toh updated data response mein bhej do
        return res.status(200).json({ message: "Product updated successfully", updatedProduct });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. ID Format Check: Taaki galat format par server crash na ho
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // 2. Database se delete karne ki query
        const deletedProduct = await Product.findByIdAndDelete(id);

        // 3. Existence Check: Agar product pehle hi delete ho chuka hai ya mila hi nahi
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 4. Success Response
        return res.status(200).json({ message: "Product deleted successfully", deletedProduct });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
