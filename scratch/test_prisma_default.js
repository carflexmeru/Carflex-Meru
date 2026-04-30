const { PrismaClient } = require("@prisma/client");
const path = require("path");

async function testDefault() {
    console.log("\n--- Testing Default PrismaClient ---");
    // Ensure DATABASE_URL is set in env if needed, but config should handle it
    process.env.DATABASE_URL = `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
    
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        console.log("Connected with default PrismaClient");
        await prisma.$disconnect();
    } catch (e) {
        console.log("Connect failed with default:", e.message);
    }
}

testDefault().catch(console.error);
