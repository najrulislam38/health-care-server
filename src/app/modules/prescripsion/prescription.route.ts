import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PrescriptionController } from "./prescription.controller";

const router = express.Router();

router.get(
  "/my-prescription",
  auth(UserRole.DOCTOR, UserRole.PATIENT),
  PrescriptionController.getMyPrescription
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  PrescriptionController.createPrescription
);

export const prescriptionRouter = router;
