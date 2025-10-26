import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helpers/FileUploader";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllUser);

router.get(
  "/me",
  auth(...Object.values(UserRole)),
  UserController.getMyProfile
);

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
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createDoctorValidationSchema),
  UserController.createDoctor
);

// creating admin
router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createAdminValidationSchema),
  UserController.createAdmin
);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  UserController.changeProfileStatus
);

export const userRouter = router;
