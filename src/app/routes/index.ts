import express from "express";
import { userRouter } from "../modules/user.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
