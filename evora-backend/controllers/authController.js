const mongoose = require('mongoose')
const User = require('../models/User')
const ChargerHost = require('../models/ChargerHost')
const generateToken = require('../utils/generateToken')

// @desc    Auth user & get token (Login for Driver and Host)
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

    // 2. Check for user in ev_driver collection first
    let user = await User.findOne({ email: normalizedEmail })
    let userType = 'driver'

    // 3. If not found in ev_driver, check in chargerhost collection
    if (!user) {
      user = await ChargerHost.findOne({ email: normalizedEmail })
      userType = 'host'
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // 4. Match password
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // 5. Token expiration duration based on rememberMe
    const roleString = user.roleName || (typeof user.role === 'string' ? user.role : userType)
    const expiresIn = rememberMe ? '30d' : '7d'
    const token = generateToken(user._id, roleString, expiresIn)

    // 6. Send response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name || user.fullName,
        fullName: user.fullName || user.name,
        email: user.email,
        role: roleString,
        phone: user.phone,
        company: user.company || '',
        brNo: user.brNo || user.nicPassport || '',
        vehicleCategory: user.vehicleCategory || '',
        connectorType: user.connectorType || '',
        vehicleModel: user.vehicleModel || '',
        vehicleRegNumber: user.vehicleRegNumber || '',
        stationName: user.stationName || '',
        stationAddress: user.stationAddress || '',
        chargerType: user.chargerType || '',
        totalSlots: user.totalSlots || 1,
        isVerified: user.isVerified !== undefined ? user.isVerified : true,
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
      name,
      email,
      password,
      role = 'driver',
      phone,
      brNo,
      nicPassport,
      nicBrNumber,
      company,
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
    const displayName = fullName || name
    if (!displayName || !email || !password) {
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
    const targetRole = (role || 'driver').toLowerCase()

    // 2. Check if user already exists in either collection
    const userInDriver = await User.findOne({ email: normalizedEmail })
    const userInHost = await ChargerHost.findOne({ email: normalizedEmail })

    if (userInDriver || userInHost) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      })
    }

    // 3. Create Host in chargerhost collection
    if (targetRole === 'host') {
      const regNumber = brNo || nicPassport || nicBrNumber || ''
      const hostCompany = company || displayName.trim()
      const hostStationName = stationName || `${displayName.trim()}'s Station`

      const newHost = await ChargerHost.create({
        name: hostStationName || displayName.trim(),
        fullName: displayName.trim(),
        company: hostCompany,
        brNo: regNumber,
        nicPassport: regNumber,
        email: normalizedEmail,
        password,
        phone: phone || '',
        role: new mongoose.Types.ObjectId('6a9974ee7fb2587dd5397d20'), // Host role ID from MongoDB screenshot
        roleName: 'host',
        stationName: hostStationName,
        stationAddress: stationAddress || '',
        chargerType: chargerType || '',
        totalSlots: totalSlots || 1,
        active: true,
        isVerified: true,
      })

      const token = generateToken(newHost._id, 'host', '30d')

      return res.status(201).json({
        success: true,
        message: 'Host account registered successfully in chargerhost',
        token,
        user: {
          _id: newHost._id,
          name: newHost.name,
          fullName: newHost.fullName,
          email: newHost.email,
          phone: newHost.phone,
          role: 'host',
          brNo: newHost.brNo,
          company: newHost.company,
          stationName: newHost.stationName,
          stationAddress: newHost.stationAddress,
          chargerType: newHost.chargerType,
          totalSlots: newHost.totalSlots,
          isVerified: newHost.isVerified,
          createdAt: newHost.createdAt,
        },
      })
    }

    // 4. Create Driver in ev_driver collection
    const user = await User.create({
      name: displayName.trim(),
      fullName: displayName.trim(),
      email: normalizedEmail,
      password,
      role: 'driver',
      phone: phone || '',
      vehicleCategory: vehicleCategory || '',
      connectorType: connectorType || '',
      vehicleModel: vehicleModel || '',
      vehicleRegNumber: vehicleRegNumber || '',
      stationName: stationName || '',
      stationAddress: stationAddress || '',
      chargerType: chargerType || '',
      totalSlots: totalSlots || 1,
      active: true,
    })

    if (user) {
      const token = generateToken(user._id, user.role, '30d')

      res.status(201).json({
        success: true,
        message: 'Driver account registered successfully in ev_driver',
        token,
        user: {
          _id: user._id,
          name: user.name || user.fullName,
          fullName: user.fullName || user.name,
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
    let user = await User.findById(req.user._id).select('-password')
    if (!user) {
      user = await ChargerHost.findById(req.user._id).select('-password')
    }

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
