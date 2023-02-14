import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NotFoundError, UnAuthenticatedError } from "../utils/errors";
import { prisma } from '../../prisma/prisma.client';

export const register = async (req, res) => {
  const encryptedPassword = await generateEncryptedPassword(req.body.password);
  const user = await prisma.user.create({
    data: {
      ...req.body,
      password: encryptedPassword,
    }
  });

  const token = generateJwtToken(user.id);
  user.password = undefined;
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: { user, token },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  const user = await prisma.user.findFirst({
    where: {
      email
    }
  });
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await comparePassword(user.password, password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = generateJwtToken(user.id);
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token });
};

export const me = async (req, res) => {
  const { userId } = req.user;
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) {
    throw new NotFoundError(`No user with id :${userId}`);
  }
  user.password = undefined;
  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
  });
};

export const findAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(StatusCodes.OK).json({
    success: true,
    data: users,
  });
};

const generateEncryptedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const encryptedPWD = await bcrypt.hash(password, salt);
  return encryptedPWD;
}

const generateJwtToken = userId => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const comparePassword = async function (password, candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, password);
  return isMatch;
};