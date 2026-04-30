import { asynhandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { ServiceCategory } from "../models/service.category.model.js";

const create_category = asynhandler(async (req, res) => {
  const { service_category_name, description } = req.body;

  if (!service_category_name || !description) {
    return res.status(400).json(new apiError(400, "All fields are required"));
  }

  const check_category = await ServiceCategory.findOne({
    service_category_name,
  });
  if (check_category) {
    return res.status(400).json(new apiError(400, "Category already exists"));
  }

  const category = await ServiceCategory.create({
    service_category_name,
    description,
  });

  return res
    .status(201)
    .json(new apiResponse(201, category, "Category created"));
});

const get_all_category = asynhandler(async (req, res) => {
  const category = await ServiceCategory.find();
  return res.status(200).json(new apiResponse(200, category, "All categories"));
});

const delete_category = asynhandler(async (req, res) => {
  const { id } = req.params;
  const category = await ServiceCategory.findByIdAndDelete(id);
  if (!category) {
    return res.status(404).json(new apiError(404, "Category not found"));
  }
  return res
    .status(200)
    .json(new apiResponse(200, category, "Category deleted"));
});

const update_category = asynhandler(async (req, res) => {
  const { id } = req.params;

  const { service_category_name, description } = req.body;

  if (!service_category_name || !description) {
    return res.status(400).json(new apiError(400, "All fields are required"));
  }

  // check duplicate (excluding current id)
  const existingCategory = await ServiceCategory.findOne({
    service_category_name,
    _id: { $ne: id }, // 👉 current document ignore karega
  });

  if (existingCategory) {
    throw new apiError(400, "Category name already exists");
  }

  const category = await ServiceCategory.findByIdAndUpdate(
    id,
    {
      service_category_name,
      description,
    },
    { new: true },
  );

  if (!category) {
    return res.status(404).json(new apiError(404, "Category not found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, category, "Category updated"));
});

export { create_category, get_all_category, delete_category, update_category };
