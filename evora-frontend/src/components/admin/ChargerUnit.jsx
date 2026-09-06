import PortBadge from './PortBadge'

function ChargerUnit({ charger, index = 0 }) {
  const unitNum = charger.id && charger.id.startsWith('charger-')
    ? charger.id.replace('charger-', '')
    : `${index + 1}`

  return (
    <div className="charger-unit">
      <div className="charger-unit-top">
        <div>
          <strong>{charger.type}</strong>
          <span style={{ fontSize: '12px', color: '#8A9EA8', marginLeft: '8px', fontWeight: '500' }}>
            Unit {unitNum}
          </span>
        </div>
        <span className="connector-power">{charger.power}</span>
      </div>
      <div className="port-list">
        {charger.ports.map((port) => (
          <PortBadge key={port.id} port={port} />
        ))}
      </div>
    </div>
  )
}

export default ChargerUnit