const jwt = require('jsonwebtoken')

const generateToken = (id, role = 'admin') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'evora_admin_secret_key_2026', {
    expiresIn: '30d',
  })
}

module.exports = generateToken
