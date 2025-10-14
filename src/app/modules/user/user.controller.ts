import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserServices } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helpers/pick";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createPatientFromDB(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient Created Successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createDoctorFromDB(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Created Successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdminFromDB(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Created Successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const { page, limit, searchTerm, sortBy, sortOrder, role, status } =
    req.query;
  const result = await UserServices.getAllFromDB({
    page: Number(page),
    limit: Number(limit),
    searchTerm,
    sortBy,
    sortOrder,
    role,
    status,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Users Retrieved Successfully",
    data: result,
  });
});

export const UserController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUser,
};
