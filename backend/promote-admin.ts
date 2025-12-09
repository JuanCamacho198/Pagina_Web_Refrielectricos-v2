import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';

// Using DATABASE_URL from .env file
const prisma = new PrismaClient();

async function main() {
  console.log(`Checking all users in database...`);

  const users = await prisma.user.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    select: { email: true, role: true, id: true, createdAt: true },
  });
  console.log('Found users (last 20 created):');
  users.forEach((u) => console.log(`  - ${u.email} (${u.role})`));

  // Search for specific users
  const specificEmails = [
    'qatest_admin@test.com',
    'jdavidcamacho503@gmail.com',
    'jcamachomolina504@gmail.com',
  ];

  for (const email of specificEmails) {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(
      `\nUser ${email}: ${user ? `EXISTS (${user.role})` : 'NOT FOUND'}`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
