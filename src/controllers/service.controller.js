import { asynhandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { cloudinaryimg } from "../utils/cloudinary.js";
import { Service } from "../models/service.model.js";
import { ServiceCategory } from "../models/service.category.model.js";

const create_service = asynhandler(async (req, res) => {
  const {
    service_category_name,
    price,
    Service_Name,
    final_price,
    duration,
    description,
    category,
    discount,
  } = req.body;

  if (
    !Service_Name ||
    !service_category_name ||
    !price ||
    !final_price ||
    !duration ||
    !description
  ) {
    throw new apiError(400, "All fields are required");
  }

  if (isNaN(price) || isNaN(final_price)) {
    throw new apiError(400, "Price and final price must be numbers");
  }

  const check_service = await Service.findOne({ Service_Name });
  if (check_service) {
    throw new apiError(400, "Service already exists");
  }

  const service_catrgory = await ServiceCategory.findOne({
    service_category_name,
  });

  if (!service_catrgory) {
    throw new apiError(404, "Service category not found");
  }

  const localImg = req.files?.service_Image.map((file) => file.path);

  if (!localImg) {
    throw new apiError(400, "Imgages are required");
  }

  const uploadedImg = [];

  for (const img of localImg) {
    const uploadImg = await cloudinaryimg(img);
    if (!uploadImg) {
      throw new apiError(400, "product img is not uploaded");
    }
    uploadedImg.push(uploadImg.url);
  }

  const service = await Service.create({
    Service_Name,
    price,
    discount: 0,
    final_price,
    duration,
    description,
    category: service_catrgory._id,
    service_Image: uploadedImg,
  });

  if (!service) {
    throw new apiError(400, "Service not created");
  }
  res
    .status(200)
    .json(new apiResponse(200, service, "Service created successfully"));
});

const update_service = asynhandler(async (req, res) => {
  const { id } = req.params;

  const {
    Service_Name,
    price,
    duration,
    description,
    category,
    discount,
    service_category_name,
  } = req.body;

  // 1. Service exist check
  const service = await Service.findById(id);
  if (!service) {
    throw new apiError(404, "Service not found");
  }

  // 2. Update fields (only if provided)
  if (Service_Name) service.Service_Name = Service_Name;
  if (price) service.price = Number(price);
  if (duration) service.duration = duration;
  if (description) service.description = description;
  if (category) service.category = category;
  if (service_category_name) {
    const updatedCategory = await ServiceCategory.findOne({
      service_category_name,
    });
    if (!updatedCategory) {
      throw new apiError(404, "Updated service category not found");
    }
    service.category = updatedCategory._id;
  }

  // 3. Discount + final price update
  if (discount !== undefined) {
    const numericPrice = Number(price || service.price);
    const numericDiscount = Number(discount);

    service.discount = numericDiscount;
    service.final_price = numericPrice - (numericPrice * numericDiscount) / 100;
  }

  // 4. Image update (optional)
  if (req.files?.service_Image) {
    const localImg = req.files.service_Image.map((file) => file.path);

    const uploadedImg = [];

    for (const img of localImg) {
      const uploadImg = await cloudinaryimg(img);

      if (!uploadImg) {
        throw new apiError(400, "Image upload failed");
      }

      uploadedImg.push(uploadImg.url);
    }

    // replace old images
    service.service_Image = uploadedImg;
  }

  // 5. Save updated data
  await service.save();

  // 6. Response
  res
    .status(200)
    .json(new apiResponse(200, service, "Service updated successfully"));
});

const get_services = asynhandler(async (req, res) => {
  const services = await Service.find().populate(
    "category",
    "service_category_name description",
  );
  if (!services || services.length === 0) {
    throw new apiError(404, "No services found");
  }
  res
    .status(200)
    .json(new apiResponse(200, services, "Services retrieved successfully"));
});

const delete_service = asynhandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(400, "user not fount");
  }

  const delete_data = await Service.findByIdAndDelete(id);

  if (!delete_data) {
    throw new apiError(404, "Service not found");
  }

  res
    .status(200)
    .json(new apiResponse(200, null, "Service deleted successfully"));
});

export { create_service, update_service, get_services, delete_service };
