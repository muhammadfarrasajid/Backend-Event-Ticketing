const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get All Categories (Public)
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { events: true } } }
    });
    
    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Create Category (Admin Only)
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Update Category (Admin Only)
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Cek dulu apakah kategori ada
    const existing = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ success: false, message: 'Category not found' });

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Category (Admin Only)
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ success: false, message: 'Category not found' });

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };