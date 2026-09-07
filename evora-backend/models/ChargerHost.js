const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const chargerHostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name / business name'],
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
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles',
      default: () => new mongoose.Types.ObjectId('6a9974ee7fb2587dd5397d20'), // Standard Host role ID
    },
    brNo: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    versionKey: false,
    collection: 'chargerhost', // Exactly maps to chargerhost collection in MongoDB Atlas
  }
)

// Encrypt password before saving
chargerHostSchema.pre('save', async function () {
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
