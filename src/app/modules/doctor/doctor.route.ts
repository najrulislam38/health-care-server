import express from "express";
import { DoctorController } from "./doctor.controller";

const router = express.Router();

router.get("/", DoctorController.getAll);

router.post("/suggestion", DoctorController.getAISuggestions);

router.patch("/:id", DoctorController.updateIntoDB);

export const doctorRouter = router;
