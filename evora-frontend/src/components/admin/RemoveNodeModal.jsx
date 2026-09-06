import { useState } from 'react'
import { useCompany } from '../../context/admin/CompanyContext'
import { getPortOptions } from '../../utils/admin/branchHelpers'

function RemoveNodeModal({ onClose }) {
  const { company, removePort } = useCompany()
  const [branchId, setBranchId] = useState(company.branches[0]?.id || '')
  const [portKey, setPortKey] = useState('')
  const [step, setStep] = useState('confirm')

  const selectedBranch = company.branches.find((b) => b.id === branchId)
  const portOptions = selectedBranch ? getPortOptions(selectedBranch) : []
  const selectedOption = portOptions.find((p) => `${p.chargerId}__${p.portId}` === portKey)

  function handleBranchChange(newBranchId) {
    setBranchId(newBranchId)
    setPortKey('')
  }

  function handleConfirm() {
    if (!selectedOption) return
    removePort(branchId, selectedOption.chargerId, selectedOption.portId)
    setStep('success')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {step === 'confirm' && (
          <>
            <div className="modal-icon modal-icon-warning">⚠️</div>
            <h3 style={{ textAlign: 'center' }}>Remove Charger Port?</h3>
            <p className="modal-text">
              This action is permanent and will wipe session history for that port.
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
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="modal-btn-row">
              <button className="modal-btn modal-btn-gray" onClick={onClose}>
                Cancel
              </button>
              <button
                className="modal-btn modal-btn-red"
                onClick={handleConfirm}
                disabled={!portKey}
                style={{ opacity: portKey ? 1 : 0.5 }}
              >
                Yes, Decommission
              </button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="modal-icon modal-icon-success">✓</div>
            <h3 style={{ textAlign: 'center' }}>Port Decommissioned</h3>
            <p className="modal-text">
              <strong>{selectedOption?.label}</strong> at <strong>{selectedBranch?.name}</strong> has
              been successfully removed. The branch remains active.
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

export default RemoveNodeModal