import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Pre-hash passwords
  const alicePassword = await bcrypt.hash('Akash@123', 10);

  await prisma.user.upsert({
    where: { mobile: '9797979797' },
    update: {},
    create: {
      mobile: '9797979797',
      hashedPassword: alicePassword,
      name: 'akash',
      email : "akash09@gmail.com",
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: 'Success',
          amount: 20000,
          token: '124',
          provider: 'HDFC Bank',
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
