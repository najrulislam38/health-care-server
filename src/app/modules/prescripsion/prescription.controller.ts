import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJwtUserPayload } from "../../types/common";
import { PrescriptionService } from "./prescription.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../helpers/pick";

const createPrescription = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;

    const result = await PrescriptionService.createPrescriptionFormDB(
      user as IJwtUserPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Prescription Created successfully",
      data: result,
    });
  }
);
const getMyPrescription = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    // const filters = pick(req.query, [""]);

    const result = await PrescriptionService.getMyPrescriptionFormDB(
      user as IJwtUserPayload,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescriptions Retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const PrescriptionController = {
  createPrescription,
  getMyPrescription,
};
