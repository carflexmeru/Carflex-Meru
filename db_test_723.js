const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const phone = '+254723456789';
  const shadowPhone = '0723456789';
  const vendor = await prisma.profile.findFirst({
    where: { OR: [{ phone }, { phone: shadowPhone }, { username: phone }] }
  });
  console.log("Vendor found:", vendor);
  
  const vehicles = await prisma.vehicle.findMany({
    where: {
      owner: { OR: [{ phone }, { phone: shadowPhone }] }
    }
  });
  console.log("Vehicles for " + phone + ":", vehicles.length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
