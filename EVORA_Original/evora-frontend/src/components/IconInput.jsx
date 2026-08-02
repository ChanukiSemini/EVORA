import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * Shared icon + input control used across every auth screen.
 *
 * Deliberately built with flexbox (icon and input as normal flex
 * siblings) instead of "absolute-positioned icon + padding-left on
 * the input" - the padding approach is fragile because it depends on
 * a utility class (e.g. pl-11) winning a CSS cascade fight against
 * shared classes like .field, which is easy to accidentally break.
 * With flexbox the icon can never overlap the text, regardless of
 * class order or which stylesheet loads.
 */
export function IconInput({ icon, rightElement, className = '', inputClassName = '', ...inputProps }) {
  return (
    <div
      className={`flex items-center gap-3 bg-evora-card border border-evora-border rounded-xl px-4 py-3.5 transition-colors focus-within:border-evora-green/70 focus-within:shadow-glow-sm ${className}`}
    >
      {icon && <span className="shrink-0 text-evora-green flex items-center">{icon}</span>}
      <input
        {...inputProps}
        className={`flex-1 min-w-0 bg-transparent outline-none text-evora-text placeholder:text-evora-muted/50 text-sm ${inputClassName}`}
      />
      {rightElement && <span className="shrink-0 flex items-center">{rightElement}</span>}
    </div>
  )
}

/**
 * Fully custom dropdown - NOT a native <select>.
 *
 * A native <select>'s option list is rendered by the browser/OS, not
 * by the page, so it can't reliably be themed with Tailwind (it shows
 * up as a plain white box on many platforms regardless of CSS). This
 * component reproduces the same look/behaviour as IconInput using
 * plain styled elements, so the option list matches the dark teal
 * theme and every pixel of the control - icon, text, and arrow - is
 * part of one clickable button.
 */
export function IconSelect({ icon, placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full h-full flex items-center gap-3 bg-evora-card border border-evora-border rounded-xl px-4 py-3.5 text-left cursor-pointer transition-colors hover:border-evora-green/40 focus:outline-none focus:border-evora-green/70"
      >
        {icon && <span className="shrink-0 text-evora-green flex items-center pointer-events-none">{icon}</span>}
        <span className={`flex-1 min-w-0 truncate text-sm pointer-events-none ${value ? 'text-evora-text' : 'text-evora-muted/50'}`}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-evora-muted pointer-events-none transition-transform duration-200 ${open ? 'rotate-180 text-evora-green' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-xl border border-evora-border bg-[#0f2931] shadow-xl py-1.5 animate-fade-in-up"
        >
          {options.map((opt) => (
            <li key={opt} role="option" aria-selected={value === opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left cursor-pointer transition-colors ${
                  value === opt ? 'text-evora-green bg-evora-green/10' : 'text-white hover:bg-evora-green/10 hover:text-evora-green'
                }`}
              >
                {opt}
                {value === opt && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
