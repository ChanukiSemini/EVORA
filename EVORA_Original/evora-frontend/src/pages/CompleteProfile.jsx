import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Mail, Phone, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAccountType } from '../context/AccountTypeContext.jsx'

export default function CompleteProfile() {
  const navigate = useNavigate()
  const { accountType } = useAccountType()
  const [agree, setAgree] = useState(true)
  const [photo, setPhoto] = useState(null)
  const fileInputRef = useRef(null)

  const [fullName, setFullName] = useState('Alexander Thompson')
  const [email, setEmail] = useState('alex.thompson@gmail.com')
  const [phone, setPhone] = useState('77 123 4567')
  const [error, setError] = useState('')

  const handlePickPhoto = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result)
    reader.readAsDataURL(file)
  }

  const handleContinue = (e) => {
    e.preventDefault()

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your full name, email address and phone number.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!/^\d{7,10}$/.test(phone.replace(/\s+/g, ''))) {
      setError('Please enter a valid phone number.')
      return
    }
    if (!agree) {
      setError('Please agree to the Terms & Conditions and Privacy Policy to continue.')
      return
    }

    setError('')
    navigate(accountType === 'host' ? '/create-account/host' : '/create-account/driver')
  }

  return (
    <AuthLayout
      onBack={() => navigate('/login')}
      hero={
        <>
          <h1 className="font-display text-5xl font-bold text-evora-green mb-2">Evora</h1>
          <p className="text-evora-muted text-lg">Power Your Journey</p>
        </>
      }
      eyebrow="Evora"
      title="Complete Your Profile"
      subtitle="Tell us a bit more about you"
    >
      <form onSubmit={handleContinue} className="card p-8">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-evora-card border-2 border-evora-green/40 flex items-center justify-center text-evora-muted overflow-hidden">
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-display text-evora-green">
                  {fullName.trim() ? fullName.trim()[0].toUpperCase() : 'A'}
                </span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handlePickPhoto}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-evora-green flex items-center justify-center text-evora-bg hover:brightness-110"
            >
              <Camera size={15} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <ProfileField
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            icon={<GoogleG />}
          />
          <ProfileField
            label="Email Address"
            value={email}
            onChange={setEmail}
            type="email"
            icon={<Mail size={16} className="text-evora-muted" />}
          />
          <div>
            <div className="flex items-center gap-3 bg-evora-card border border-evora-border rounded-xl px-4 py-3.5 focus-within:border-evora-green/70">
              <Phone size={16} className="text-evora-muted shrink-0" />
              <span className="text-evora-muted text-xs shrink-0">+94</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s]/g, ''))}
                className="bg-transparent outline-none flex-1 text-sm text-evora-text/90 min-w-0"
              />
              <CheckCircle2 size={18} className="text-evora-green ml-auto shrink-0" />
            </div>
            <p className="text-evora-muted/70 text-xs mt-1.5">Needed to verify your account and send OTP</p>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

        <label className="flex items-start gap-2 mt-6 text-sm text-evora-muted cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="accent-evora-green w-4 h-4 rounded mt-0.5"
          />
          <span>
            I agree to the <span className="text-evora-green">Terms &amp; Conditions</span> and{' '}
            <span className="text-evora-green">Privacy Policy</span> of Evora.
          </span>
        </label>

        <button type="submit" className="btn-primary mt-6">
          Continue →
        </button>
      </form>
    </AuthLayout>
  )
}

function ProfileField({ label, value, onChange, icon, type = 'text' }) {
  return (
    <div className="flex items-center gap-3 bg-evora-card border border-evora-border rounded-xl px-4 py-3.5 focus-within:border-evora-green/70">
      <span className="shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-evora-muted/70 text-[10px] uppercase tracking-wide">{label}</p>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none w-full text-evora-text text-sm"
        />
      </div>
      <CheckCircle2 size={18} className="text-evora-green shrink-0" />
    </div>
  )
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.5 29.6 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5 44.5 35.3 44.5 24c0-1.2-.1-2.4-.3-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.5 29.6 4.5 24 4.5c-7.7 0-14.4 4.4-17.7 10.2z"/>
      <path fill="#4CAF50" d="M24 44.5c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5c-2.1 1.5-4.8 2.4-7.6 2.4-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.6 40 16.3 44.5 24 44.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.5 5.5C41.4 35.9 44.5 30.4 44.5 24c0-1.2-.1-2.4-.3-3.5z"/>
    </svg>
  )
}
