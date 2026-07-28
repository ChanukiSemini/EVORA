import { useNavigate } from 'react-router-dom'

function EscalationCard({ session }) {
  const navigate = useNavigate()

  return (
    <div className="escalation-card">
      <div className="escalation-top">
        <div className="escalation-user">
          <div className="avatar-circle">{session.name.charAt(0)}</div>
          <div>
            <strong>{session.name}</strong>
            <p className="escalation-charger">Charger ID: {session.chargerId}</p>
          </div>
        </div>

        <div className="escalation-top-right">
          <span className="critical-badge">CRITICAL</span>
          <button className="take-over-btn take-over-compact" onClick={() => navigate(`/admin/case/${session.id}`)}>
            📞 Take Over
          </button>
        </div>
      </div>

      <p className="escalation-message">"{session.lastMessage}"</p>

      <button className="take-over-btn take-over-full" onClick={() => navigate(`/admin/case/${session.id}`)}>
        📞 Take Over
      </button>
    </div>
  )
}

export default EscalationCard