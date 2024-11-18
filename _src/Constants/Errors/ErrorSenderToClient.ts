// Express
import { Response } from "express";
// Express

// Types
import { T_ErrorDataType } from "../../Validators/checkIsNull";
// Types

export const ErrorSenderToClient = <T extends any>(
  errData: T_ErrorDataType<T>,
  statusCode: number,
  res: Response
) => {
  res.status(statusCode).send(errData);
};
