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

router.post("/create", ScheduleController.createSchedule);

router.delete("/:id", ScheduleController.deleteSchedule);

export const scheduleRouter = router;
