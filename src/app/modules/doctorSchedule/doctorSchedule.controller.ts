import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IJwtUserPayload } from "../../types/common";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDB(
      user as IJwtUserPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Doctor Schedule Created Successfully",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  insertIntoDB,
};
