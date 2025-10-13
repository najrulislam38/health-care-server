import { Request } from "express";
import config from "../../../config";
import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helpers/FileUploader";
import { UserRole } from "@prisma/client";

const createPatientFromDB = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadResult?.secure_url;
  }
  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(config.round_salt)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
      },
    });

    return await tnx.patient.create({
      data: req.body.patient,
    });
  });

  return result;
};

const createDoctorFromDB = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.doctor.profilePhoto = uploadResult?.secure_url;
  }

  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(config.round_salt)
  );

  console.log("Result ", req.body.doctor.profilePhoto);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.doctor.email,
        password: hashPassword,
        role: UserRole.DOCTOR,
      },
    });

    return await tnx.doctor.create({
      data: req.body.doctor,
    });
  });

  return result;
};

const createAdminFromDB = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.admin.profilePhoto = uploadResult?.secure_url;
  }

  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(config.round_salt)
  );

  console.log("Result ", req.body.admin.profilePhoto);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN,
      },
    });

    return await tnx.admin.create({
      data: req.body.admin,
    });
  });

  return result;
};

export const UserServices = {
  createPatientFromDB,
  createDoctorFromDB,
  createAdminFromDB,
};
