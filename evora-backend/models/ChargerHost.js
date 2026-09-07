const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const chargerHostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    fullName: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    brNo: {
      type: String,
      trim: true,
      default: '',
    },
    nicPassport: {
      type: String,
      trim: true,
      default: '',
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
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles',
      default: () => new mongoose.Types.ObjectId('6a9974ee7fb2587dd5397d20'), // Standard Host role ID from MongoDB
    },
    roleName: {
      type: String,
      default: 'host',
    },
    stationName: {
      type: String,
      trim: true,
      default: '',
    },
    stationAddress: {
      type: String,
      trim: true,
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
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'chargerhost', // Explicitly points to chargerhost collection in MongoDB Atlas
  }
)

// Sync name, fullName, company and encrypt password before saving
chargerHostSchema.pre('save', async function () {
  if (!this.name && this.fullName) {
    this.name = this.fullName
  }
  if (!this.fullName && this.name) {
    this.fullName = this.name
  }
  if (!this.company && (this.fullName || this.name)) {
    this.company = this.fullName || this.name
  }
  if (!this.brNo && this.nicPassport) {
    this.brNo = this.nicPassport
  }

  if (!this.isModified('password')) {
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match entered password to hashed password in database
chargerHostSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const ChargerHost = mongoose.model('ChargerHost', chargerHostSchema, 'chargerhost')

module.exports = ChargerHost
