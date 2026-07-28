function NetworkStatRow({ color, label, sub, value, extra }) {
  return (
    <div className="stat-row">
      <div className="stat-row-left">
        <span className="stat-dot" style={{ backgroundColor: color }}></span>
        <div>
          <strong>{label}</strong>
          <p className="stat-sub">{sub}</p>
        </div>
      </div>
      <div className="stat-row-right">
        <strong>{value}</strong>
        <p className="stat-extra" style={{ color }}>{extra}</p>
      </div>
    </div>
  )
}

export default NetworkStatRow