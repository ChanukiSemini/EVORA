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

  return (
    <CompanyContext.Provider
      value={{ company, updatePort, removePort, addChargersToBranch, setChargerStatus, setBranchStatus }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  return useContext(CompanyContext)
}