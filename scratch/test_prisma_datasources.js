const { PrismaClient } = require("@prisma/client");
const path = require("path");

async function testDatasources() {
    console.log("\n--- Testing Datasources Option ---");
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const dbUrl = `file:${dbPath}`;
    
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: dbUrl
            }
        }
    });
    try {
        await prisma.$connect();
        console.log("Connected with datasources option");
        await prisma.$disconnect();
    } catch (e) {
        console.log("Connect failed with datasources:", e.message);
    }
}

testDatasources().catch(console.error);
