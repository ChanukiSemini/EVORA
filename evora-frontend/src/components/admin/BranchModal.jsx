import { useState } from 'react'
import { useCompany } from '../../context/admin/CompanyContext'

function BranchModal({ onClose, branchToEdit = null }) {
  const { addBranch, updateBranch } = useCompany()
  const isEditing = Boolean(branchToEdit)

  const [name, setName] = useState(branchToEdit ? branchToEdit.name : '')
  const [openHours, setOpenHours] = useState(branchToEdit ? branchToEdit.openHours || '24/7' : '24/7')
  const [address, setAddress] = useState(branchToEdit ? branchToEdit.address || '' : '')
  const [phone, setPhone] = useState(branchToEdit ? branchToEdit.phone || '' : '')

  // State for chargers when creating a new branch
  const [chargers, setChargers] = useState([
    { id: 1, type: 'CCS2', power: '50', portCount: '2' },
  ])
  const [submittedCount, setSubmittedCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  function handleChargerChange(id, field, value) {
    setChargers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  function handleAddCharger() {
    const newId = chargers.length > 0 ? Math.max(...chargers.map((c) => c.id)) + 1 : 1
    setChargers((prev) => [...prev, { id: newId, type: 'CCS2', power: '50', portCount: '2' }])
  }

  function handleRemoveCharger(id) {
    if (chargers.length === 1) return
    setChargers((prev) => prev.filter((c) => c.id !== id))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim()) return

    if (isEditing) {
      updateBranch(branchToEdit.id, {
        name: name.trim(),
        openHours: openHours.trim(),
        address: address.trim(),
        phone: phone.trim(),
      })
      setSubmittedCount(0)
    } else {
      const validChargers = chargers.filter(c => c.type && c.power && c.portCount)

      addBranch({
        name: name.trim(),
        openHours: openHours.trim(),
        address: address.trim(),
        phone: phone.trim(),
        chargers: validChargers,
      })
      setSubmittedCount(validChargers.length)
    }

    setSubmitted(true)
  }

  const isWide = !isEditing

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-box ${isWide ? 'modal-box-wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <>
            <div className="modal-icon" style={{ backgroundColor: 'rgba(61, 220, 151, 0.15)', color: '#22e584' }}>
              {isEditing ? '✏️' : '📍'}
            </div>
            <h3 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '6px' }}>
              {isEditing ? 'Edit Branch Details' : 'Add New Branch'}
            </h3>
            <p className="modal-text" style={{ marginBottom: '16px' }}>
              {isEditing
                ? 'Update operating details and location info for this branch.'
                : 'Enter branch info and add chargers for this location.'}
            </p>

            <form onSubmit={handleSubmit}>
              <label className="form-label">BRANCH NAME</label>
              <input
                className="search-input"
                style={{ marginTop: '4px', marginBottom: '12px' }}
                type="text"
                placeholder="e.g. Negombo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label className="form-label">OPERATING HOURS</label>
              <input
                className="search-input"
                style={{ marginTop: '4px', marginBottom: '12px' }}
                type="text"
                placeholder="e.g. 24/7 or 6 AM - 11 PM"
                value={openHours}
                onChange={(e) => setOpenHours(e.target.value)}
                required
              />

              <label className="form-label">LOCATION / ADDRESS</label>
              <input
                className="search-input"
                style={{ marginTop: '4px', marginBottom: '12px' }}
                type="text"
                placeholder="e.g. 12 Beach Road, Negombo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <label className="form-label">CONTACT PHONE</label>
              <input
                className="search-input"
                style={{ marginTop: '4px', marginBottom: '16px' }}
                type="text"
                placeholder="e.g. +94 31 222 3344"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {!isEditing && (
                <div style={{ marginTop: '8px', marginBottom: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                    CHARGERS
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {chargers.map((charger, index) => (
                      <div key={charger.id} className="connector-form-row">
                        <div className="connector-form-header">
                          <span style={{ fontWeight: 'bold', color: '#22e584' }}>Charger {index + 1}</span>
                          {chargers.length > 1 && (
                            <button
                              type="button"
                              className="remove-connector-btn"
                              onClick={() => handleRemoveCharger(charger.id)}
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>

                        <select
                          className="search-input"
                          value={charger.type}
                          onChange={(e) => handleChargerChange(charger.id, 'type', e.target.value)}
                        >
                          <option value="">Select Connector Type</option>
                          <option value="CCS2">CCS2</option>
                          <option value="CHAdeMO">CHAdeMO</option>
                          <option value="Type2">Type 2</option>
                          <option value="Tesla NACS">Tesla NACS</option>
                        </select>

                        <div className="connector-form-grid">
                          <input
                            className="search-input"
                            type="number"
                            placeholder="Power (kW)"
                            value={charger.power}
                            onChange={(e) => handleChargerChange(charger.id, 'power', e.target.value)}
                          />
                          <input
                            className="search-input"
                            type="number"
                            min="1"
                            placeholder="No. of Ports"
                            value={charger.portCount}
                            onChange={(e) => handleChargerChange(charger.id, 'portCount', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}

                    <button type="button" className="add-connector-btn" onClick={handleAddCharger}>
                      ➕ Add Another Charger
                    </button>
                  </div>
                </div>
              )}

              <div className="modal-btn-row">
                <button type="button" className="modal-btn modal-btn-gray" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn" style={{ backgroundColor: '#22e584', color: '#031C26', fontWeight: 'bold' }}>
                  {isEditing ? 'Save Changes' : 'Create Branch'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="modal-icon modal-icon-success">✓</div>
            <h3 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '8px' }}>
              {isEditing ? 'Branch Details Updated' : 'Branch Created Successfully'}
            </h3>
            <p className="modal-text" style={{ marginBottom: '20px' }}>
              <strong>{name}</strong> branch has been {isEditing ? 'updated' : 'added to your network'}.
              {!isEditing && (
                submittedCount > 0
                  ? ` Registered with ${submittedCount} charger${submittedCount > 1 ? 's' : ''}.`
                  : ' You can register hardware chargers to this branch anytime from Manage Infrastructure.'
              )}
            </p>
            <button className="modal-btn modal-btn-gray" style={{ width: '100%' }} onClick={onClose}>
              Done
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default BranchModal
