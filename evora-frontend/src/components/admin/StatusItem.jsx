function StatusItem({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block'
      }}></span>
      <span style={{ fontSize: '13px', color: '#e5e7eb' }}>{label}</span>
    </div>
  )
}

export default StatusItem