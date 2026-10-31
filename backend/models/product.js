const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"], // You can add custom error messages too!
        trim: true // Removes accidental spaces at the beginning or end
    },
    price: {
        type: Number, // Changed to Number for easy calculations and filtering
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"] // Keeps data accurate
    },
    description: {
        type: String,
        trim: true
    }

},
    {
        timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
