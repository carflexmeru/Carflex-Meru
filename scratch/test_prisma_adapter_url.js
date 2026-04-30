const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const Database = require("better-sqlite3");
const path = require("path");

async function testAdapterWithUrl() {
    console.log("\n--- Testing Adapter with URL option ---");
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const sqlite = new Database(dbPath);
    const adapter = new PrismaBetterSqlite3(sqlite, { url: `file:${dbPath}` });
    const prisma = new PrismaClient({ adapter });
    try {
        await prisma.$connect();
        console.log("Connected with adapter and URL option");
        await prisma.$disconnect();
    } catch (e) {
        console.log("Connect failed with adapter and URL option:", e.message);
    }
}

testAdapterWithUrl().catch(console.error);
