import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helpers/pick";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.createScheduleFromDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule Created Successfully",
    data: result,
  });
});

const schedulesForDoctor = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["startDateTime", "endDateTime"]);

  const result = await ScheduleService.schedulesForDoctorFromDB(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule Retrieved Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.deleteSchedule(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule Delete Successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  schedulesForDoctor,
  deleteSchedule,
};
