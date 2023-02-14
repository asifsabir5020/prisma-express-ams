import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../utils/errors";
import { prisma } from '../../prisma/prisma.client';
import { withValidation } from "../utils/validations";

export const findAll = async (req, res) => {
  const books = await prisma.book.findMany();
  res.status(StatusCodes.OK).json({
    success: true,
    data: books,
  });
};

export const create = async (req, res) => {
  const book = await prisma.book.create({
    data: withValidation(req.body, {
      title: [{ required: true }],
      author: [{ required: true }]
    })
  });
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: book,
  });
};

export const findOne = async (req, res) => {
  const { id } = req.params;
  const book = await prisma.book.findUnique({
    where: {
      id: +id
    }
  });

  if (!book) {
    throw new NotFoundError(`No book with id :${id}`);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: book,
  });
};

export const update = async (req, res) => {
  const { id } = req.params;
  const book = await prisma.book.findUnique({
    where: {
      id: +id
    }
  });

  if (!book) {
    throw new NotFoundError(`No book with id :${id}`);
  }

  const updatedBook = await prisma.book.update({
    where: {
      id: +id
    },
    data: { ...req.body },
  })

  res.status(StatusCodes.OK).json({
    success: true,
    data: updatedBook,
  });
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const book = await prisma.book.findUnique({
    where: {
      id: +id
    }
  });

  if (!book) {
    throw new NotFoundError(`No book with id :${id}`)
  }

  await prisma.book.delete({
    where: {
      id: +id
    },
  })

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Success! Book removed',
  });
}