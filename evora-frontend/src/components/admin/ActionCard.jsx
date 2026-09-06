function ActionCard({ icon, title, description, color, onClick }) {
  return (
    <div className="action-card-tile" onClick={onClick}>
      <div>
        <div className="action-card-header">
          <span className="action-card-circle-icon" style={{ backgroundColor: color }}>
            {icon}
          </span>
          <h3 className="action-card-title" style={{ color }}>{title}</h3>
        </div>
        <p className="action-card-desc">{description}</p>
      </div>

      <div className="action-card-footer">
        <span className="action-card-arrow" style={{ color, borderColor: `${color}40` }}>
          Select Action →
        </span>
      </div>
    </div>
  )
}

export default ActionCard