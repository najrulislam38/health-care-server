import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IJwtUserPayload } from "../../types/common";
import httpStatus from "http-status";
import { pick } from "../../helpers/pick";
import { scheduleFilterableFields } from "./doctorSchedule.constant";

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

const getMySchedule = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const user = req.user;
    const result = await DoctorScheduleService.getMySchedule(
      filters,
      options,
      user as IJwtUserPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Schedule fetched successfully!",
      data: result,
    });
  }
);

const deleteFromDB = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleService.deleteFromDB(
      user as IJwtUserPayload,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Schedule deleted successfully!",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DoctorScheduleService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Schedule retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const DoctorScheduleController = {
  insertIntoDB,
  getMySchedule,
  getAllFromDB,
  deleteFromDB,
};
