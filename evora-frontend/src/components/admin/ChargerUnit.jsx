import PortBadge from './PortBadge'

function ChargerUnit({ charger }) {
  return (
    <div className="charger-unit">
      <div className="charger-unit-top">
        <strong>{charger.type}</strong>
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