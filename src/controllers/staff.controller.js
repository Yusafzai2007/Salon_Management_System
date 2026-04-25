import { asynhandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Service } from "../models/service.model.js";
import { Staff } from "../models/staff.model.js";

const create_staf = asynhandler(async (req, res) => {
  const { userName, phone_number, experience, address, Service_Name } =
    req.body;

  // ✅ validation
  if (!userName || !phone_number || !experience || !address || !Service_Name) {
    throw new apiError(400, "all fields are required");
  }

  // ✅ check Service_Name array
  if (!Array.isArray(Service_Name)) {
    throw new apiError(400, "Service_Name must be an array");
  }

  // ✅ find user
  const finduser = await User.findOne({ userName: userName.trim() });
  if (!finduser) {
    throw new apiError(404, `user with ${userName} not found`);
  }
  finduser.role = "staff";
  await finduser.save();
  if (finduser.role === "admin") {
    throw new apiError(400, "admin cannot be converted to staff");
  }

  // ✅ find services by names
  const services = await Service.find({
    Service_Name: { $in: Service_Name },
  });

  // ❌ agar koi service missing ho
  if (services.length !== Service_Name.length) {
    throw new apiError(400, "Some services not found");
  }

  // ✅ extract IDs
  const serviceIds = services.map((s) => s._id);

  // ✅ create staff
  const staff = await Staff.create({
    user_id: finduser._id,
    phone_number,
    experience,
    address,
    service_id: serviceIds,
  });

  res.status(201).json(new apiResponse("staff created successfully", staff));
});

const update_staff = asynhandler(async (req, res) => {
  const { id } = req.params;
  const { userName, phone_number, experience, address, Service_Name } =
    req.body;

  // 1. validation
  if (!userName || !phone_number || !experience || !address || !Service_Name) {
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

export { create_staf, update_staff, get_staff, delete_staff };
