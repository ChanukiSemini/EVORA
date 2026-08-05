import { useState } from 'react'
import { useCompany } from '../../context/admin/CompanyContext'

function BranchModal({ onClose, branchToEdit = null }) {
  const { addBranch, updateBranch } = useCompany()
  const isEditing = Boolean(branchToEdit)

  const [name, setName] = useState(branchToEdit ? branchToEdit.name : '')
  const [openHours, setOpenHours] = useState(branchToEdit ? branchToEdit.openHours || '24/7' : '24/7')
  const [address, setAddress] = useState(branchToEdit ? branchToEdit.address || '' : '')
  const [phone, setPhone] = useState(branchToEdit ? branchToEdit.phone || '' : '')
  const [submitted, setSubmitted] = useState(false)

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
    } else {
      addBranch({
        name: name.trim(),
        openHours: openHours.trim(),
        address: address.trim(),
        phone: phone.trim(),
      })
    }

    setSubmitted(true)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
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
                : 'Enter the branch details below to create a new station location.'}
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
                style={{ marginTop: '4px', marginBottom: '20px' }}
                type="text"
                placeholder="e.g. +94 31 222 3344"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

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
              {!isEditing && ' You can now register hardware chargers to this branch from the Manage Infrastructure menu.'}
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
