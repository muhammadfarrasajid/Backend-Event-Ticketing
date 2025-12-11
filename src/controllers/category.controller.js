const prisma = require('../config/database');
const { sendResponse } = require('../utils/response.util');

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { events: true } } }
    });
    return sendResponse(res, 200, 'Categories retrieved successfully', categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: { _count: { select: { events: true } } }
    });

    if (!category) return sendResponse(res, 404, 'Category not found');

    return sendResponse(res, 200, 'Category detail retrieved', category);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name },
    });

    return sendResponse(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existing = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!existing) return sendResponse(res, 404, 'Category not found');

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    return sendResponse(res, 200, 'Category updated successfully', category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!existing) return sendResponse(res, 404, 'Category not found');

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return sendResponse(res, 204, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };