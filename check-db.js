const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    const users = await prisma.user.findMany()
    console.log('Users:', JSON.stringify(users, null, 2))
    
    const products = await prisma.product.findMany()
    console.log('Products count:', products.length)
    
    const categories = await prisma.category.findMany()
    console.log('Categories:', JSON.stringify(categories, null, 2))
    
    const orders = await prisma.order.findMany()
    console.log('Orders:', JSON.stringify(orders, null, 2))
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()