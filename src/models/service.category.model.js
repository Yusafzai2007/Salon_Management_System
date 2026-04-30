import mongoose from "mongoose";

const serviceCategorySchema = new mongoose.Schema(
  {
    service_category_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const ServiceCategory = mongoose.model(
  "ServiceCategory",
  serviceCategorySchema,
);
