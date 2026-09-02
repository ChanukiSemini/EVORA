import { createContext, useState, useEffect, useContext } from 'react'
import { company as initialCompany } from '../../data/admin/companyData'

const API_BASE_URL = 'http://localhost:5000/api/admin'
const CompanyContext = createContext()

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState(initialCompany)

  // Helper to normalize DB format to Frontend state format
  const formatBranchFromDB = (b) => ({
    id: b.branchId || b._id,
    name: b.name,
    openHours: b.openHours || '24/7',
    address: b.address || '',
    phone: b.phone || '',
    status: b.status || 'online',
    chargers: (b.chargers || []).map((c) => ({
      id: c.chargerId || c._id,
      type: c.type || 'CCS2',
      power: c.power || '50kW',
      ports: (c.ports || []).map((p) => ({
        id: p.portId || p._id,
        status: p.status || 'available',
      })),
    })),
  })

  // Fetch branches from backend on load
  useEffect(() => {
    async function fetchBranches() {
      try {
        const response = await fetch(`${API_BASE_URL}/branches`)
        if (response.ok) {
          const dbBranches = await response.json()
          if (Array.isArray(dbBranches) && dbBranches.length > 0) {
            const formatted = dbBranches.map(formatBranchFromDB)
            setCompany((prev) => ({ ...prev, branches: formatted }))
          }
        }
      } catch (err) {
        console.warn('Backend API offline or unreachable, using local fallback state:', err.message)
      }
    }
    fetchBranches()
  }, [])

  async function updatePort(branchId, chargerId, portId, updates) {
    // Optimistic UI update
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

    // Sync with backend API
    try {
      if (updates.status) {
        await fetch(`${API_BASE_URL}/branches/${branchId}/chargers/${chargerId}/ports/${portId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: updates.status }),
        })
      }
    } catch (err) {
      console.error('Failed to sync port update with backend:', err.message)
    }
  }

  async function removePort(branchId, chargerId, portId) {
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

    try {
      await fetch(`${API_BASE_URL}/branches/${branchId}/chargers/${chargerId}/ports/${portId}`, {
        method: 'DELETE',
      })
    } catch (err) {
      console.error('Failed to remove port on backend:', err.message)
    }
  }

  async function addChargersToBranch(branchId, newChargers) {
    setCompany((prev) => ({
      ...prev,
      branches: prev.branches.map((branch) =>
        branch.id === branchId
          ? { ...branch, chargers: [...branch.chargers, ...newChargers] }
          : branch
      ),
    }))

    try {
      const formattedForDB = newChargers.map((c) => ({
        chargerId: c.id,
        type: c.type,
        power: c.power,
        ports: (c.ports || []).map((p) => ({
          portId: p.id,
          status: p.status || 'available',
        })),
      }))

      await fetch(`${API_BASE_URL}/branches/${branchId}/chargers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chargers: formattedForDB }),
      })
    } catch (err) {
      console.error('Failed to sync new hardware with backend:', err.message)
    }
  }

  function setChargerStatus(branchId, chargerId, status) {
    updatePort(branchId, chargerId, 'port-1', { status })
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

  async function addBranch(newBranchData) {
    const slug = newBranchData.name.toLowerCase().trim().replace(/\s+/g, '-')
    const branchId = `branch-${slug}-${Date.now()}`

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
      id: branchId,
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

    try {
      const dbPayload = {
        branchId,
        name: newBranchData.name,
        openHours: newBranchData.openHours || '24/7',
        address: newBranchData.address || '',
        phone: newBranchData.phone || '',
        chargers: formattedChargers.map((c) => ({
          chargerId: c.id,
          type: c.type,
          power: c.power,
          ports: c.ports.map((p) => ({ portId: p.id, status: p.status })),
        })),
      }

      await fetch(`${API_BASE_URL}/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbPayload),
      })
    } catch (err) {
      console.error('Failed to create branch on backend:', err.message)
    }
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