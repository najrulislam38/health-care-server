import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { IJwtUserPayload } from "../../types/common";

const createAppointment = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.createAppointmentFromDB(
      user as IJwtUserPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Appointment Created successfully",
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
};
