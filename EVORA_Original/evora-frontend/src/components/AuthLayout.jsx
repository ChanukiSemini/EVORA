import HeroIllustration from './HeroIllustration.jsx'
import TopBar from './TopBar.jsx'

/**
 * Shared split layout used across the auth flow:
 * - Desktop / web view (lg+): hero pane on the left, form card on the right
 * - Mobile view: hero pane hidden, form only
 *
 * The back arrow always sits in the top-left corner of the interface,
 * and Help always sits top-right - consistent on every screen.
 */
export default function AuthLayout({
  hero,
  features,
  children,
  onBack,
  backLabel,
  showBack = true,
  maxWidth = 'max-w-[520px]',
}) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="px-5 pt-5 sm:px-8 sm:pt-8 lg:px-12 lg:pt-10">
        <TopBar onBack={onBack} backLabel={backLabel} showBack={showBack} />
      </div>

      <div className="flex-1 w-full flex flex-col lg:flex-row">
        {/* Hero pane - hidden on mobile view, visible on web view */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center gap-10 p-12 xl:p-16 relative overflow-hidden">
          <div className="relative z-10">
            <HeroIllustration className="w-full max-w-md mb-10" />
            {hero}
          </div>

          {features && (
            <div className="relative z-10 grid grid-cols-1 gap-5 max-w-sm">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-evora-green/10 border border-evora-green/30 flex items-center justify-center text-evora-green">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-evora-text text-sm">{f.title}</p>
                    <p className="text-evora-muted text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-evora-green/10 blur-3xl" />
        </div>

        {/* Form pane - full width on mobile, right half on web */}
        <div className="flex-1 flex flex-col p-5 sm:p-8 lg:p-12 xl:p-16">
          <div className={`w-full ${maxWidth} mx-auto flex-1 flex flex-col justify-center py-4 animate-fade-in-up`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
