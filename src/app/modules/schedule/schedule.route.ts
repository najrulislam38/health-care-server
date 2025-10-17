import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.get("/", ScheduleController.schedulesForDoctor);

router.post("/create", ScheduleController.createSchedule);

router.delete("/:id", ScheduleController.deleteSchedule);

export const scheduleRouter = router;
