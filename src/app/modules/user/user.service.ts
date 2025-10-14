import { Request } from "express";
import config from "../../../config";
import { prisma } from "../../shared/prisma";
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

  // console.log("Result ", req.body.doctor.profilePhoto);

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

  // console.log("Result ", req.body.admin.profilePhoto);

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

const getAllFromDB = async ({
  page,
  limit,
  searchTerm,
  sortBy,
  sortOrder,
  role,
  status,
}: {
  page: number;
  limit: number;
  searchTerm?: any;
  sortBy?: any;
  sortOrder?: any;
  role?: any;
  status?: any;
}) => {
  const pageNumber = page || 1;
  const limitNumber = limit || 10;

  const skip = (pageNumber - 1) * limitNumber;

  const result = await prisma.user.findMany({
    skip,
    take: limitNumber,
    where: {
      email: {
        contains: searchTerm,
        mode: "insensitive",
      },
      role: role,
      status: status,
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  return result;
};

export const UserServices = {
  createPatientFromDB,
  createDoctorFromDB,
  createAdminFromDB,
  getAllFromDB,
};
