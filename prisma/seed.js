const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Carflex DNA Database...");

  const event = await prisma.event.upsert({
    where: { id: "meru-2026" },
    update: {},
    create: {
      id: "meru-2026",
      name: "Meru Bazaar 2026",
      location: "Meru Showground",
      isActive: true,
    },
  });

  const tenthEvent = await prisma.event.upsert({
    where: { id: "meru-10th-2026" },
    update: { name: "Meru Car Bazaar 10th Edition", location: "Meru Showground", isActive: true },
    create: {
      id: "meru-10th-2026",
      name: "Meru Car Bazaar 10th Edition",
      location: "Meru Showground",
      isActive: true,
    },
  });

  const zones = await Promise.all([
    prisma.zone.upsert({
      where: { name: "Zone A - Premium Row" },
      update: { eventId: event.id },
      create: { name: "Zone A - Premium Row", capacity: 50, price: 1500, eventId: event.id },
    }),
    prisma.zone.upsert({
      where: { name: "Zone B - Standard Row" },
      update: { eventId: event.id },
      create: { name: "Zone B - Standard Row", capacity: 80, price: 1000, eventId: event.id },
    }),
    prisma.zone.upsert({
      where: { name: "Zone C - Motorcycles" },
      update: { eventId: event.id },
      create: { name: "Zone C - Motorcycles", capacity: 100, price: 500, eventId: event.id },
    }),
  ]);

  await Promise.all([
    prisma.zone.upsert({
      where: { name: "10th - Premium Row" },
      update: { eventId: tenthEvent.id, capacity: 60, price: 500 },
      create: { name: "10th - Premium Row", capacity: 60, price: 500, eventId: tenthEvent.id },
    }),
    prisma.zone.upsert({
      where: { name: "10th - Standard Row" },
      update: { eventId: tenthEvent.id, capacity: 100, price: 500 },
      create: { name: "10th - Standard Row", capacity: 100, price: 500, eventId: tenthEvent.id },
    }),
    prisma.zone.upsert({
      where: { name: "10th - Motorcycles" },
      update: { eventId: tenthEvent.id, capacity: 120, price: 500 },
      create: { name: "10th - Motorcycles", capacity: 120, price: 500, eventId: tenthEvent.id },
    }),
  ]);

  const admin = await prisma.profile.upsert({
    where: { phone: "+254700000000" },
    update: {},
    create: {
      phone: "+254700000000",
      name: "Super Admin",
      role: "admin",
    },
  });

  await prisma.profile.upsert({
    where: { phone: "+254700000001" },
    update: {},
    create: {
      phone: "+254700000001",
      name: "Agent Kamau",
      role: "staff",
      idNumber: "12345678",
    },
  });

  const staffAgents = await Promise.all([
    prisma.staffAgent.upsert({
      where: { type: "REGISTRATION_AGENT" },
      update: { password: "12345678", name: "Agent Kamau" },
      create: { type: "REGISTRATION_AGENT", password: "12345678", name: "Agent Kamau" },
    }),
    prisma.staffAgent.upsert({
      where: { type: "GATE_VERIFICATION_AGENT" },
      update: { password: "12345678", name: "Gate Agent Asha" },
      create: { type: "GATE_VERIFICATION_AGENT", password: "12345678", name: "Gate Agent Asha" },
    }),
    prisma.staffAgent.upsert({
      where: { type: "GROUND_VERIFICATION_AGENT" },
      update: { password: "12345678", name: "Ground Agent Njeri" },
      create: { type: "GROUND_VERIFICATION_AGENT", password: "12345678", name: "Ground Agent Njeri" },
    }),
    prisma.staffAgent.upsert({
      where: { type: "EXIT_COMMAND_AGENT" },
      update: { password: "12345678", name: "Exit Agent Otieno" },
      create: { type: "EXIT_COMMAND_AGENT", password: "12345678", name: "Exit Agent Otieno" },
    }),
  ]);

  await Promise.all([
    prisma.vehicle.create({
      data: {
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
    prisma.vehicle.create({
      data: {
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

  await Promise.all([
    prisma.vehicle.upsert({
      where: { chassisNumber: "10TH-CHASSIS-001" },
      update: {
        atEvent: true,
        eventName: tenthEvent.id,
        zoneId: null,
        status: "active",
        isVerified: true,
        isComplete: true,
      },
      create: {
        regNumber: "KCH 500A",
        make: "Toyota",
        model: "Land Cruiser Prado",
        year: 2020,
        price: 8500000,
        status: "active",
        isVerified: true,
        isComplete: true,
        atEvent: true,
        eventName: tenthEvent.id,
        chassisNumber: "10TH-CHASSIS-001",
        ownerId: admin.id,
        zoneId: null,
      },
    }),
    prisma.vehicle.upsert({
      where: { chassisNumber: "10TH-CHASSIS-002" },
      update: {
        atEvent: true,
        eventName: tenthEvent.id,
        zoneId: null,
        status: "active",
        isVerified: true,
        isComplete: true,
      },
      create: {
        regNumber: "KCH 500B",
        make: "Subaru",
        model: "Forester",
        year: 2019,
        price: 4200000,
        status: "active",
        isVerified: true,
        isComplete: true,
        atEvent: true,
        eventName: tenthEvent.id,
        chassisNumber: "10TH-CHASSIS-002",
        ownerId: admin.id,
        zoneId: null,
      },
    }),
    prisma.vehicle.upsert({
      where: { chassisNumber: "10TH-CHASSIS-003" },
      update: {
        atEvent: true,
        eventName: tenthEvent.id,
        zoneId: null,
        status: "active",
        isVerified: true,
        isComplete: true,
      },
      create: {
        regNumber: "KCH 500C",
        make: "Mercedes-Benz",
        model: "GLE 350",
        year: 2021,
        price: 12500000,
        status: "active",
        isVerified: true,
        isComplete: true,
        atEvent: true,
        eventName: tenthEvent.id,
        chassisNumber: "10TH-CHASSIS-003",
        ownerId: admin.id,
        zoneId: null,
      },
    }),
  ]);

  await prisma.systemSetting.upsert({
    where: { key: "premium_zone_price" },
    update: {},
    create: { key: "premium_zone_price", value: "1500", description: "Entry fee for Premium Row" },
  });

  console.log(`Seed complete. Staff agents: ${staffAgents.length}`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
