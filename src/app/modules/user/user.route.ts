import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helpers/FileUploader";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// router.post(
//   "/create-doctor",
//   fileUploader.upload.single("file"),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = UserValidation.createDoctorValidationSchema.parse(
//       JSON.parse(req.body.data)
//     );
//     return UserController.createDoctor(req, res, next);
//   }
// );

// creating patient
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createPatientValidationSchema),
  UserController.createPatient
);

// creating doctor
router.post(
  "/create-doctor",
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createDoctorValidationSchema),
  UserController.createDoctor
);

// creating admin
router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createAdminValidationSchema),
  UserController.createAdmin
);

export const userRouter = router;
