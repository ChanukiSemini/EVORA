import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'

export default function AccountCreated() {
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
    if (seconds <= 0) {
      navigate('/login')
      return
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds, navigate])

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 sm:px-10">
      <TopBar onBack={() => navigate('/login')} />

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-evora-green/10 blur-2xl scale-150" />
          <div className="absolute inset-0 rounded-full border border-evora-green/20 scale-150" />
          <div className="absolute inset-0 rounded-full border border-evora-green/10 scale-[2]" />
          <div className="relative w-24 h-24 rounded-full bg-evora-green flex items-center justify-center">
            <Check size={40} className="text-evora-bg" strokeWidth={3} />
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-evora-text mb-4">Account Created!</h1>
        <p className="text-evora-muted text-sm sm:text-base mb-10 leading-relaxed">
          Thank you for signing up! Your account has been successfully created. You can now log in using your
          registered email address.
        </p>

        <button onClick={() => navigate('/login')} className="btn-primary max-w-xs mb-6">
          Continue to Login <ArrowRight size={18} />
        </button>

        <div className="flex items-center gap-3 text-evora-muted text-sm">
          <div className="w-4 h-4 rounded-full border-2 border-evora-green border-t-transparent animate-spin" />
          Redirecting to login in {seconds}s...
        </div>
      </div>
    </div>
  )
}
