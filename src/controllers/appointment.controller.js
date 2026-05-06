import { asynhandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Service } from "../models/service.model.js";
import { Staff } from "../models/staff.model.js";
import { Appointment } from "../models/appointment.model.js";

const create_appointment = asynhandler(async (req, res) => {
  const { staffName, Service_Name, appointment_date, appointmentSchema_time } =
    req.body;

  console.log("USER:", req.user._id);
  const userId = req.user?._id; // 👈 direct ID

  if (
    !userId ||
    !staffName ||
    !Service_Name ||
    !appointment_date ||
    !appointmentSchema_time
  ) {
    throw new apiError(400, "All fields are required");
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

  const newAppointment = await Appointment.create({
    user_id: userId, // 👈 direct save
    staff_id: findstaff._id,
    service_id: findservice._id,
    appointment_date,
    appointmentSchema_time,
  });

  return res
    .status(201)
    .json(
      new apiResponse(201, newAppointment, "Appointment created successfully"),
    );
});

const update_appointment = asynhandler(async (req, res) => {
  const { id } = req.params;
  const { staffName, Service_Name, appointment_date, appointmentSchema_time } =
    req.body;

  if (
    !staffName ||
    !Service_Name ||
    !appointment_date ||
    !appointmentSchema_time
  ) {
    throw new apiError(400, "All fields are required");
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

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    {
      staff_id: findstaff._id,
      service_id: findservice._id,
      appointment_date,
      appointmentSchema_time,
    },
    { new: true },
  );

  if (!updatedAppointment) {
    throw new apiError(404, `Appointment with ID ${id} not found`);
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        updatedAppointment,
        "Appointment updated successfully",
      ),
    );
});

const delete_appointment = asynhandler(async (req, res) => {
  const { id } = req.params;

  const deletedAppointment = await Appointment.findByIdAndDelete(id);

  if (!deletedAppointment) {
    throw new apiError(404, `Appointment with ID ${id} not found`);
  }

  return res
    .status(200)
    .json(new apiResponse(200, null, "Appointment deleted successfully"));
});

const get_appointment = asynhandler(async (req, res) => {
  const appointment = await Appointment.find()
    .populate("user_id", "name email")
    .populate("staff_id", "userName")
    .populate("service_id", "Service_Name");
  if (!appointment) {
    throw new apiError(404, `Appointment with ID ${id} not found`);
  }
  return res
    .status(200)
    .json(
      new apiResponse(200, appointment, "Appointment retrieved successfully"),
    );
});

export {
  create_appointment,
  update_appointment,
  delete_appointment,
  get_appointment,
};
