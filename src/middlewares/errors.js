import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };

  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    // TODO: resolve this duplicate field
    // defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
    defaultError.msg = `duplicate field has to be unique`;
  }

  res.status(defaultError.statusCode).json({
    success: false,
    message: defaultError.msg,
  });
};


