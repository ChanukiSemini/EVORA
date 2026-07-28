function ChargerCard({ name, location, status, availablePlugs, totalPlugs }) {
  const statusColors = {
    open: '#22e584',
    closed: '#ff4d6d',
  }

  const borderColor = statusColors[status] || '#374151'

  return (
    <div style={{
      backgroundColor: '#0f1524',
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: '10px',
      padding: '12px',
    }}>
      <strong style={{ fontSize: '13px', color: '#e5e7eb' }}>{name}</strong>
      <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0' }}>{location}</p>
      <p style={{ fontSize: '15px', fontWeight: 'bold', margin: '6px 0 2px', color: borderColor }}>
        {status === 'open' ? 'OPEN' : 'CLOSED'}
      </p>
      <small style={{ color: '#9ca3af', fontSize: '11px' }}>
        {availablePlugs}/{totalPlugs} ports available
      </small>
    </div>
  )
}

export default ChargerCard