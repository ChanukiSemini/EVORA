import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, FileText, User, Mail, Phone, Lock, Eye, EyeOff, UploadCloud, BarChart3, ShieldCheck, Globe2, CreditCard, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout.jsx'
import { IconInput } from '../components/IconInput.jsx'

export default function CreateHostAccount() {
  const navigate = useNavigate()
  const [type, setType] = useState('business') // 'business' | 'individual'
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [agree, setAgree] = useState(true)

  const [businessName, setBusinessName] = useState('')
  const [regNumber, setRegNumber] = useState('')
  const [contactName, setContactName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [certificate, setCertificate] = useState(null)
  const certInputRef = useRef(null)

  const [individualName, setIndividualName] = useState('')
  const [individualId, setIndividualId] = useState('')
  const [individualEmail, setIndividualEmail] = useState('')

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleCertClick = () => certInputRef.current?.click()
  const handleCertChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setCertificate(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (type === 'business') {
      if (!businessName.trim() || !regNumber.trim() || !contactName.trim() || !businessEmail.trim()) {
        setError('Please fill in all business details to continue.')
        return
      }
      if (!/^[A-Za-z\s.'-]+$/.test(contactName.trim())) {
        setError('Contact person name should only contain letters.')
        return
      }
      if (!certificate) {
        setError('Please upload your Business Registration Certificate.')
        return
      }
    } else {
      if (!individualName.trim() || !individualId.trim() || !individualEmail.trim()) {
        setError('Please fill in all fields to continue.')
        return
      }
      if (!/^[A-Za-z\s.'-]+$/.test(individualName.trim())) {
        setError('Full name should only contain letters.')
        return
      }
    }

    if (!phone.trim()) {
      setError('Please enter your phone number.')
      return
    }
    if (!/^\d{7,10}$/.test(phone.trim())) {
      setError('Please enter a valid phone number.')
      return
    }
    if (!password || !confirmPassword) {
      setError('Please enter and confirm your password.')
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

  const features = [
    { icon: <BarChart3 size={18} />, title: 'Grow your business', desc: 'Attract more EV drivers and increase revenue.' },
    { icon: <ShieldCheck size={18} />, title: 'Trusted by thousands', desc: 'Join a network of verified and trusted hosts.' },
    { icon: <Globe2 size={18} />, title: 'Make a green impact', desc: 'Support sustainable transport and a cleaner future.' },
  ]

  return (
    <AuthLayout
      onBack={() => navigate('/')}
      hero={
        <>
          <h1 className="font-display text-3xl font-bold text-evora-text mb-2">Create Host Account</h1>
          <p className="text-evora-muted text-sm">Register as a business or individual host to start earning.</p>
        </>
      }
      features={features}
      maxWidth="max-w-[560px]"
    >
      <div className="lg:hidden mb-6">
        <h1 className="font-display text-2xl font-bold text-evora-text mb-1">Create Host Account</h1>
        <p className="text-evora-muted text-sm">Register as a business or individual host to start earning.</p>
      </div>

      <div className="flex bg-evora-card border border-evora-border rounded-full p-1 mb-6">
        <button
          type="button"
          onClick={() => { setType('business'); setError('') }}
          className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors ${
            type === 'business' ? 'bg-evora-green text-evora-bg' : 'text-evora-muted'
          }`}
        >
          Business
        </button>
        <button
          type="button"
          onClick={() => { setType('individual'); setError('') }}
          className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors ${
            type === 'individual' ? 'bg-evora-green text-evora-bg' : 'text-evora-muted'
          }`}
        >
          Individual
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'business' ? (
          <>
            <IconInput
              icon={<Building2 size={17} />}
              placeholder="e.g. Lanka EV Solutions (Pvt) Ltd"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <div>
              <IconInput
                icon={<FileText size={17} />}
                placeholder="e.g. PV 00123456"
                required
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
              />
              <p className="text-evora-muted/60 text-xs mt-1.5 ml-1">As per your Certificate of Incorporation</p>
            </div>
            <div>
              <IconInput
                icon={<User size={17} />}
                placeholder="e.g. Nimal Perera"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value.replace(/[^A-Za-z\s.'-]/g, ''))}
              />
              <p className="text-evora-muted/60 text-xs mt-1.5 ml-1">Person responsible for managing this account</p>
            </div>
            <IconInput
              icon={<Mail size={17} />}
              type="email"
              placeholder="company@business.com"
              required
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
            />
          </>
        ) : (
          <>
            <IconInput
              icon={<User size={17} />}
              placeholder="e.g. Nimal Perera"
              required
              value={individualName}
              onChange={(e) => setIndividualName(e.target.value.replace(/[^A-Za-z\s.'-]/g, ''))}
            />
            <div>
              <IconInput
                icon={<CreditCard size={17} />}
                placeholder="e.g. 200012345678 or N1234567"
                required
                value={individualId}
                onChange={(e) => setIndividualId(e.target.value)}
              />
              <p className="text-evora-muted/60 text-xs mt-1.5 ml-1">Required for identity verification</p>
            </div>
            <IconInput
              icon={<Mail size={17} />}
              type="email"
              placeholder="you@example.com"
              required
              value={individualEmail}
              onChange={(e) => setIndividualEmail(e.target.value)}
            />
          </>
        )}

        <div className="flex items-center gap-2 bg-evora-card border border-evora-border rounded-xl px-4 py-3.5 focus-within:border-evora-green/70">
          <Phone size={17} className="text-evora-green" />
          <span className="text-evora-muted text-sm">+94</span>
          <div className="w-px h-4 bg-evora-border" />
          <input
            type="tel"
            required
            placeholder="77 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
            className="bg-transparent outline-none flex-1 text-sm placeholder:text-evora-muted/50"
          />
        </div>

        <PasswordField show={showPw} setShow={setShowPw} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <PasswordStrength password={password} />
        <PasswordField show={showConfirmPw} setShow={setShowConfirmPw} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        {type === 'business' && (
          <div>
            <input
              ref={certInputRef}
              type="file"
              accept=".pdf,image/*"
              onChange={handleCertChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleCertClick}
              className="w-full border-2 border-dashed border-evora-border rounded-xl px-6 py-8 flex flex-col items-center text-center hover:border-evora-green/50 transition-colors"
            >
              {certificate ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-evora-green/10 flex items-center justify-center text-evora-green mb-3">
                    <CheckCircle2 size={22} />
                  </div>
                  <p className="font-semibold text-sm text-evora-text truncate max-w-full">{certificate.name}</p>
                  <p className="text-evora-muted/70 text-xs mt-1">Tap to choose a different file</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-evora-green/10 flex items-center justify-center text-evora-green mb-3">
                    <UploadCloud size={22} />
                  </div>
                  <p className="font-semibold text-sm text-evora-text">Upload Business Registration Certificate</p>
                  <p className="text-evora-muted/70 text-xs mt-1">PDF or high-quality image (max 5MB)</p>
                  <span className="mt-3 text-xs bg-evora-green/10 text-evora-green px-3 py-1 rounded-full">Required for verification</span>
                </>
              )}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <label className="flex items-start gap-2 text-sm text-evora-muted cursor-pointer">
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
          Continue →
        </button>
      </form>
    </AuthLayout>
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

function PasswordStrength({ password = '' }) {
  const score = getPasswordScore(password)
  const colors = ['bg-evora-border', 'bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-evora-green']

  return (
    <div className="flex items-center gap-2 -mt-2">
      <div className="flex gap-1 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? colors[score] : 'bg-evora-border'}`} />
        ))}
      </div>
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
