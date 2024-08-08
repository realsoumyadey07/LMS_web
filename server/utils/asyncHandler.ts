import { NextFunction, Request, Response } from "express";

const asyncHandler =
  (theFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };

export default asyncHandler;
