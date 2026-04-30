const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const Database = require("better-sqlite3");
const path = require("path");

async function testInstance() {
    console.log("\n--- Testing with Instance ---");
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const sqlite = new Database(dbPath);
    const adapter = new PrismaBetterSqlite3(sqlite);
    const prisma = new PrismaClient({ adapter });
    try {
        await prisma.$connect();
        console.log("Connected with instance");
        await prisma.$disconnect();
    } catch (e) {
        console.log("Connect failed with instance:", e.message);
    }
}

async function testString() {
    console.log("\n--- Testing with String ---");
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const adapter = new PrismaBetterSqlite3(dbPath);
    const prisma = new PrismaClient({ adapter });
    try {
        await prisma.$connect();
        console.log("Connected with string");
        await prisma.$disconnect();
    } catch (e) {
        console.log("Connect failed with string:", e.message);
    }
}

async function run() {
    await testInstance();
    await testString();
}

run().catch(console.error);
