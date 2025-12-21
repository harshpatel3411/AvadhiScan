import mongoose, { Schema, Document } from "mongoose";

export interface IProductInfo extends Document {
  barcode: string;
  name: string;
  brand?: string;
  category: "groceries" | "medicines" | "cosmetics" | "household" | "other";
}

const productInfoSchema = new Schema<IProductInfo>({
  barcode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String },
  category: {
    type: String,
    enum: ['groceries', 'medicines', 'cosmetics', 'household', 'other'],
    required: true
  }
});

export const ProductInfo = mongoose.model<IProductInfo>("ProductInfo", productInfoSchema);
