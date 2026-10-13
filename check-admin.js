const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const admin = await prisma.user.findUnique({ where: { email: 'admin@herstyle.com' } })
    console.log('Admin user:', JSON.stringify(admin, null, 2))
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()