const prisma = require('../config/database');

const buyTicket = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID is required' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Cek Event & Stok (Gunakan tx bukan prisma)
      const event = await tx.event.findUnique({
        where: { id: Number(eventId) }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.stock < 1) {
        throw new Error('Tickets are sold out');
      }

      // 2. Kurangi Stok Event
      await tx.event.update({
        where: { id: Number(eventId) },
        data: { stock: { decrement: 1 } }
      });

      // 3. Buat Tiket Baru
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

    res.status(201).json({
      success: true,
      message: 'Ticket purchased successfully',
      data: result,
    });

  } catch (error) {
    if (error.message === 'Tickets are sold out' || error.message === 'Event not found') {
      return res.status(400).json({ success: false, message: error.message });
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
          select: {
            title: true,
            date: true,
            location: true,
            price: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      message: 'My tickets retrieved successfully',
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { buyTicket, getMyTickets };