import {
  AppointmentStatus,
  PaymentStatus,
  Prescription,
  Prisma,
  UserRole,
} from "@prisma/client";
import { IJwtUserPayload } from "../../types/common";
import { prisma } from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { IOptions, paginationHelper } from "../../helpers/paginationHelper";

const createPrescriptionFormDB = async (
  user: IJwtUserPayload,
  payload: Partial<Prescription>
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETE,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (user.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This is not your appointment"
      );
    }
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null,
    },
  });

  return result;
};

const getMyPrescriptionFormDB = async (
  user: IJwtUserPayload,
  options: IOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  // way - 1
  // const andConditions: Prisma.PrescriptionWhereInput[] = [];

  // if (user.role === UserRole.PATIENT) {
  //   andConditions.push({
  //     patient: {
  //       email: user.email,
  //     },
  //   });
  // } else if (user.role === UserRole.DOCTOR) {
  //   andConditions.push({
  //     doctor: {
  //       email: user.email,
  //     },
  //   });
  // }

  // const whereConditions: Prisma.PrescriptionWhereInput =
  //   andConditions.length > 0 ? { AND: andConditions } : {};

  // const result = await prisma.prescription.findMany({
  //   where: whereConditions,
  //   skip,
  //   take: limit,
  //   orderBy: {
  //     [sortBy]: sortOrder,
  //   },
  //   include:
  //     user.role === UserRole.DOCTOR ? { patient: true } : { doctor: true },
  // });

  // const total = await prisma.prescription.count({
  //   where: whereConditions,
  // });

  // way -2
  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user.email,
      },
    },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });

  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user.email,
      },
    },
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

export const PrescriptionService = {
  createPrescriptionFormDB,
  getMyPrescriptionFormDB,
};
