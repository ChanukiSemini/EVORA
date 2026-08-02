import { useNavigate } from 'react-router-dom'
import { Car, Users2, ArrowRight } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import { useAccountType } from '../context/AccountTypeContext.jsx'

export default function ChooseAccountType() {
  const navigate = useNavigate()
  const { accountType, setAccountType } = useAccountType()

  const options = [
    {
      key: 'driver',
      icon: <Car size={28} />,
      title: "I'm a Driver",
      desc: 'Find nearby charging stations, check availability, view pricing and navigate to your nearest Evora point.',
    },
    {
      key: 'host',
      icon: <Users2 size={28} />,
      title: "I'm a Host",
      desc: 'Manage charging stations, monitor usage, update availability and oversee the Evora network operations.',
    },
  ]

  const handleSelect = (key) => {
    setAccountType(key)
    // Both driver and host paths land on the shared login page
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col px-5 py-5 sm:px-8 sm:py-8 lg:px-20 lg:py-10">
      <TopBar onBack={() => navigate('/')} backLabel="Back to Get Started" />

      <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 max-w-5xl mx-auto w-full mt-10 animate-fade-in-up">
        <div className="max-w-sm">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-evora-green mb-4 leading-tight">
            Choose Your Account Type
          </h1>
          <p className="text-evora-muted text-sm">
            Select the role that best describes you to personalize your Evora experience.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {options.map((opt) => {
            const selected = accountType === opt.key
            return (
              <button
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                className={`card text-left p-7 relative transition-all hover:shadow-glow hover:-translate-y-0.5 ${
                  selected ? 'border-evora-green shadow-glow' : 'border-evora-border'
                }`}
              >
                {selected && (
                  <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-evora-green flex items-center justify-center text-evora-bg text-xs">
                    ✓
                  </span>
                )}
                <div className="w-14 h-14 rounded-full bg-evora-green/10 flex items-center justify-center text-evora-green mb-6">
                  {opt.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{opt.title}</h3>
                <p className="text-evora-muted text-sm leading-relaxed mb-8">{opt.desc}</p>
                <ArrowRight className="text-evora-green" size={20} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
