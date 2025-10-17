import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(
    DoctorScheduleValidation.createDoctorScheduleValidationSchema
  ),
  auth(UserRole.DOCTOR),
  DoctorScheduleController.insertIntoDB
);

export const doctorScheduleRouter = router;
