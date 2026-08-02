import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Eye, EyeOff, Car, Plug, CreditCard } from 'lucide-react'
import AuthLayout from '../components/AuthLayout.jsx'
import { IconInput, IconSelect } from '../components/IconInput.jsx'

const VEHICLE_BRANDS = ['Tesla', 'Nissan', 'BYD', 'Toyota', 'Hyundai', 'Kia', 'BMW', 'MG']
const VEHICLE_MODELS = ['Model 3', 'Model Y', 'Leaf', 'Atto 3', 'Prius', 'Ioniq 5', 'EV6', 'i4', 'ZS EV']
const CONNECTOR_TYPES = ['Type 2', 'CCS', 'CHAdeMO', 'GB/T']

export default function CreateDriverAccount() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [agree, setAgree] = useState(true)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [vehicleBrand, setVehicleBrand] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [connectorType, setConnectorType] = useState('')
  const [vehicleRegNo, setVehicleRegNo] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword ||
        !vehicleBrand || !vehicleModel || !connectorType || !vehicleRegNo.trim()) {
      setError('Please fill in all fields to continue.')
      return
    }
    if (!/^[A-Za-z\s.'-]+$/.test(fullName.trim())) {
      setError('Full name should only contain letters.')
      return
    }
    if (!/^\d{7,10}$/.test(phone.trim())) {
      setError('Please enter a valid phone number.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.')
      return
    }
    if (!agree) {
      setError('Please agree to the Terms & Conditions and Privacy Policy to continue.')
      return
    }

    setError('')
    navigate('/otp-verification')
  }

  return (
    <AuthLayout
      onBack={() => navigate('/')}
      hero={
        <>
          <h1 className="font-display text-5xl font-bold text-evora-green mb-2">Evora</h1>
          <p className="text-evora-muted text-lg mb-1">Power Your Journey</p>
          <p className="text-evora-muted/70 text-sm">Join Evora and be part of the green revolution.</p>
        </>
      }
      maxWidth="max-w-[560px]"
    >
      <form onSubmit={handleSubmit} className="card p-8">
        <div className="mb-6 lg:hidden">
          <h2 className="font-display text-xl font-bold text-evora-text">Create Account</h2>
          <p className="text-evora-muted text-xs">Driver Account Registration</p>
        </div>

        <SectionLabel icon={<User size={14} />} text="Personal Information" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <IconInput
            icon={<User size={17} />}
            placeholder="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value.replace(/[^A-Za-z\s.'-]/g, ''))}
          />
          <IconInput
            icon={<Mail size={17} />}
            placeholder="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="sm:col-span-2 flex items-center gap-2 bg-evora-card border border-evora-border rounded-xl px-4 py-3.5 focus-within:border-evora-green/70">
            <Phone size={17} className="text-evora-green" />
            <span className="text-evora-muted text-sm">+94</span>
            <div className="w-px h-4 bg-evora-border" />
            <input
              type="tel"
              required
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              className="bg-transparent outline-none flex-1 text-sm placeholder:text-evora-muted/50"
            />
          </div>
        </div>

        <SectionLabel icon={<Lock size={14} />} text="Security" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1">
          <PasswordField show={showPw} setShow={setShowPw} placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <PasswordField show={showConfirmPw} setShow={setShowConfirmPw} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <PasswordStrength password={password} className="mb-6" />

        <SectionLabel icon={<Car size={14} />} text="Vehicle Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <IconSelect icon={<Car size={17} />} placeholder="Vehicle Brand" options={VEHICLE_BRANDS} value={vehicleBrand} onChange={setVehicleBrand} />
          <IconSelect icon={<Car size={17} />} placeholder="Vehicle Model" options={VEHICLE_MODELS} value={vehicleModel} onChange={setVehicleModel} />
          <IconSelect icon={<Plug size={17} />} placeholder="Connector Type (e.g. Type 2, CCS)" options={CONNECTOR_TYPES} value={connectorType} onChange={setConnectorType} />
          <IconInput icon={<CreditCard size={17} />} placeholder="Vehicle Registration Number" required value={vehicleRegNo} onChange={(e) => setVehicleRegNo(e.target.value)} />
        </div>

        {error && <p className="text-red-500 text-xs mb-4 -mt-2">{error}</p>}

        <label className="flex items-start gap-2 mb-6 text-sm text-evora-muted cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="accent-evora-green w-4 h-4 rounded mt-0.5"
          />
          <span>
            I agree to the <span className="text-evora-green">Terms &amp; Conditions</span> and{' '}
            <span className="text-evora-green">Privacy Policy</span>
          </span>
        </label>

        <button type="submit" className="btn-primary">
          Create My Account
        </button>

        <p className="text-center text-evora-muted text-sm mt-5">
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/login')} className="text-evora-green font-medium hover:underline">
            Login
          </button>
        </p>
      </form>
    </AuthLayout>
  )
}

function SectionLabel({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-evora-green text-xs font-semibold uppercase tracking-wide mb-3">
      {icon}
      {text}
    </div>
  )
}

function PasswordField({ show, setShow, placeholder, value, onChange }) {
  return (
    <IconInput
      icon={<Lock size={17} />}
      type={show ? 'text' : 'password'}
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rightElement={
        <button type="button" onClick={() => setShow((s) => !s)} className="text-evora-muted hover:text-evora-green">
          {show ? <Eye size={17} /> : <EyeOff size={17} />}
        </button>
      }
    />
  )
}

function PasswordStrength({ password = '', className = '' }) {
  const score = getPasswordScore(password)
  const colors = ['bg-evora-border', 'bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-evora-green']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-1 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? colors[score] : 'bg-evora-border'}`} />
        ))}
      </div>
      <span className="text-evora-muted text-xs shrink-0 w-12 text-right">{labels[score]}</span>
    </div>
  )
}

function getPasswordScore(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}
