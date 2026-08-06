import { useNavigate } from 'react-router-dom'
import { LogOut, Zap, MapPin, ArrowLeft } from 'lucide-react'
import { useAccountType } from '../context/AccountTypeContext.jsx'

export default function Dashboard() {
  const navigate = useNavigate()
  const { accountType } = useAccountType()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10 border-b border-evora-border">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-evora-green hover:text-evora-green/80 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-evora-muted hover:text-evora-green text-sm transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="w-16 h-16 rounded-full bg-evora-green/10 border border-evora-green/30 flex items-center justify-center text-evora-green mb-6">
          <Zap size={28} />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-evora-text mb-2">
          Welcome back to Evora
        </h1>
        <p className="text-evora-muted text-sm max-w-sm mb-1">
          You&apos;re signed in as a <span className="text-evora-green capitalize">{accountType}</span>.
        </p>
        <p className="text-evora-muted/70 text-xs max-w-sm">
          This is a placeholder home screen — build out the {accountType} dashboard here.
        </p>

        <div className="flex items-center gap-2 mt-8 text-evora-muted text-xs">
          <MapPin size={14} className="text-evora-green" />
          Nearest station data will appear here
        </div>
      </main>
    </div>
  )
}
