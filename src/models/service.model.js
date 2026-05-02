import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    Service_Name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      default: 0,
    },
    final_price: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    service_Image: {
      type: [String],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },
  },
  { timestamps: true },
);

export const Service = mongoose.model("Service", serviceSchema);
