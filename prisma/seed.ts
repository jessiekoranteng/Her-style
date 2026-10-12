import { PrismaClient, Role, OrderStatus, PaymentStatus, AddressType } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: {
        name: "Clothing",
        slug: "clothing",
        description: "Elegant dresses, tops, and fashion wear",
        image: "/images/categories/clothing.jpg",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "laces" },
      update: {},
      create: {
        name: "Laces",
        slug: "laces",
        description: "Beautiful lace fabrics for your designs",
        image: "/images/categories/laces.jpg",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "cloths" },
      update: {},
      create: {
        name: "Cloths",
        slug: "cloths",
        description: "Premium fabrics and textiles",
        image: "/images/categories/cloths.jpg",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        description: "Brooches, chains, and jewelry",
        image: "/images/categories/accessories.jpg",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "shoes" },
      update: {},
      create: {
        name: "Shoes",
        slug: "shoes",
        description: "Stylish heels, flats, and footwear",
        image: "/images/categories/shoes.jpg",
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bags" },
      update: {},
      create: {
        name: "Bags",
        slug: "bags",
        description: "Designer handbags and purses",
        image: "/images/categories/bags.jpg",
        sortOrder: 6,
      },
    }),
  ])

  const categoryMap = Object.fromEntries(categories.map(c => [c.slug, c.id]))
  console.log("✅ Categories created")

  // Create products with variants
  const productsData = [
    {
      name: "Elegant Maxi Dress",
      slug: "elegant-maxi-dress",
      description: "A stunning floor-length maxi dress crafted from premium flowing fabric. Perfect for special occasions, evening events, or a sophisticated daytime look. Features a flattering silhouette with delicate detailing.",
      shortDescription: "Floor-length flowing maxi dress for elegant occasions",
      price: 450,
      compareAtPrice: 550,
      images: ["/images/products/dress-1.jpg", "/images/products/dress-2.jpg", "/images/products/dress-3.jpg"],
      categoryId: categoryMap.clothing,
      tags: ["dress", "maxi", "elegant", "occasion", "evening"],
      sku: "EMD",
      weight: 0.3,
      dimensions: { length: 40, width: 30, height: 2 },
      isFeatured: true,
      variants: [
        { name: "Black / S", sku: "EMD-BLK-S", price: 450, inventory: 12, options: { color: "Black", size: "S" } },
        { name: "Black / M", sku: "EMD-BLK-M", price: 450, inventory: 18, options: { color: "Black", size: "M" } },
        { name: "Black / L", sku: "EMD-BLK-L", price: 450, inventory: 10, options: { color: "Black", size: "L" } },
        { name: "Navy / S", sku: "EMD-NVY-S", price: 450, inventory: 8, options: { color: "Navy", size: "S" } },
        { name: "Navy / M", sku: "EMD-NVY-M", price: 450, inventory: 15, options: { color: "Navy", size: "M" } },
        { name: "Emerald / M", sku: "EMD-EMD-M", price: 480, inventory: 6, options: { color: "Emerald", size: "M" } },
      ],
    },
    {
      name: "Premium Lace Fabric",
      slug: "premium-lace-fabric",
      description: "Exquisite premium lace fabric with intricate floral patterns. Perfect for creating custom gowns, blouses, or adding elegant details to any garment. High-quality material that drapes beautifully.",
      shortDescription: "Intricate floral lace fabric for custom designs",
      price: 120,
      compareAtPrice: 150,
      images: ["/images/products/lace-1.jpg", "/images/products/lace-2.jpg"],
      categoryId: categoryMap.laces,
      tags: ["lace", "fabric", "floral", "premium", "custom"],
      sku: "PLF",
      weight: 0.1,
      dimensions: { length: 100, width: 50, height: 0.5 },
      isFeatured: true,
      variants: [
        { name: "White / 1 Yard", sku: "PLF-WHT-1YD", price: 120, inventory: 45, options: { color: "White", quantity: "1 Yard" } },
        { name: "White / 2 Yards", sku: "PLF-WHT-2YD", price: 220, inventory: 30, options: { color: "White", quantity: "2 Yards" } },
        { name: "Ivory / 1 Yard", sku: "PLF-IVR-1YD", price: 120, inventory: 25, options: { color: "Ivory", quantity: "1 Yard" } },
        { name: "Champagne / 1 Yard", sku: "PLF-CHP-1YD", price: 130, inventory: 20, options: { color: "Champagne", quantity: "1 Yard" } },
      ],
    },
    {
      name: "Plain Silk Cloth",
      slug: "plain-silk-cloth",
      description: "Luxurious 100% pure silk fabric with a smooth, lustrous finish. Ideal for creating elegant blouses, scarves, linings, or luxurious sleepwear. Available in a range of sophisticated colors.",
      shortDescription: "100% pure silk fabric in elegant colors",
      price: 80,
      compareAtPrice: 100,
      images: ["/images/products/silk-1.jpg", "/images/products/silk-2.jpg"],
      categoryId: categoryMap.cloths,
      tags: ["silk", "fabric", "pure", "luxury", "cloth"],
      sku: "PSC",
      weight: 0.08,
      dimensions: { length: 100, width: 45, height: 0.3 },
      isFeatured: true,
      variants: [
        { name: "Blush Pink / 1 Yard", sku: "PSC-BLP-1YD", price: 80, inventory: 35, options: { color: "Blush Pink", quantity: "1 Yard" } },
        { name: "Champagne / 1 Yard", sku: "PSC-CHP-1YD", price: 80, inventory: 40, options: { color: "Champagne", quantity: "1 Yard" } },
        { name: "Sage Green / 1 Yard", sku: "PSC-SGN-1YD", price: 85, inventory: 22, options: { color: "Sage Green", quantity: "1 Yard" } },
        { name: "Pearl White / 1 Yard", sku: "PSC-PRL-1YD", price: 80, inventory: 30, options: { color: "Pearl White", quantity: "1 Yard" } },
      ],
    },
    {
      name: "Luxury Pearl Brooch",
      slug: "luxury-pearl-brooch",
      description: "Exquisite handcrafted brooch featuring lustrous freshwater pearls set in gold-tone metal. A timeless accessory that adds sophistication to any outfit - perfect for lapels, scarves, or as a hair accessory.",
      shortDescription: "Handcrafted freshwater pearl brooch in gold-tone",
      price: 60,
      compareAtPrice: 80,
      images: ["/images/products/brooch-1.jpg", "/images/products/brooch-2.jpg"],
      categoryId: categoryMap.accessories,
      tags: ["brooch", "pearl", "luxury", "handcrafted", "accessory"],
      sku: "LPB",
      weight: 0.02,
      dimensions: { length: 5, width: 5, height: 1.5 },
      isFeatured: false,
      variants: [
        { name: "Classic White Pearl", sku: "LPB-WHT", price: 60, inventory: 25, options: { style: "Classic White Pearl" } },
        { name: "Pink Pearl Cluster", sku: "LPB-PNK", price: 70, inventory: 15, options: { style: "Pink Pearl Cluster" } },
        { name: "Black Pearl Statement", sku: "LPB-BLK", price: 85, inventory: 8, options: { style: "Black Pearl Statement" } },
      ],
    },
    {
      name: "Gold Plated Chain Necklace",
      slug: "gold-plated-chain-necklace",
      description: "Elegant 18k gold-plated chain necklace with a delicate link design. Versatile length perfect for layering or wearing alone. Features a secure lobster clasp and anti-tarnish coating for lasting shine.",
      shortDescription: "18k gold-plated delicate chain necklace",
      price: 150,
      compareAtPrice: 190,
      images: ["/images/products/chain-1.jpg", "/images/products/chain-2.jpg"],
      categoryId: categoryMap.accessories,
      tags: ["necklace", "chain", "gold-plated", "18k", "jewelry"],
      sku: "GPC",
      weight: 0.015,
      dimensions: { length: 2, width: 2, height: 0.5 },
      isFeatured: true,
      variants: [
        { name: "16 inch", sku: "GPC-16", price: 150, inventory: 30, options: { length: "16 inch" } },
        { name: "18 inch", sku: "GPC-18", price: 160, inventory: 25, options: { length: "18 inch" } },
        { name: "20 inch", sku: "GPC-20", price: 170, inventory: 20, options: { length: "20 inch" } },
        { name: "24 inch", sku: "GPC-24", price: 185, inventory: 12, options: { length: "24 inch" } },
      ],
    },
    {
      name: "Strappy Block Heels",
      slug: "strappy-block-heels",
      description: "Chic strappy block heel sandals crafted from premium faux leather. Features a comfortable 3-inch block heel, padded insole, and adjustable ankle strap. Perfect for all-day wear from office to evening.",
      shortDescription: "Comfortable 3-inch block heel strappy sandals",
      price: 320,
      compareAtPrice: 380,
      images: ["/images/products/heels-1.jpg", "/images/products/heels-2.jpg", "/images/products/heels-3.jpg"],
      categoryId: categoryMap.shoes,
      tags: ["heels", "sandals", "strappy", "block-heel", "comfortable"],
      sku: "SBH",
      weight: 0.6,
      dimensions: { length: 28, width: 10, height: 12 },
      isFeatured: true,
      variants: [
        { name: "Beige / 38", sku: "SBH-BGE-38", price: 320, inventory: 12, options: { color: "Beige", size: "38" } },
        { name: "Beige / 39", sku: "SBH-BGE-39", price: 320, inventory: 15, options: { color: "Beige", size: "39" } },
        { name: "Beige / 40", sku: "SBH-BGE-40", price: 320, inventory: 10, options: { color: "Beige", size: "40" } },
        { name: "Black / 38", sku: "SBH-BLK-38", price: 320, inventory: 18, options: { color: "Black", size: "38" } },
        { name: "Black / 39", sku: "SBH-BLK-39", price: 320, inventory: 20, options: { color: "Black", size: "39" } },
        { name: "Black / 40", sku: "SBH-BLK-40", price: 320, inventory: 14, options: { color: "Black", size: "40" } },
      ],
    },
    {
      name: "Designer Structured Handbag",
      slug: "designer-structured-handbag",
      description: "Sophisticated structured handbag crafted from premium vegan leather with gold-tone hardware. Features multiple interior compartments, a detachable crossbody strap, and protective feet. The perfect everyday luxury bag.",
      shortDescription: "Structured vegan leather handbag with crossbody strap",
      price: 480,
      compareAtPrice: 580,
      images: ["/images/products/bag-1.jpg", "/images/products/bag-2.jpg", "/images/products/bag-3.jpg"],
      categoryId: categoryMap.bags,
      tags: ["handbag", "structured", "vegan-leather", "crossbody", "designer"],
      sku: "DSH",
      weight: 0.9,
      dimensions: { length: 32, width: 14, height: 24 },
      isFeatured: true,
      variants: [
        { name: "Black", sku: "DSH-BLK", price: 480, inventory: 15, options: { color: "Black" } },
        { name: "Tan", sku: "DSH-TAN", price: 480, inventory: 12, options: { color: "Tan" } },
        { name: "Navy", sku: "DSH-NVY", price: 480, inventory: 8, options: { color: "Navy" } },
        { name: "Burgundy", sku: "DSH-BRG", price: 520, inventory: 5, options: { color: "Burgundy" } },
      ],
    },
    {
      name: "Floral Midi Dress",
      slug: "floral-midi-dress",
      description: "Romantic floral print midi dress with a flattering wrap silhouette. Made from lightweight, breathable fabric perfect for spring and summer. Features a V-neckline, short sleeves, and a flowy skirt.",
      shortDescription: "Romantic floral wrap midi dress",
      price: 380,
      compareAtPrice: 450,
      images: ["/images/products/floral-dress-1.jpg", "/images/products/floral-dress-2.jpg"],
      categoryId: categoryMap.clothing,
      tags: ["dress", "midi", "floral", "wrap", "spring"],
      sku: "FMD",
      weight: 0.25,
      dimensions: { length: 38, width: 28, height: 2 },
      isFeatured: false,
      variants: [
        { name: "Multi / XS", sku: "FMD-MLT-XS", price: 380, inventory: 10, options: { color: "Multi", size: "XS" } },
        { name: "Multi / S", sku: "FMD-MLT-S", price: 380, inventory: 18, options: { color: "Multi", size: "S" } },
        { name: "Multi / M", sku: "FMD-MLT-M", price: 380, inventory: 20, options: { color: "Multi", size: "M" } },
        { name: "Multi / L", sku: "FMD-MLT-L", price: 380, inventory: 12, options: { color: "Multi", size: "L" } },
      ],
    },
  ]

  for (const productData of productsData) {
    const { variants, ...product } = productData
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        weight: product.weight,
        dimensions: product.dimensions,
        variants: {
          create: variants.map(v => ({
            ...v,
            price: v.price,
            options: v.options,
          })),
        },
      },
    })
  }

  console.log("✅ Products created")

  // Create demo user
  const passwordHash = await bcrypt.hash("password123", 12)
  await prisma.user.upsert({
    where: { email: "demo@herstyle.com" },
    update: {},
    create: {
      email: "demo@herstyle.com",
      name: "Demo User",
      passwordHash,
      role: Role.CUSTOMER,
    },
  })

  console.log("✅ Demo user created (demo@herstyle.com / password123)")

  console.log("🎉 Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })