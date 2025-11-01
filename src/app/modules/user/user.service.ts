import { Request } from "express";
import config from "../../../config";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helpers/FileUploader";
import { Prisma, UserRole, UserStatus } from "@prisma/client";

import { userSearchableFields } from "./user.contants";
import { paginationHelper } from "../../helpers/paginationHelper";
import { IJwtUserPayload } from "../../types/common";

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

const getAllFromDB = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  //   const result = await prisma.user.findMany({
  //   skip,
  //   take: limitNumber,
  //   where: {
  //     email: {
  //       contains: searchTerm,
  //       mode: "insensitive",
  //     },
  //     role: role,
  //     status: status,
  //   },
  //   orderBy:
  //     sortBy && sortOrder
  //       ? {
  //           [sortBy]: sortOrder,
  //         }
  //       : {
  //           createdAt: "desc",
  //         },
  // });

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyProfileFromDB = async (user: IJwtUserPayload) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
    },
  });

  let profileData;

  if (userInfo.role === UserRole.PATIENT) {
    profileData = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return {
    ...userInfo,
    ...profileData,
  };
};

const changeProfileStatus = async (
  id: string,
  payload: { status: UserStatus }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  return updateUserStatus;
};

const updateMyProfile = async (user: IJwtUserPayload, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;

  if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }

  return { ...profileInfo };
};

export const UserServices = {
  createPatientFromDB,
  createDoctorFromDB,
  createAdminFromDB,
  getAllFromDB,
  getMyProfileFromDB,
  changeProfileStatus,
  updateMyProfile,
};
