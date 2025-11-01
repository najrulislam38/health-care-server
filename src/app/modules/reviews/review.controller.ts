import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJwtUserPayload } from "../../types/common";
import { ReviewService } from "./review.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../helpers/pick";
import { reviewFilterableFields } from "./review.constant";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IJwtUserPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.insertIntoDB(
      user as IJwtUserPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ReviewService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  insertIntoDB,
  getAllReviews,
};
