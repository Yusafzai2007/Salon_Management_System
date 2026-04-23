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

export { create_staf };
