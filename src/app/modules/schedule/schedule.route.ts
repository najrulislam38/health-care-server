import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/create", ScheduleController.createSchedule);

export const scheduleRouter = router;
