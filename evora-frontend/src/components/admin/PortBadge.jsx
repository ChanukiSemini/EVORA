function PortBadge({ port }) {
  const statusColors = {
    available: '#22e584',
    occupied: '#3b9eff',
    reserved: '#f5c744',
    faulty: '#ff4d6d',
  }

  const color = statusColors[port.status] || '#374151'

  return (
    <div className="port-tile" style={{ borderColor: color }}>
      <span className="port-tile-icon" style={{ color }}>⚡</span>
      <span className="port-tile-id">{port.id.replace('port-', 'Port ')}</span>
      <span className="port-tile-status" style={{ color }}>{port.status}</span>
    </div>
  )
}

export default PortBadge