import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { pick } from "../../helpers/pick";
import { IJwtUserPayload } from "../../types/common";
import { doctorFilterableFields } from "./doctor.constant";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, doctorFilterableFields);
  const result = await DoctorService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctors Retrieved Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DoctorService.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctors Retrieved Successfully",

    data: result,
  });
});

const getAISuggestions = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getAISuggestions(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "AI suggestions fetched successfully",
    data: result,
  });
});
export const DoctorController = {
  getAll,
  updateIntoDB,
  getAISuggestions,
};
