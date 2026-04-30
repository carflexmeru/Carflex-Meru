const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('📡 Attempting to connect to Supabase...')
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    console.log('✅ Connection Successful:', result)
  } catch (e) {
    console.error('❌ Connection Failed!')
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
