import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { IJwtUserPayload } from "../../types/common";
import { pick } from "../../helpers/pick";
import { IOptions } from "../../helpers/paginationHelper";

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

const getMyAppointment = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["status", "paymentStatus"]);

    const result = await AppointmentService.getMyAppointmentFromDB(
      user as IJwtUserPayload,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Appointments Retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAllAppointment = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["status", "paymentStatus"]);

  const result = await AppointmentService.getAllAppointmentFromDB(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Appointments Retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  getAllAppointment,
};
