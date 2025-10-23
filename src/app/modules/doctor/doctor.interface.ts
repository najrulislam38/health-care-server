import { Gender } from "@prisma/client";

export type IDoctorUpdateInput = {
  name: string;
  id: string;
  email: string;
  contactNumber: string;
  gender: Gender;
  appointmentFee: number;
  profilePhoto: string | null;
  address: string | null;
  registrationNumber: string;
  experience: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted: boolean;
  specialties: {
    specialtyId: string;
    isDeleted?: boolean;
  }[];
};
