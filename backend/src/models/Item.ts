import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  Handle: string;
  Title: string;
  Body: string;
  Vendor: string;
  Type: string;
  Tags: string;
  "Option1 Name": string;
  "Option1 Value": string;
  "Option2 Name"?: string;
  "Option2 Value"?: string;
  "Option3 Name"?: string;
  "Option3 Value"?: string;
  "Variant SKU": string;
  "Variant Grams"?: number;
  "Variant Inventory Tracker"?: string;
  "Variant Inventory Qty"?: number;
  "Variant Inventory Policy"?: string;
  "Variant Fulfillment Service"?: string;
  "Variant Price": number;
  "Variant Compare At Price"?: number | string;
  "Image Src": string;
}

const ItemSchema: Schema = new Schema({
  Handle: { type: String, required: true },
  Title: { type: String, required: true },
  Body: { type: String },
  Vendor: { type: String },
  Type: { type: String },
  Tags: { type: String },
  "Option1 Name": { type: String },
  "Option1 Value": { type: String },
  "Option2 Name": { type: String },
  "Option2 Value": { type: String },
  "Option3 Name": { type: String },
  "Option3 Value": { type: String },
  "Variant SKU": { type: String, required: true, unique: true },
  "Variant Grams": { type: Number },
  "Variant Inventory Tracker": { type: String },
  "Variant Inventory Qty": { type: Number },
  "Variant Inventory Policy": { type: String },
  "Variant Fulfillment Service": { type: String },
  "Variant Price": { type: Number, required: true },
  "Variant Compare At Price": { type: Schema.Types.Mixed },
  "Image Src": { type: String },
});

ItemSchema.index({
  Title: "text",
  "Variant SKU": "text",
});

export default mongoose.model<IItem>("Item", ItemSchema);
