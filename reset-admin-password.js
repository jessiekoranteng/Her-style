const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    const password = 'admin123'
    const hash = await bcrypt.hash(password, 12)
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@herstyle.com' },
      update: { 
        passwordHash: hash,
        role: 'ADMIN'
      },
      create: {
        email: 'admin@herstyle.com',
        name: 'HerStyle Admin',
        passwordHash: hash,
        role: 'ADMIN'
      }
    })
    console.log('Updated admin user:', admin)
    console.log('Password:', password)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()