import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const validateRequest =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //   await schema.parseAsync({
    //     body: req.body,
    //   });
    // } catch (error) {
    //   next(error);
    // }
    //   await schema.parseAsync({
    //     body: req.body,
    //   });

    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }

      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
