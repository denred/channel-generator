import { ErrorMessages } from "@/libs/constants/errorMessages";
import { AppErrors } from "@/libs/enums/appErrors";
import { HttpCode } from "@/libs/enums/httpCode";

import { AppException } from "./appException";
import { logger } from "./logger";

interface ErrorResponse {
  error: AppErrors;
  message: string;
  status: number;
}

export const getErrorResponse = (err: unknown): ErrorResponse => {
  logger.error(err);

  if (err instanceof AppException) {
    return {
      error: err.code,
      message: err.message,
      status: err.status,
    };
  }

  if (err instanceof Error) {
    return {
      error: AppErrors.UNKNOWN_ERROR,
      message: err.message,
      status: HttpCode.INTERNAL_SERVER_ERROR,
    };
  }

  return {
    error: AppErrors.UNKNOWN_ERROR,
    message: ErrorMessages[AppErrors.UNKNOWN_ERROR],
    status: HttpCode.INTERNAL_SERVER_ERROR,
  };
};
