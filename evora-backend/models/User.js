const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['driver', 'host', 'admin'],
      default: 'driver',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    // Driver-specific attributes
    vehicleCategory: {
      type: String,
      default: '',
    },
    connectorType: {
      type: String,
      default: '',
    },
    vehicleModel: {
      type: String,
      default: '',
    },
    vehicleRegNumber: {
      type: String,
      default: '',
    },
    // Host-specific attributes
    stationName: {
      type: String,
      default: '',
    },
    stationAddress: {
      type: String,
      default: '',
    },
    chargerType: {
      type: String,
      default: '',
    },
    totalSlots: {
      type: Number,
      default: 1,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Encrypt password using bcrypt before saving (Mongoose async hook)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
