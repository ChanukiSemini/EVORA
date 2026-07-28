function ActionCard({ icon, title, description, color, onClick }) {
  return (
    <div className="action-card" style={{ borderLeftColor: color }} onClick={onClick}>
      <div>
        <strong style={{ color }}>{title}</strong>
        <p className="action-card-desc">{description}</p>
      </div>
      <span className="action-card-icon" style={{ backgroundColor: color }}>
        {icon}
      </span>
    </div>
  )
}

export default ActionCard