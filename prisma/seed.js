const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Carflex 4D DNA Database...");

  // 1. Create System Event
  const event = await prisma.event.upsert({
    where: { date: new Date("2026-05-30") },
    update: {},
    create: {
      date: new Date("2026-05-30"),
      isActive: true,
    },
  });
  console.log("✅ Event created:", event.date);

  // 2. Create Zones linked to Event
  const zones = await Promise.all([
    prisma.zone.upsert({
      where: { name: "Zone A — Premium Row" },
      update: { eventId: event.id },
      create: { name: "Zone A — Premium Row", capacity: 50, price: 1500, eventId: event.id },
    }),
    prisma.zone.upsert({
      where: { name: "Zone B — Standard Row" },
      update: { eventId: event.id },
      create: { name: "Zone B — Standard Row", capacity: 80, price: 1000, eventId: event.id },
    }),
    prisma.zone.upsert({
      where: { name: "Zone C — Motorcycles" },
      update: { eventId: event.id },
      create: { name: "Zone C — Motorcycles", capacity: 100, price: 500, eventId: event.id },
    }),
  ]);
  console.log(`✅ ${zones.length} Zones created`);

  // 3. Create Profiles
  const admin = await prisma.profile.upsert({
    where: { phone: "+254700000000" },
    update: {},
    create: {
      phone: "+254700000000",
      fullName: "Super Admin",
      role: "admin",
    },
  });

  const staff = await prisma.profile.upsert({
    where: { phone: "+254700000001" },
    update: {},
    create: {
      phone: "+254700000001",
      fullName: "Agent Kamau",
      role: "staff",
      idNumber: "12345678",
    },
  });
  console.log("✅ Admin & Staff profiles created");

  // 4. Create Vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { regNumber: "KAB 123A" },
      update: {},
      create: {
        regNumber: "KAB 123A",
        make: "Toyota",
        model: "Land Cruiser V8",
        year: 2018,
        price: 9500000,
        status: "active",
        isVerified: true,
        isComplete: true,
        zoneId: zones[0].id,
        ownerId: admin.id,
      },
    }),
    prisma.vehicle.upsert({
      where: { regNumber: "KDG 456B" },
      update: {},
      create: {
        regNumber: "KDG 456B",
        make: "Subaru",
        model: "Forester XT",
        year: 2016,
        price: 2200000,
        status: "active",
        isVerified: true,
        isComplete: true,
        zoneId: zones[1].id,
        ownerId: admin.id,
      },
    }),
  ]);
  console.log(`✅ ${vehicles.length} Vehicles created`);

  // 5. System Settings
  await prisma.systemSetting.upsert({
    where: { key: "premium_zone_price" },
    update: {},
    create: { key: "premium_zone_price", value: "1500", description: "Entry fee for Premium Row" },
  });

  console.log("✅ System Settings seeded");
  console.log("\n🎉 4D DNA Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
