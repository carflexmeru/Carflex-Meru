const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const rawListings = await prisma.rawListing.findMany({ take: 1 });
    console.log("Raw Listings:", rawListings);
  } catch (e) {
    console.error("DB Error:", e);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
