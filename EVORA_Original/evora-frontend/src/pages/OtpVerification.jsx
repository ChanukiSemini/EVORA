import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import AuthLayout from '../components/AuthLayout.jsx'

export default function OtpVerification() {
  const navigate = useNavigate()
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [error, setError] = useState('')
  const inputsRef = useRef([])

  useEffect(() => {
    if (timer <= 0) return
    const t = setTimeout(() => setTimer((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  const handleChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (error) setError('')
    if (val && i < 5) inputsRef.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus()
    }
  }

  const handleKeypad = (val) => {
    const idx = digits.findIndex((d) => d === '')
    if (val === 'del') {
      const lastFilled = [...digits].reverse().findIndex((d) => d !== '')
      if (lastFilled === -1) return
      const realIdx = digits.length - 1 - lastFilled
      const next = [...digits]
      next[realIdx] = ''
      setDigits(next)
      return
    }
    if (idx === -1) return
    handleChange(idx, val)
  }

  const handleVerify = (e) => {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < 6 || digits.some((d) => d === '')) {
      setError('Please enter the full 6-digit code sent to your phone.')
      return
    }
    setError('')
    navigate('/account-created')
  }

  return (
    <AuthLayout
      onBack={() => navigate(-1)}
      hero={
        <>
          <h1 className="font-display text-4xl font-bold text-evora-text mb-2">
            Verify <span className="text-evora-green">Your Number</span>
          </h1>
          <p className="text-evora-muted text-sm">
            Enter the 6-digit code sent to <span className="text-evora-green">+94 7XX XXX XXX</span>
          </p>
        </>
      }
    >
      <form onSubmit={handleVerify} className="card p-8">
        <div className="w-14 h-14 rounded-full bg-evora-green/10 border border-evora-green/30 flex items-center justify-center text-evora-green mb-6 lg:hidden">
          <ShieldCheck size={24} />
        </div>
        <h2 className="font-display text-2xl font-bold text-evora-text mb-1 lg:hidden">Verify Your Number</h2>
        <p className="text-evora-muted text-sm mb-6 lg:hidden">
          Enter the 6-digit code sent to <span className="text-evora-green">+94 7XX XXX XXX</span>
        </p>

        <div className="grid grid-cols-6 gap-2 mb-6">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              maxLength={1}
              inputMode="numeric"
              className={`aspect-square text-center text-xl font-semibold bg-evora-card border rounded-xl outline-none transition-colors ${
                d ? 'border-evora-green text-evora-green' : 'border-evora-border text-evora-text'
              } focus:border-evora-green`}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

        <p className="text-center text-sm text-evora-muted mb-6">
          Didn&apos;t receive the code?{' '}
          {timer > 0 ? (
            <span className="text-evora-green font-medium">Resend Code (00:{String(timer).padStart(2, '0')})</span>
          ) : (
            <button type="button" onClick={() => setTimer(30)} className="text-evora-green font-medium hover:underline">
              Resend Code
            </button>
          )}
        </p>

        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => handleKeypad(n)}
              className="py-3.5 rounded-xl border border-evora-border text-evora-text font-medium hover:border-evora-green/50 hover:bg-evora-card transition-colors"
            >
              {n}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleKeypad('0')}
            className="py-3.5 rounded-xl border border-evora-border text-evora-text font-medium hover:border-evora-green/50 hover:bg-evora-card transition-colors"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleKeypad('del')}
            className="py-3.5 rounded-xl border border-evora-border text-evora-muted hover:border-evora-green/50 hover:bg-evora-card transition-colors"
          >
            ⌫
          </button>
        </div>

        <button type="submit" className="btn-primary">
          Verify
        </button>
      </form>
    </AuthLayout>
  )
}
