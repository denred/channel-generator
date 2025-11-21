import pino from "pino";

import { Env } from "@/config/env";

export const logger = pino({
  level: Env.LOG_LEVEL,
  base: undefined,
  browser: {
    asObject: true,
  },
});
