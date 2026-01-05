import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: String,
    price: Number,
    quantity: Number,
    category: String,
    image: String,
  },
  { timestamps: true }
);

const Product =
  models.Product || mongoose.model("Product", ProductSchema);

export default Product;


