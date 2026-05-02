const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const normalizedPhone = '+254748866823';
  const shadowPhone = '0748866823';
  const phone = '0748866823';
  const vendor = { id: 'e1724c0f-ab21-46cb-bc22-2ab87fbba386', email: 'kbrian1445@gmail.com', idNumber: '42297502', username: 'krian' };

  const searchMatrix = [
      { id: vendor.id }, 
      { phone: normalizedPhone }, 
      { phone: shadowPhone }, 
      { phone: phone }, 
      { username: phone }, 
      { idNumber: phone } 
    ];
    if (vendor.email) searchMatrix.push({ email: vendor.email });
    if (vendor.idNumber) searchMatrix.push({ idNumber: vendor.idNumber });
    if (vendor.username) searchMatrix.push({ username: vendor.username });

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        owner: {
          OR: searchMatrix
        }
      }
    });
    console.log("Vehicles found:", vehicles.length);
  } catch (e) {
    console.error("Prisma Error:", e);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
