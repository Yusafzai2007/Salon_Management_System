import { asynhandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Service } from "../models/service.model.js";
import { Staff } from "../models/staff.model.js";

const create_apponitment = asynhandler(async (req, res) => {
  const {
    userName,
    staffName,
    Service_Name,
    appointment_date,
    appointment_time,
  } = req.body;
  if (
    !userName ||
    !staffName ||
    !Service_Name ||
    !appointment_date ||
    !appointment_time
  ) {
    throw new apiError(400, "All fields are required");
  }

  const finduser = await User.findOne({ userName: userName.trim() });
  if (!finduser) {
    throw new apiError(404, `user with ${userName} not found`);
  }
  const findstaff = await Staff.findOne({ userName: staffName.trim() });
  if (!findstaff) {
    throw new apiError(404, `staff with ${staffName} not found`);
  }
  const findservice = await Service.findOne({
    Service_Name: Service_Name.trim(),
  });
  if (!findservice) {
    throw new apiError(404, `service with ${Service_Name} not found`);
  }
});

export { create_apponitment };
