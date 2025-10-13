import z, { email } from "zod";

const createAdminValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email({
      error: "Email is required",
    }),
    contactNumber: z.string({
      error: "contactNumber is required",
    }),
    address: z.string().optional(),
  }),
});

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email({
      error: "Email is required",
    }),
    address: z.string().optional(),
  }),
});

const createDoctorValidationSchema = z.object({
  password: z.string(),
  doctor: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email({
      error: "Email is required",
    }),
    address: z.string().optional(),
    registrationNumber: z.string({
      error: "registrationNumber is required",
    }),
    contactNumber: z.string({
      error: "contactNumber is required",
    }),
    experience: z.number(),
    gender: z.enum(["MALE", "FEMALE"]),
    appointmentFee: z.number({ error: "appointmentFee required" }),
    qualification: z.string({ error: "qualification required" }),
    currentWorkingPlace: z.string({ error: "currentWorkingPlace required" }),
    designation: z.string({ error: "designation required" }),
  }),
});

export const UserValidation = {
  createPatientValidationSchema,
  createDoctorValidationSchema,
  createAdminValidationSchema,
};
