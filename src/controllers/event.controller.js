const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, sortBy = 'date', order = 'asc' } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
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
      whereClause.category = {
        name: { contains: category }
      };
    }

    const orderBy = {};
    if (sortBy === 'price' || sortBy === 'date' || sortBy === 'stock') {
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
        include: {
          category: { select: { name: true } }
        }
      }),
      prisma.event.count({ where: whereClause })
    ]);

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      data: events,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        _count: { select: { tickets: true } }
      }
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Event detail retrieved',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, price, stock, categoryId } = req.body;

    if (!title || !date || !price || !categoryId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, price, stock, categoryId } = req.body;

    const existing = await prisma.event.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ success: false, message: 'Event not found' });

    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        location,
        price: price ? Number(price) : undefined,
        stock: stock ? Number(stock) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.event.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ success: false, message: 'Event not found' });

    await prisma.event.delete({ where: { id: Number(id) } });

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };