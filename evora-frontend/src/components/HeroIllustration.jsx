import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Sample points along the charging cable's curve (station -> car),
// precomputed from the cubic Bezier "M330 150 C 300 150, 290 170, 260 168".
// Animating cx/cy through these keeps the energy particles glued to
// the visible cable without depending on CSS motion-path support.
const CABLE_POINTS_X = [330, 314, 301, 289, 276, 260]
const CABLE_POINTS_Y = [150, 151, 157, 163, 167, 168]

// Battery bar geometry inside the station's smart display screen.
const BAR_X = 345
const BAR_TOP = 95
const BAR_HEIGHT = 32
const BAR_WIDTH = 16

export default function HeroIllustration({ className = '' }) {
  const [hovered, setHovered] = useState(false)
  const [battery, setBattery] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setBattery((b) => (b >= 100 ? 0 : b + 2))
    }, 110)
    return () => clearInterval(id)
  }, [])

  const filledHeight = (battery / 100) * BAR_HEIGHT
  const filledY = BAR_TOP + (BAR_HEIGHT - filledHeight)

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {/* Pulsing neon-green radial background glow */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(61,220,151,0.35) 0%, rgba(10,25,31,0) 70%)',
        }}
        animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.92, 1.06, 0.92] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg viewBox="-60 0 480 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative w-full h-auto">
        {/*
          Pure CSS keyframes, defined right inside this component (as
          opposed to depending on Framer Motion's SVG transform
          handling), so the float animation is guaranteed to work the
          same way in every browser. Applied to a single wrapping <g>
          so the entire illustration - station, cable, particles, and
          car - floats up and down together as one piece.
        */}
        <style>
          {`
            @keyframes evoraIllustrationFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            .evora-illustration-float {
              animation: evoraIllustrationFloat 3.6s ease-in-out infinite;
              transform-box: fill-box;
              transform-origin: center;
            }
          `}
        </style>

        <g className="evora-illustration-float">
          {/* ground glow */}
          <ellipse cx="180" cy="235" rx="170" ry="14" fill="url(#groundGlow)" />

          {/* charging station casing */}
          <rect x="330" y="70" width="46" height="140" rx="10" fill="#063242" stroke="#2bb87c" strokeWidth="1.5" />

          {/* smart display screen */}
          <rect
            x="336"
            y="78"
            width="34"
            height="64"
            rx="6"
            fill="#0a191f"
            stroke="#3DDC97"
            strokeWidth="1.4"
            style={{ filter: 'drop-shadow(0 0 5px rgba(61,220,151,0.55))' }}
          />

          {/* small pulsing lightning icon at the top of the screen */}
          <path
            d="M353 82 L349 90 L353 90 L350 98 L358 88 L354 88 Z"
            fill="#3DDC97"
            className="animate-pulse"
            style={{ filter: 'drop-shadow(0 0 3px #3DDC97)' }}
          />

          {/* battery bar outline */}
          <rect
            x={BAR_X - 1}
            y={BAR_TOP - 1}
            width={BAR_WIDTH + 2}
            height={BAR_HEIGHT + 2}
            rx="2"
            fill="none"
            stroke="#3DDC97"
            strokeOpacity="0.5"
            strokeWidth="1"
          />

          {/* live battery fill, animating from 0% to 100% and looping */}
          <rect
            x={BAR_X}
            y={filledY}
            width={BAR_WIDTH}
            height={filledHeight}
            rx="1.5"
            fill="#3DDC97"
            style={{
              filter: 'drop-shadow(0 0 4px #3DDC97)',
              transition: 'height 0.15s linear, y 0.15s linear',
            }}
          />

          {/* live percentage counter */}
          <text
            x="353"
            y="140"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fontFamily="ui-monospace, monospace"
            fill="#3DDC97"
            style={{ filter: 'drop-shadow(0 0 3px rgba(61,220,151,0.7))' }}
          >
            {battery}%
          </text>

          {/* charging cable */}
          <path d="M330 150 C 300 150, 290 170, 260 168" stroke="#2bb87c" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* animated energy particles flowing station -> car */}
          {[0, 0.6, 1.2].map((delay, i) => (
            <motion.circle
              key={i}
              r="3"
              fill="#3DDC97"
              style={{ filter: 'drop-shadow(0 0 4px #3DDC97)' }}
              animate={{ cx: CABLE_POINTS_X, cy: CABLE_POINTS_Y, opacity: [0, 1, 1, 1, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay }}
            />
          ))}

          {/* car group */}
          <g>
            {/* headlight beam - only visible on hover/touch */}
            <AnimatePresence>
              {hovered && (
                <motion.path
                  d="M22 163 L -46 140 L -46 198 L 22 173 Z"
                  fill="url(#beamGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </AnimatePresence>

            <path
              d="M20 190 C20 165 45 150 80 148 L110 120 C120 110 140 104 165 104 L230 104 C250 104 262 112 270 124 L285 148 C305 150 320 165 320 190 L320 195 L20 195 Z"
              fill="#052a37"
              stroke="#3DDC97"
              strokeWidth="1.5"
            />
            <path
              d="M118 118 L145 108 L215 108 L238 122 Z"
              fill="#031C26"
              stroke="#3DDC97"
              strokeWidth="1"
              opacity="0.7"
            />

            {/* headlight - glows brighter and shifts colour on hover/touch */}
            <motion.ellipse
              cx="35"
              cy="168"
              rx="10"
              ry="4"
              animate={{
                fill: hovered ? '#FFE066' : '#3DDC97',
                opacity: hovered ? 1 : 0.9,
              }}
              transition={{ duration: 0.25 }}
            />
            <motion.ellipse
              cx="30"
              cy="168"
              animate={{
                rx: hovered ? 32 : 20,
                ry: hovered ? 10 : 6,
                fill: hovered ? '#FFE066' : '#3DDC97',
                opacity: hovered ? 0.45 : 0.25,
              }}
              transition={{ duration: 0.25 }}
            />

            {/* wheels */}
            <circle cx="95" cy="196" r="18" fill="#031C26" stroke="#2bb87c" strokeWidth="2" />
            <circle cx="255" cy="196" r="18" fill="#031C26" stroke="#2bb87c" strokeWidth="2" />
          </g>
        </g>

        <defs>
          <radialGradient id="groundGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#3DDC97" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3DDC97" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="beamGradient" x1="22" y1="168" x2="-46" y2="168" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE066" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3DDC97" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
