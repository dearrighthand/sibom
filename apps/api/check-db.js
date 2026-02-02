"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ log: ['query'] });
async function main() {
    console.log('--- Database Connection Check ---');
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
                status: client_1.PhoneVerificationStatus.PENDING,
            },
        });
        console.log('Created record:', created);
    }
    catch (e) {
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
//# sourceMappingURL=check-db.js.map