import jwt from "jsonwebtoken";
import { UnAuthenticatedError, UnAuthorizedError } from "../utils/errors";
import { prisma } from '../../prisma/prisma.client';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: +payload.userId
      }
    });
    if (!user) {
      throw new UnAuthenticatedError("Authentication Invalid");
    }
    req.user = { userId: user.id, userRole: user.role };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.userRole;
    if (!roles.includes(userRole)) {
      return next(
        new UnAuthorizedError(
          `Role (${userRole}) is not allowed to access this resource`
        )
      );
    }
    next();
  };
};
