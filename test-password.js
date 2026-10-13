const bcrypt = require('bcryptjs')

async function test() {
  const password = 'password123'
  const hash = '$2b$12$iNZPcosQkZLW.NfgYU75F.q8xnmnAQiWV1PDp6LrbnsmPBjmcg2lC'
  
  const valid = await bcrypt.compare(password, hash)
  console.log('Password valid:', valid)
}

test()