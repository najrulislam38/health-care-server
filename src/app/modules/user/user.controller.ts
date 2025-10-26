import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserServices } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helpers/pick";
import { IJwtUserPayload } from "../../types/common";

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
  const filters = pick(req.query, ["status", "role", "email", "searchTerm"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  // const { page, limit, searchTerm, sortBy, sortOrder, role, status } =
  //   req.query;
  const result = await UserServices.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Users Retrieved Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;

    const result = await UserServices.getMyProfileFromDB(
      user as IJwtUserPayload
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Users Retrieved Successfully",
      data: result,
    });
  }
);

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User Profile status changed Successfully",
    data: result,
  });
});

export const UserController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUser,
  getMyProfile,
  changeProfileStatus,
};
