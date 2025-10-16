import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.createScheduleFromDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule Created Successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
};
