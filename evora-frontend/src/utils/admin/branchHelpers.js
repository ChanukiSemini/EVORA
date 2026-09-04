export function getAllPorts(branch) {
  return branch.chargers.flatMap((charger) => charger.ports)
}

export function getBranchStatus(branch) {
  const ports = getAllPorts(branch)
  const hasFault = ports.some((p) => p.status === 'faulty')
  if (hasFault) return 'faulty'

  const allOccupied = ports.every((p) => p.status === 'occupied')
  if (allOccupied) return 'occupied'

  const hasReserved = ports.some((p) => p.status === 'reserved')
  if (hasReserved) return 'reserved'

  return 'available'
}

export function getBranchAvailability(branch) {
  const ports = getAllPorts(branch)
  const availablePorts = ports.filter((p) => p.status === 'available').length
  return { availablePorts, totalPorts: ports.length }
}

export function isBranchOpen(branch) {
  const ports = getAllPorts(branch)
  if (ports.length === 0) return false
  return !ports.every((p) => p.status === 'faulty')
}

export function getPortOptions(branch) {
  const options = []
  branch.chargers.forEach((charger, cIdx) => {
    const powerLabel = charger.power ? ` (${charger.power})` : ''
    const unitNum = charger.id && charger.id.startsWith('charger-')
      ? charger.id.replace('charger-', '')
      : `${cIdx + 1}`

    charger.ports.forEach((port, pIdx) => {
      const portNum = port.id && port.id.startsWith('port-')
        ? port.id.replace('port-', '')
        : `${pIdx + 1}`

      options.push({
        chargerId: charger.id,
        portId: port.id,
        label: `${charger.type}${powerLabel} [Unit ${unitNum}] — Port ${portNum}`,
        status: port.status,
      })
    })
  })
  return options
}

export function getPortStatusBreakdown(branches) {
  const counts = { available: 0, occupied: 0, reserved: 0, faulty: 0 }

  branches.forEach((branch) => {
    getAllPorts(branch).forEach((port) => {
      counts[port.status] = (counts[port.status] || 0) + 1
    })
  })

  const total = counts.available + counts.occupied + counts.reserved + counts.faulty
  return { counts, total }
}

export function getMostCommonChargerType(branches) {
  const typeCounts = {}

  branches.forEach((branch) => {
    branch.chargers.forEach((charger) => {
      typeCounts[charger.type] = (typeCounts[charger.type] || 0) + 1
    })
  })

  let topType = null
  let topCount = 0
  for (const type in typeCounts) {
    if (typeCounts[type] > topCount) {
      topType = type
      topCount = typeCounts[type]
    }
  }

  return { type: topType, count: topCount }
}

export function getCompanyTotals(branches) {
  let totalPorts = 0
  let availablePorts = 0
  let closedBranches = 0

  branches.forEach((branch) => {
    const ports = getAllPorts(branch)
    totalPorts += ports.length
    availablePorts += ports.filter((p) => p.status === 'available').length
    if (!isBranchOpen(branch)) closedBranches += 1
  })

  return { totalPorts, availablePorts, closedBranches, totalBranches: branches.length }
}