const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  await prisma.ticket.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned.');

  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const usersData = [
    { name: 'Aether', email: 'aether@test.com' },
    { name: 'Oceanz', email: 'oceanz@test.com' },
    { name: 'Wise', email: 'wise@test.com' },
    { name: 'Rover', email: 'rover@test.com' },
  ];

  for (const user of usersData) {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: 'USER',
      },
    });
  }

  console.log('Users created (1 Admin + 4 Regular).');

  const categoriesData = [
    { name: 'Music Concert' },
    { name: 'Seminar' },
    { name: 'Sports' },
    { name: 'Art Exhibition' },
    { name: 'Food Festival' }
  ];

  const createdCategories = [];
  for (const cat of categoriesData) {
    const newCat = await prisma.category.create({ data: cat });
    createdCategories.push(newCat);
  }

  console.log('Categories created (5 items).');

  const events = [
    {
      title: 'Coldplay Live in Jakarta',
      description: 'A magical night with Coldplay.',
      date: new Date('2025-12-31T19:00:00Z'),
      location: 'GBK Stadium',
      price: 1500000,
      stock: 1000,
      categoryId: createdCategories[0].id,
    },
    {
      title: 'Tech Summit 2025',
      description: 'Future of AI and Web Development.',
      date: new Date('2025-11-15T09:00:00Z'),
      location: 'Convention Center',
      price: 500000,
      stock: 200,
      categoryId: createdCategories[1].id,
    },
    {
      title: 'Indonesia Open 2025',
      description: 'Badminton world tour final.',
      date: new Date('2025-10-20T10:00:00Z'),
      location: 'Istora Senayan',
      price: 300000,
      stock: 500,
      categoryId: createdCategories[2].id,
    },
    {
      title: 'Modern Art Gallery Opening',
      description: 'Exhibition of contemporary art.',
      date: new Date('2025-09-01T10:00:00Z'),
      location: 'National Gallery',
      price: 75000,
      stock: 100,
      categoryId: createdCategories[3].id,
    },
    {
      title: 'Jakarta Food Fest',
      description: 'All you can eat street food festival.',
      date: new Date('2025-08-17T08:00:00Z'),
      location: 'Parkir Timur Senayan',
      price: 50000,
      stock: 1000,
      categoryId: createdCategories[4].id,
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }

  console.log('Events created (5 items).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });