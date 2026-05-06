import { asynhandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Service } from "../models/service.model.js";
import { Staff } from "../models/staff.model.js";

const create_staf = asynhandler(async (req, res) => {
  const {
    userName,
    phone_number,
    experience,
    address,
    Service_Name,
    description,
  } = req.body;

  // ✅ 1. Basic validation
  if (!userName || !phone_number || !experience || !address || !description) {
    throw new apiError(400, "All fields are required");
  }

  // ✅ 2. Service validation (IMPORTANT FIX)
  if (
    !Service_Name ||
    !Array.isArray(Service_Name) ||
    Service_Name.length === 0
  ) {
    throw new apiError(
      400,
      "Service_Name is required and must be a non-empty array",
    );
  }

  // clean services (extra safety)
  const cleanedServices = Service_Name.map((s) => s.trim()).filter(Boolean);

  if (cleanedServices.length === 0) {
    throw new apiError(400, "Service_Name cannot be empty");
  }

  // ✅ 3. Find user
  const finduser = await User.findOne({ userName: userName.trim() });

  if (!finduser) {
    throw new apiError(404, `User with ${userName} not found`);
  }

  // ❌ prevent admin conversion
  if (finduser.role === "admin") {
    throw new apiError(400, "Admin cannot be converted to staff");
  }

  // ✅ update role
  finduser.role = "staff";
  await finduser.save();

  // ✅ 4. Find services
  const services = await Service.find({
    Service_Name: { $in: cleanedServices },
  });

  if (!services || services.length === 0) {
    throw new apiError(404, "No services found");
  }

  if (services.length !== cleanedServices.length) {
    throw new apiError(400, "Some services not found");
  }

  // ✅ 5. Extract service IDs
  const serviceIds = services.map((s) => s._id);

  // ✅ 6. Create staff
  const staff = await Staff.create({
    user_id: finduser._id,
    phone_number,
    experience,
    address,
    service_id: serviceIds,
    description,
  });

  // ✅ 7. Return populated staff (FIXED)
  const populatedStaff = await Staff.findById(staff._id)
    .populate("user_id")
    .populate("service_id");

  return res
    .status(201)
    .json(new apiResponse(201, populatedStaff, "Staff created successfully"));
});

const update_staff = asynhandler(async (req, res) => {
  const { id } = req.params;
  const {
    userName,
    phone_number,
    experience,
    address,
    Service_Name,
    description,
  } = req.body;

  // 1. validation
  if (
    !userName ||
    !phone_number ||
    !experience ||
    !address ||
    !Service_Name ||
    !description
  ) {
    throw new apiError(400, "All fields are required");
  }

  if (!Array.isArray(Service_Name)) {
    throw new apiError(400, "Service_Name must be an array");
  }

  // 2. find user
  const finduser = await User.findOne({ userName: userName.trim() });
  if (!finduser) {
    throw new apiError(404, `user with ${userName} not found`);
  }

  // 3. find services
  const services = await Service.find({
    Service_Name: { $in: Service_Name },
  });

  if (services.length !== Service_Name.length) {
    throw new apiError(400, "Some services not found");
  }

  const serviceIds = services.map((s) => s._id);

  // 4. update staff
  const staff = await Staff.findByIdAndUpdate(
    id,
    {
      user_id: finduser._id,
      phone_number,
      experience,
      address,
      service_id: serviceIds,
      description,
    },
    { new: true },
  );

  if (!staff) {
    throw new apiError(404, "Staff not found");
  }

  // 5. correct response
  res
    .status(200)
    .json(new apiResponse(200, "Staff updated successfully", staff));
});

const get_staff = asynhandler(async (req, res) => {
  const staff = await Staff.find()
    .populate("user_id")
    .select("-password")
    .populate("service_id");
  res
    .status(200)
    .json(new apiResponse(200, "Staff retrieved successfully", staff));
});

const delete_staff = asynhandler(async (req, res) => {
  const { id } = req.params;
  const staff = await Staff.findByIdAndDelete(id);
  if (!staff) {
    throw new apiError(404, "Staff not found");
  }
  res.status(200).json(new apiResponse(200, "Staff deleted successfully"));
});

const single_staff = asynhandler(async (req, res) => {
  const { id } = req.params;
  const staff = await Staff.findById(id)
    .populate("user_id")
    .select("-password")
    .populate("service_id");
  if (!staff) {
    throw new apiError(404, "Staff not found");
  }

  res
    .status(200)
    .json(new apiResponse(200, "Staff retrieved successfully", staff));
});

export { create_staf, update_staff, get_staff, delete_staff, single_staff };
