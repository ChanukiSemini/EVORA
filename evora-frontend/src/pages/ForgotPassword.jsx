import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, KeyRound, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout.jsx'
import { IconInput } from '../components/IconInput.jsx'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <AuthLayout
      onBack={() => navigate('/login')}
      hero={
        <>
          <h1 className="font-display text-5xl font-bold text-evora-green mb-2">Evora</h1>
          <p className="text-evora-muted text-lg mb-1">Power Your Journey</p>
        </>
      }
    >
      <div className="card p-8">
        <div className="w-14 h-14 rounded-full bg-evora-green/10 border border-evora-green/30 flex items-center justify-center text-evora-green mb-6">
          <KeyRound size={24} />
        </div>

        {!sent ? (
          <>
            <h2 className="font-display text-2xl font-bold text-evora-text mb-1">Reset Your Password</h2>
            <p className="text-evora-muted text-sm mb-6">
              Enter the email linked to your account and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <IconInput
                icon={<Mail size={18} />}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />

              <button type="submit" className="btn-primary">
                Send Reset Link
              </button>
            </form>

            <p className="text-center text-evora-muted text-sm mt-6">
              Remembered your password?{' '}
              <button onClick={() => navigate('/login')} className="text-evora-green font-medium hover:underline">
                Back to Login
              </button>
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="text-evora-green mb-4" size={28} />
            <h2 className="font-display text-2xl font-bold text-evora-text mb-1">Check Your Email</h2>
            <p className="text-evora-muted text-sm mb-6">
              We&apos;ve sent a password reset link to <span className="text-evora-green">{email || 'your email'}</span>.
            </p>
            <button onClick={() => navigate('/login')} className="btn-primary">
              Back to Login
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
