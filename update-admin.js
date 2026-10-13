const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // Update demo user to ADMIN role
    const updated = await prisma.user.update({
      where: { email: 'demo@herstyle.com' },
      data: { role: 'ADMIN' }
    })
    console.log('Updated user:', updated)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()