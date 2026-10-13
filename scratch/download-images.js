const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
  // Hero & Promo
  {
    path: 'public/images/hero-1.jpg',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
  },
  {
    path: 'public/images/hero-2.jpg',
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80',
  },
  {
    path: 'public/images/hero-3.jpg',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=80',
  },
  {
    path: 'public/images/promo-banner.jpg',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  },

  // Categories
  {
    path: 'public/images/categories/clothing.jpg',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/categories/laces.jpg',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/categories/cloths.jpg',
    url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/categories/accessories.jpg',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/categories/shoes.jpg',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/categories/bags.jpg',
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
  },

  // Product 1: Elegant Maxi Dress
  {
    path: 'public/images/products/dress-1.jpg',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/dress-2.jpg',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/dress-3.jpg',
    url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
  },

  // Product 2: Premium Lace Fabric
  {
    path: 'public/images/products/lace-1.jpg',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/lace-2.jpg',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
  },

  // Product 3: Plain Silk Cloth
  {
    path: 'public/images/products/silk-1.jpg',
    url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/silk-2.jpg',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },

  // Product 4: Luxury Pearl Brooch
  {
    path: 'public/images/products/brooch-1.jpg',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/brooch-2.jpg',
    url: 'https://images.unsplash.com/photo-1611591475155-4284fa9c2e7f?auto=format&fit=crop&w=800&q=80',
  },

  // Product 5: Gold Plated Chain Necklace
  {
    path: 'public/images/products/chain-1.jpg',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/chain-2.jpg',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
  },

  // Product 6: Strappy Block Heels
  {
    path: 'public/images/products/heels-1.jpg',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/heels-2.jpg',
    url: 'https://images.unsplash.com/photo-1581101767113-1677fc2beaa8?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/heels-3.jpg',
    url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
  },

  // Product 7: Designer Structured Handbag
  {
    path: 'public/images/products/bag-1.jpg',
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/bag-2.jpg',
    url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/bag-3.jpg',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },

  // Product 8: Floral Midi Dress
  {
    path: 'public/images/products/floral-dress-1.jpg',
    url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
  },
  {
    path: 'public/images/products/floral-dress-2.jpg',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`Status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Downloading ${images.length} high-resolution fashion assets...`);
  for (const item of images) {
    const fullPath = path.resolve(item.path);
    try {
      await downloadFile(item.url, fullPath);
      const stats = fs.statSync(fullPath);
      console.log(`✓ Downloaded ${item.path} (${Math.round(stats.size / 1024)} KB)`);
    } catch (err) {
      console.error(`✗ Failed ${item.path}:`, err.message);
    }
  }
  console.log("All downloads completed!");
}

run();
