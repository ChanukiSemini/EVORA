import { X, Mail, MessageCircle, Phone, LifeBuoy } from 'lucide-react'

/**
 * Slide-in help panel, opened from the "Help" button in TopBar.
 * Controlled component: visibility is driven entirely by `isOpen`.
 */
export default function HelpDrawer({ isOpen, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Help"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-evora-panel border-l border-evora-border shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-evora-border">
          <div className="flex items-center gap-2 text-evora-text font-display font-bold text-lg">
            <LifeBuoy size={20} className="text-evora-green" />
            Help &amp; Support
          </div>
          <button
            onClick={onClose}
            aria-label="Close help"
            className="w-8 h-8 flex items-center justify-center rounded-full text-evora-muted hover:text-evora-text hover:bg-evora-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <p className="text-evora-muted text-sm leading-relaxed">
              Need a hand? Browse the quick answers below, or reach out to the Evora team directly.
            </p>
          </div>

          <div>
            <h3 className="text-evora-green text-xs font-semibold uppercase tracking-wide mb-3">
              Frequently Asked
            </h3>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-evora-card border border-evora-border rounded-xl p-4">
                  <p className="text-evora-text text-sm font-medium mb-1">{faq.q}</p>
                  <p className="text-evora-muted text-xs leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-evora-green text-xs font-semibold uppercase tracking-wide mb-3">
              Contact Us
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:support@evora.app"
                className="flex items-center gap-3 bg-evora-card border border-evora-border rounded-xl px-4 py-3 text-sm text-evora-text hover:border-evora-green/50 transition-colors"
              >
                <Mail size={16} className="text-evora-green shrink-0" />
                support@evora.app
              </a>
              <a
                href="tel:+94112345678"
                className="flex items-center gap-3 bg-evora-card border border-evora-border rounded-xl px-4 py-3 text-sm text-evora-text hover:border-evora-green/50 transition-colors"
              >
                <Phone size={16} className="text-evora-green shrink-0" />
                +94 11 234 5678
              </a>
              <button
                type="button"
                className="w-full flex items-center gap-3 bg-evora-card border border-evora-border rounded-xl px-4 py-3 text-sm text-evora-text hover:border-evora-green/50 transition-colors"
              >
                <MessageCircle size={16} className="text-evora-green shrink-0" />
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const FAQS = [
  {
    q: 'How do I find a charging station near me?',
    a: 'Once logged in, open the map view from your dashboard to see nearby stations with live availability.',
  },
  {
    q: 'How do I register as a host?',
    a: 'Choose "Create Host Account" from the sign-up screen and complete either the business or individual form.',
  },
  {
    q: 'I didn\u2019t receive my OTP code.',
    a: 'Wait for the resend timer to finish, then tap "Resend Code". Check that your phone number was entered correctly.',
  },
]
