const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // 1. Bersihkan database (urutan: anak -> induk)
  await prisma.ticket.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned.');

  // 2. Hash Password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 3. Buat Users
  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@test.com',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('Users created.');

  // 4. Buat Categories
  const concert = await prisma.category.create({ data: { name: 'Music Concert' } });
  const seminar = await prisma.category.create({ data: { name: 'Seminar' } });
  const sports = await prisma.category.create({ data: { name: 'Sports' } });

  console.log('Categories created.');

  // 5. Buat Events
  const events = [
    {
      title: 'Coldplay Live in Jakarta',
      description: 'A magical night with Coldplay.',
      date: new Date('2025-12-31T19:00:00Z'),
      location: 'GBK Stadium',
      price: 1500000,
      stock: 1000,
      categoryId: concert.id,
    },
    {
      title: 'Tech Summit 2025',
      description: 'Future of AI and Web Development.',
      date: new Date('2025-11-15T09:00:00Z'),
      location: 'Convention Center',
      price: 500000,
      stock: 200,
      categoryId: seminar.id,
    },
    {
      title: 'Indonesia Open 2025',
      description: 'Badminton world tour final.',
      date: new Date('2025-10-20T10:00:00Z'),
      location: 'Istora Senayan',
      price: 300000,
      stock: 500,
      categoryId: sports.id,
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }

  console.log('Events created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });