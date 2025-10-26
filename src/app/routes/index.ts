import express from "express";
import { userRouter } from "../modules/user/user.route";
import { authRouter } from "../modules/auth/auth.route";
import { scheduleRouter } from "../modules/schedule/schedule.route";
import { doctorScheduleRouter } from "../modules/doctorSchedule/doctorSchedule.route";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.route";
import { doctorRouter } from "../modules/doctor/doctor.route";
import { appointmentRouter } from "../modules/appointment/appointment.route";
import { prescriptionRouter } from "../modules/prescripsion/prescription.route";
import { reviewRouter } from "../modules/reviews/review.route";
import { PatientRoutes } from "../modules/patient/patient.route";

const router = express.Router();

const moduleRoutes = [
  // {
  //     path: '/',
  //     route: router
  // }
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/schedule",
    route: scheduleRouter,
  },
  {
    path: "/doctor-schedule",
    route: doctorScheduleRouter,
  },
  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },
  {
    path: "/doctor",
    route: doctorRouter,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/appointment",
    route: appointmentRouter,
  },
  {
    path: "/prescription",
    route: prescriptionRouter,
  },
  {
    path: "/reviews",
    route: reviewRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
