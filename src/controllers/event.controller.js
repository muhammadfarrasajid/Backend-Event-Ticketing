const prisma = require('../config/database');
const { sendResponse } = require('../utils/response.util');

const getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, sortBy = 'date', order = 'asc' } = req.query;
    
    const pageNumber = Number(page);
    let limitNumber = Number(limit);

    if (limitNumber > 50) {
      limitNumber = 50;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const whereClause = {};
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } }
      ];
    }
    if (category) {
      whereClause.category = { name: { contains: category } };
    }

    const orderBy = {};
    if (['price', 'date', 'stock'].includes(sortBy)) {
      orderBy[sortBy] = order === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.date = 'asc';
    }

    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({
        where: whereClause,
        skip: skip,
        take: limitNumber,
        orderBy: orderBy,
        include: { category: { select: { name: true } } }
      }),
      prisma.event.count({ where: whereClause })
    ]);

    const pagination = {
      totalRecords: total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      limit: limitNumber
    };

    sendResponse(res, 200, 'Events retrieved successfully', events, pagination);
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: { category: true, _count: { select: { tickets: true } } }
    });

    if (!event) return sendResponse(res, 404, 'Event not found');
    sendResponse(res, 200, 'Event detail retrieved', event);
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, price, stock, categoryId } = req.body;
    const event = await prisma.event.create({
      data: {
        title, description, location,
        date: new Date(date),
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
      },
    });

    sendResponse(res, 201, 'Event created successfully', event);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, price, stock, categoryId } = req.body;

    const existing = await prisma.event.findUnique({ where: { id: Number(id) } });
    if (!existing) return sendResponse(res, 404, 'Event not found');

    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title, description, location,
        date: date ? new Date(date) : undefined,
        price: price ? Number(price) : undefined,
        stock: stock ? Number(stock) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
    });

    sendResponse(res, 200, 'Event updated successfully', event);
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.event.findUnique({ where: { id: Number(id) } });
    if (!existing) return sendResponse(res, 404, 'Event not found');

    await prisma.event.delete({ where: { id: Number(id) } });

    sendResponse(res, 204, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };