import { Injectable } from "@nestjs/common";
import pino from "pino";
import { createWriteStream } from "fs";

@Injectable()
export class LoggerService {
  logger: pino.Logger;

  // constructor() {
  //   this.logger = pino({}, logFileStream);
  // }

  getLogger(err: any): pino.Logger {
    const logFileStream = createWriteStream("logs/error.log", { flags: "a" });
    const logger = pino(
      {
        level: "error",
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`, // Custom timestamp format
        serializers: {
          error: errorSerializer,
          req: pino.stdSerializers.req,
          res: pino.stdSerializers.res
        }
      },
      logFileStream
    );
    logger.error(err);
    return logger;
  }
}

function errorSerializer(error: any) {
  return {
    message: error.message,
    status: error.status,
    code: error.code,
    stackTrace: error.stack // Optionally include stack trace
  };
}
