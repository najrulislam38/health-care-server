import config from "../../config";
import { prisma } from "../shared/prisma";
import { createPatientInput } from "./user/user.interface";
import bcrypt from "bcryptjs";

const createPatientFromDB = async (payload: createPatientInput) => {
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.round_salt)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.email,
        password: hashPassword,
      },
    });

    return await tnx.patient.create({
      data: {
        name: payload.name,
        email: payload.email,
      },
    });
  });

  console.log("result from service", result);

  return result;
};

export const UserServices = {
  createPatientFromDB,
};
