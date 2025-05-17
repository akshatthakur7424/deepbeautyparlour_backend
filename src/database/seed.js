import { PrismaClient } from "@prisma/client"
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const users = [];
  for (let i = 0; i < 5; i++) {
    users.push(await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        phone: faker.phone.number(),
      },
    }));
  }

  // Seed Service Categories
  const categories = await Promise.all([
    prisma.serviceCategory.create({ data: { name: 'Hair' } }),
    prisma.serviceCategory.create({ data: { name: 'Skin' } }),
    prisma.serviceCategory.create({ data: { name: 'Nails' } }),
  ]);

  // Seed Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Hair Cut',
        description: 'Professional haircut with styling.',
        imageUrl: 'https://via.placeholder.com/300x200?text=Hair+Cut',
        price: 20,
        categoryId: categories[0].id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Facial',
        description: 'Rejuvenating facial treatment.',
        imageUrl: 'https://via.placeholder.com/300x200?text=Facial',
        price: 35,
        categoryId: categories[1].id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Manicure',
        description: 'Classic manicure with polish.',
        imageUrl: 'https://via.placeholder.com/300x200?text=Manicure',
        price: 25,
        categoryId: categories[2].id,
      },
    }),
  ]);

  // Seed Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Shampoo',
        description: 'Salon quality shampoo.',
        imageUrl: 'https://via.placeholder.com/300x200?text=Shampoo',
        price: 10,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Conditioner',
        description: 'Deep conditioning treatment.',
        imageUrl: 'https://via.placeholder.com/300x200?text=Conditioner',
        price: 12,
      },
    }),
  ]);

  // Seed Time Slots
  const timeSlots = [];
  const today = new Date();
  for (let i = 0; i < services.length; i++) {
    const slot = await prisma.timeSlot.create({
      data: {
        day: today,
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        serviceId: services[i].id,
      },
    });
    timeSlots.push(slot);
  }

  // Seed Bookings
  for (let i = 0; i < users.length && i < timeSlots.length; i++) {
    await prisma.booking.create({
      data: {
        userId: users[i].id,
        serviceId: timeSlots[i].serviceId,
        timeSlotId: timeSlots[i].id,
        status: 'confirmed',
      },
    });
    await prisma.timeSlot.update({
      where: { id: timeSlots[i].id },
      data: { isBooked: true },
    });
  }

  // Seed Subscriptions
  for (const user of users) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        planName: 'Monthly Glow',
        price: 49.99,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    });
  }

  // Seed Favorites
  await prisma.favoriteService.create({
    data: {
      userId: users[0].id,
      serviceId: services[0].id,
    },
  });

  await prisma.favoriteProduct.create({
    data: {
      userId: users[0].id,
      productId: products[0].id,
    },
  });

  // Seed Orders and OrderItems
  const order = await prisma.order.create({
    data: {
      userId: users[0].id,
      totalAmount: products[0].price * 2,
      status: 'paid',
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            price: products[0].price,
          },
        ],
      },
    },
  });

  console.log('🌱 Seed data has been created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
