const prisma = require('../config/database');
const { sendResponse } = require('../utils/response.util');

const buyTicket = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) return sendResponse(res, 400, 'Event ID is required');

    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({ where: { id: Number(eventId) } });
      
      if (!event) throw new Error('Event not found');
      if (event.stock < 1) throw new Error('Tickets are sold out');

      await tx.event.update({
        where: { id: Number(eventId) },
        data: { stock: { decrement: 1 } }
      });

      const newTicket = await tx.ticket.create({
        data: {
          userId: userId,
          eventId: Number(eventId),
          status: 'CONFIRMED'
        },
        include: {
          event: { select: { title: true, date: true, location: true } }
        }
      });

      return newTicket;
    });

    sendResponse(res, 201, 'Ticket purchased successfully', result);

  } catch (error) {
    if (error.message === 'Tickets are sold out' || error.message === 'Event not found') {
      return sendResponse(res, 400, error.message);
    }
    next(error);
  }
};

const getMyTickets = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const tickets = await prisma.ticket.findMany({
      where: { userId: userId },
      include: {
        event: {
          select: { title: true, date: true, location: true, price: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    sendResponse(res, 200, 'My tickets retrieved successfully', tickets);
  } catch (error) {
    next(error);
  }
};

const cancelTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: { event: true }
    });

    if (!ticket) return sendResponse(res, 404, 'Ticket not found');

    if (ticket.userId !== userId && req.user.role !== 'ADMIN') {
      return sendResponse(res, 403, 'Forbidden: You are not the owner of this ticket');
    }

    await prisma.$transaction([
      prisma.ticket.delete({
        where: { id: Number(id) }
      }),
      prisma.event.update({
        where: { id: ticket.eventId },
        data: { stock: { increment: 1 } }
      })
    ]);

    sendResponse(res, 200, 'Ticket cancelled successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = { buyTicket, getMyTickets, cancelTicket };