const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get All Events (Public) - Nanti kita tambah pagination disini
const getEvents = async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: { select: { name: true } }
      },
      orderBy: { date: 'asc' }
    });

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Event Detail (Public)
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

// Create Event (Admin Only)
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

// Update Event (Admin Only)
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

// Delete Event (Admin Only)
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