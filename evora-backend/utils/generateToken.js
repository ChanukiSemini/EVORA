const jwt = require('jsonwebtoken')

const generateToken = (id, role = 'driver', expiresIn = '30d') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'evora_jwt_super_secret_key_2026',
    {
      expiresIn,
    }
  )
}

module.exports = generateToken
