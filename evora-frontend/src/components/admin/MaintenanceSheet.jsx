import { useState } from 'react'
import { useCompany } from '../../context/admin/CompanyContext'
import { getPortOptions } from '../../utils/admin/branchHelpers'

function MaintenanceSheet({ onClose }) {
  const { company, updatePort } = useCompany()
  const [branchId, setBranchId] = useState(company.branches[0]?.id || '')
  const [portKey, setPortKey] = useState('')
  const [step, setStep] = useState('select')

  const selectedBranch = company.branches.find((b) => b.id === branchId)
  const portOptions = selectedBranch ? getPortOptions(selectedBranch) : []
  const selectedOption = portOptions.find((p) => `${p.chargerId}__${p.portId}` === portKey)

  function handleBranchChange(newBranchId) {
    setBranchId(newBranchId)
    setPortKey('')
  }

  function handleToggleMaintenance() {
    if (!selectedOption) return
    const newStatus = selectedOption.status === 'faulty' ? 'available' : 'faulty'
    updatePort(branchId, selectedOption.chargerId, selectedOption.portId, { status: newStatus })
    setStep('success')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {step === 'select' && (
          <>
            <div className="modal-icon modal-icon-warning" style={{ backgroundColor: '#2a2410' }}>🔧</div>
            <h3 style={{ textAlign: 'center' }}>Maintenance Mode</h3>
            <p className="modal-text">
              Select a branch and charger port to toggle its maintenance status.
            </p>

            <label className="form-label">BRANCH</label>
            <select
              className="search-input"
              value={branchId}
              onChange={(e) => handleBranchChange(e.target.value)}
            >
              {company.branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {company.name} {branch.name}
                </option>
              ))}
            </select>

            <label className="form-label">CHARGER PORT</label>
            <select
              className="search-input"
              value={portKey}
              onChange={(e) => setPortKey(e.target.value)}
            >
              <option value="">Select a port</option>
              {portOptions.map((opt) => (
                <option key={`${opt.chargerId}__${opt.portId}`} value={`${opt.chargerId}__${opt.portId}`}>
                  {opt.label} — currently {opt.status}
                </option>
              ))}
            </select>

            <div className="modal-btn-row">
              <button className="modal-btn modal-btn-gray" onClick={onClose}>
                Cancel
              </button>
              <button
                className="modal-btn"
                onClick={handleToggleMaintenance}
                disabled={!portKey}
                style={{
                  backgroundColor: selectedOption?.status === 'faulty' ? '#22e584' : '#f5c744',
                  opacity: portKey ? 1 : 0.5,
                }}
              >
                {selectedOption?.status === 'faulty' ? 'Back to Working' : 'Put in Maintenance'}
              </button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="modal-icon modal-icon-success">✓</div>
            <h3 style={{ textAlign: 'center' }}>Status Updated</h3>
            <p className="modal-text">
              <strong>{selectedOption?.label}</strong> at <strong>{selectedBranch?.name}</strong> has
              been updated successfully.
            </p>
            <button className="modal-btn modal-btn-gray" style={{ width: '100%' }} onClick={onClose}>
              Back to Menu
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default MaintenanceSheet