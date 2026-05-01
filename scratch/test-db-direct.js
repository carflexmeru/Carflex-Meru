const { PrismaClient } = require('@prisma/client')

// Direct Connection (Port 5432)
const directUrl = "postgresql://postgres.ikrlxhqddvkttdffswps:%24Carflexmeru123%24@db.ikrlxhqddvkttdffswps.supabase.co:5432/postgres";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
})

async function main() {
  try {
    console.log('📡 Attempting DIRECT connection (Port 5432)...')
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    console.log('✅ DIRECT Connection Successful:', result)
  } catch (e) {
    console.error('❌ DIRECT Connection Failed!')
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
