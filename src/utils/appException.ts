import { ErrorMessages } from "@/libs/constants/errorMessages";
import type { AppErrors } from "@/libs/enums/appErrors";
import { HttpCode } from "@/libs/enums/httpCode";

export class AppException extends Error {
  code: AppErrors;
  status: number;

  constructor(code: AppErrors, status: number = HttpCode.BAD_REQUEST) {
    super(ErrorMessages[code]);
    this.code = code;
    this.status = status;
  }
}
