import { useState } from 'react'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import HelpDrawer from './HelpDrawer.jsx'

/**
 * Shared top bar for every interface.
 * - Left: back arrow (goes to previous screen in history)
 * - Right: Need Help button, opens the HelpDrawer
 * Pass `onBack` to override default browser-back behaviour (e.g. to
 * force navigation to a specific route like "Back to Get Started").
 */
export default function TopBar({ onBack, backLabel, showBack = true, className = '' }) {
  const navigate = useNavigate()
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const handleBack = () => {
    if (onBack) return onBack()
    navigate(-1)
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {showBack ? (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-evora-green hover:text-evora-green/80 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          {backLabel && <span>{backLabel}</span>}
        </button>
      ) : (
        <span />
      )}

      <button
        onClick={() => setIsHelpOpen((open) => !open)}
        className="flex items-center gap-1.5 text-evora-green hover:text-evora-green/80 transition-colors text-sm font-medium border border-evora-border rounded-full px-3 py-1.5"
      >
        <HelpCircle size={16} />
        Help
      </button>

      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}
