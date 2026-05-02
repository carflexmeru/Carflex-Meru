const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profile.findFirst({ where: { id: 'e1724c0f-ab21-46cb-bc22-2ab87fbba386' } });
  console.log("Profile owning vehicles:", profile);
}
main().catch(console.error).finally(() => prisma.$disconnect());
