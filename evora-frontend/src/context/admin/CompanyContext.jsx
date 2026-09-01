import { createContext, useState, useContext } from 'react'
import { company as initialCompany } from '../../data/admin/companyData'

const CompanyContext = createContext()

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState(initialCompany)

  function updatePort(branchId, chargerId, portId, updates) {
    setCompany((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) =>
        branch.id === branchId
          ? {
            ...branch,
            chargers: branch.chargers.map((charger) =>
              charger.id === chargerId
                ? {
                  ...charger,
                  ports: charger.ports.map((port) =>
                    port.id === portId ? { ...port, ...updates } : port
                  ),
                }
                : charger
            ),
          }
          : branch
      ),
    }))
  }

  function removePort(branchId, chargerId, portId) {
    setCompany((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) => {
        if (branch.id !== branchId) return branch
        return {
          ...branch,
          chargers: branch.chargers
            .map((charger) =>
              charger.id === chargerId
                ? { ...charger, ports: charger.ports.filter((p) => p.id !== portId) }
                : charger
            )
            .filter((charger) => charger.ports.length > 0),
        }
      }),
    }))
  }

  function addChargersToBranch(branchId, newChargers) {
    setCompany((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) =>
        branch.id === branchId
          ? { ...branch, chargers: [...branch.chargers, ...newChargers] }
          : branch
      ),
    }))
  }

  function setChargerStatus(branchId, chargerId, status) {
    setCompany((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) =>
        branch.id === branchId
          ? {
            ...branch,
            chargers: branch.chargers.map((charger) =>
              charger.id === chargerId
                ? { ...charger, ports: charger.ports.map((port) => ({ ...port, status })) }
                : charger
            ),
          }
          : branch
      ),
    }))
  }

  function setBranchStatus(branchId, status) {
    setCompany((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) =>
        branch.id === branchId
          ? {
            ...branch,
            chargers: branch.chargers.map((charger) => ({
              ...charger,
              ports: charger.ports.map((port) => ({ ...port, status })),
            })),
          }
          : branch
      ),
    }))
  }

  function addBranch(newBranchData) {
    const slug = newBranchData.name.toLowerCase().trim().replace(/\s+/g, '-')
    const formattedChargers = (newBranchData.chargers || []).map((c, index) => {
      if (c.ports) return c
      const portCount = Number(c.portCount) || 1
      const ports = Array.from({ length: portCount }, (_, i) => ({
        id: `port-${i + 1}`,
        status: c.status || 'available',
      }))
      return {
        id: `charger-${index + 1}`,
        type: c.type || 'CCS2',
        power: c.power ? (c.power.toString().endsWith('kW') ? c.power : `${c.power}kW`) : '50kW',
        ports,
      }
    })

    const newBranch = {
      id: `branch-${slug}-${Date.now()}`,
      name: newBranchData.name,
      openHours: newBranchData.openHours || '24/7',
      address: newBranchData.address || '',
      phone: newBranchData.phone || '',
      chargers: formattedChargers,
    }
    setCompany((prev) => ({
      ...prev,
      branches: [...prev.branches, newBranch],
    }))
  }

  function updateBranch(branchId, updatedData) {
    setCompany((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) =>
        branch.id === branchId ? { ...branch, ...updatedData } : branch
      ),
    }))
  }

  return (
    <CompanyContext.Provider
      value={{
        company,
        updatePort,
        removePort,
        addChargersToBranch,
        setChargerStatus,
        setBranchStatus,
        addBranch,
        updateBranch,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  return useContext(CompanyContext)
}