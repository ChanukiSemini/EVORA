import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, MapPin, Zap, BarChart3 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout.jsx'
import { IconInput } from '../components/IconInput.jsx'
import { useAccountType } from '../context/AccountTypeContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { accountType } = useAccountType()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  const handleGoogleLogin = () => {
    navigate('/complete-profile')
  }

  const handleFacebookLogin = () => {
    window.open('https://www.facebook.com', '_blank', 'noopener,noreferrer')
  }

  const features = [
    { icon: <MapPin size={18} />, title: 'Find Stations', desc: 'Locate charging stations near you.' },
    { icon: <Zap size={18} />, title: 'Smart Charging', desc: 'Real-time availability and pricing.' },
    { icon: <BarChart3 size={18} />, title: 'Seamless Experience', desc: 'Effortless charging, payments and more.' },
  ]

  return (
    <AuthLayout
      onBack={() => navigate('/')}
      hero={
        <>
          <h1 className="font-display text-5xl font-bold text-evora-green mb-2">Evora</h1>
          <p className="text-evora-muted text-lg mb-1">Power Your Journey</p>
          <p className="text-evora-muted/70 text-sm mb-10">Find. Charge. Go Green. Your smart EV charging companion.</p>
        </>
      }
      features={features}
    >
      <div className="card p-8">
        <h2 className="font-display text-2xl font-bold text-evora-green mb-1">Welcome Back</h2>
        <p className="text-evora-muted text-sm mb-6">Login to continue your Evora journey</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <IconInput
            icon={<Mail size={18} />}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <IconInput
            icon={<Lock size={18} />}
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-evora-muted hover:text-evora-green"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-evora-muted cursor-pointer">
              <input type="checkbox" className="accent-evora-green w-4 h-4 rounded" />
              Remember Me
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-evora-green hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="btn-primary mt-2">
            Login
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-evora-border" />
          <span className="text-evora-muted text-xs">or continue with</span>
          <div className="flex-1 h-px bg-evora-border" />
        </div>

        <div className="space-y-3">
          <button onClick={handleGoogleLogin} className="btn-secondary">
            <GoogleIcon />
            Login with Google
          </button>
          <button onClick={handleFacebookLogin} className="btn-secondary">
            <FacebookIcon />
            Login with Facebook
          </button>
        </div>

        <p className="text-center text-evora-muted text-sm mt-6">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => navigate(accountType === 'host' ? '/create-account/host' : '/create-account/driver')}
            className="text-evora-green font-medium hover:underline"
          >
            Create an Account
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.5 29.6 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5 44.5 35.3 44.5 24c0-1.2-.1-2.4-.3-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.5 29.6 4.5 24 4.5c-7.7 0-14.4 4.4-17.7 10.2z"/>
      <path fill="#4CAF50" d="M24 44.5c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5c-2.1 1.5-4.8 2.4-7.6 2.4-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.6 40 16.3 44.5 24 44.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.5 5.5C41.4 35.9 44.5 30.4 44.5 24c0-1.2-.1-2.4-.3-3.5z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.8 8.44-4.94 8.44-9.94z"/>
    </svg>
  )
}
