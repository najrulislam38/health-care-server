import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleController.schedulesForDoctor
);

router.post("/create", auth(UserRole.ADMIN), ScheduleController.createSchedule);

router.delete("/:id", auth(UserRole.ADMIN), ScheduleController.deleteSchedule);

export const scheduleRouter = router;
