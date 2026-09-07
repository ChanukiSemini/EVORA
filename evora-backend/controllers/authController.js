const User = require('../models/User')
const generateToken = require('../utils/generateToken')

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // 2. Check for user
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // 3. Match password
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // 4. Token expiration duration based on rememberMe
    const expiresIn = rememberMe ? '30d' : '7d'
    const token = generateToken(user._id, user.role, expiresIn)

    // 5. Send response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vehicleCategory: user.vehicleCategory,
        connectorType: user.connectorType,
        vehicleModel: user.vehicleModel,
        vehicleRegNumber: user.vehicleRegNumber,
        stationName: user.stationName,
        stationAddress: user.stationAddress,
        chargerType: user.chargerType,
        totalSlots: user.totalSlots,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
      error: error.message,
    })
  }
}

// @desc    Register a new user (Driver / Host)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role = 'driver',
      phone,
      vehicleCategory,
      connectorType,
      vehicleModel,
      vehicleRegNumber,
      stationName,
      stationAddress,
      chargerType,
      totalSlots,
    } = req.body

    // 1. Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // 2. Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail })

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      })
    }

    // 3. Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      role: role.toLowerCase(),
      phone: phone || '',
      vehicleCategory: vehicleCategory || '',
      connectorType: connectorType || '',
      vehicleModel: vehicleModel || '',
      vehicleRegNumber: vehicleRegNumber || '',
      stationName: stationName || '',
      stationAddress: stationAddress || '',
      chargerType: chargerType || '',
      totalSlots: totalSlots || 1,
    })

    if (user) {
      const token = generateToken(user._id, user.role, '30d')

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          vehicleCategory: user.vehicleCategory,
          connectorType: user.connectorType,
          vehicleModel: user.vehicleModel,
          vehicleRegNumber: user.vehicleRegNumber,
          stationName: user.stationName,
          stationAddress: user.stationAddress,
          chargerType: user.chargerType,
          totalSlots: user.totalSlots,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data received',
      })
    }
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.',
      error: error.message,
    })
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')

    if (user) {
      res.json({
        success: true,
        user,
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
      error: error.message,
    })
  }
}

module.exports = {
  loginUser,
  registerUser,
  getUserProfile,
}
