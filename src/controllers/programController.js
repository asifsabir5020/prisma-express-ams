import { StatusCodes } from "http-status-codes";
import { prisma } from "../../prisma/prisma.client";
import { NotFoundError } from "../utils/errors";
import { withValidation } from "../utils/validations";

export const findAll = async (req, res) => {
  const programs = await prisma.program.findMany();
  res.status(StatusCodes.OK).json({
    success: true,
    data: programs,
  });
};

export const create = async (req, res) => {
  const program = await prisma.program.create({
    data: withValidation(req.body, {
      title: [{ required: true }],
    })
  });
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: program,
  });
};

export const findOne = async (req, res) => {
  const { id } = req.params;
  const program = await prisma.program.findUnique({
    where: {
      id: +id
    }
  });

  if (!program) {
    throw new NotFoundError(`No program with id :${id}`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: program,
  });
};

export const update = async (req, res) => {
  const { id } = req.params;
  const program = await prisma.program.findUnique({
    where: {
      id: +id
    }
  });

  if (!program) {
    throw new NotFoundError(`No program with id :${id}`);
  }

  const updatedprogram = await prisma.program.update({
    where: {
      id: +id
    },
    data: { ...req.body },
  })

  res.status(StatusCodes.OK).json({
    success: true,
    data: updatedprogram,
  });
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const program = await prisma.program.findUnique({
    where: {
      id: +id
    }
  });

  if (!program) {
    throw new NotFoundError(`No program with id :${id}`)
  }

  await prisma.program.delete({
    where: {
      id: +id
    },
  })

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Success! program removed',
  });
}