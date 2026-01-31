import { PrismaClient, PhoneVerificationStatus } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query'] });

async function main() {
  console.log('--- Database Connection Check ---');
  // NOTE: process.env.DATABASE_URL might be loaded by dotenv externally or by Prisma internally if .env file exists.
  // But inside this script, unless we load dotenv, we might rely on Prisma retrieving it.

  const phone = '010TEST1234';
  const code = '123456';
  const expiresAt = new Date(Date.now() + 300000);

  console.log(`Attempting to create verification for ${phone}...`);
  try {
    const created = await prisma.phoneVerification.create({
      data: {
        phone,
        code,
        expiresAt,
        status: PhoneVerificationStatus.PENDING,
      },
    });
    console.log('Created record:', created);
  } catch (e) {
    console.error('Failed to create record:', e);
  }

  const verifications = await prisma.phoneVerification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  console.log('Recent Verifications in DB:', verifications);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
