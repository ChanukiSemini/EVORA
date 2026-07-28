import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompany } from '../../context/admin/CompanyContext'

function RegisterHardware() {
  const navigate = useNavigate()
  const { company, addChargersToBranch } = useCompany()

  const [branchId, setBranchId] = useState(company.branches[0]?.id || '')
  const [chargers, setChargers] = useState([
    { id: 1, type: '', power: '', portCount: '' },
  ])
  const [submitted, setSubmitted] = useState(false)

  const selectedBranch = company.branches.find((b) => b.id === branchId)

  function handleChargerChange(id, field, value) {
    setChargers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  function handleAddCharger() {
    const newId = chargers.length > 0 ? Math.max(...chargers.map((c) => c.id)) + 1 : 1
    setChargers((prev) => [...prev, { id: newId, type: '', power: '', portCount: '' }])
  }

  function handleRemoveCharger(id) {
    if (chargers.length === 1) return
    setChargers((prev) => prev.filter((c) => c.id !== id))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const existingChargerCount = selectedBranch?.chargers.length || 0

    const finalChargers = chargers.map((c, index) => {
      const portCount = Number(c.portCount) || 1
      const ports = Array.from({ length: portCount }, (_, i) => ({
        id: `port-${i + 1}`,
        status: 'reserved',
      }))

      return {
        id: `charger-${existingChargerCount + index + 1}`,
        type: c.type,
        power: `${c.power}kW`,
        ports,
      }
    })

    addChargersToBranch(branchId, finalChargers)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="dashboard-container page-wrapper">
        <div className="dashboard-card" style={{ textAlign: 'center' }}>
          <div className="success-icon">✓</div>
          <h3>Charger(s) Registered</h3>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: '10px 0 20px' }}>
            <strong>{chargers.length}</strong> new charger{chargers.length > 1 ? 's' : ''} added to{' '}
            <strong>{company.name} {selectedBranch?.name}</strong>. All ports marked as{' '}
            <strong style={{ color: '#f5c744' }}>Reserved</strong> for initial testing.
          </p>
          <button
            className="manage-btn"
            onClick={() => navigate('/admin/manage-infrastructure')}
          >
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container page-wrapper">
      <div className="dashboard-card">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate('/admin/manage-infrastructure')}>
            {'<'}
          </button>
          <div>
            <h2 style={{ color: '#22e584' }}>Add New Charger</h2>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>Add charger(s) to an existing branch</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label">BRANCH</label>
          <select
            className="search-input"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            required
          >
            {company.branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {company.name} {branch.name}
              </option>
            ))}
          </select>

          <label className="form-label" style={{ marginTop: '20px' }}>NEW CHARGERS</label>

          {chargers.map((charger, index) => (
            <div key={charger.id} className="connector-form-row">
              <div className="connector-form-header">
                <span>Charger {index + 1}</span>
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
                required
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
                  placeholder="Max Power (kW)"
                  value={charger.power}
                  onChange={(e) => handleChargerChange(charger.id, 'power', e.target.value)}
                  required
                />
                <input
                  className="search-input"
                  type="number"
                  min="1"
                  placeholder="No. of Ports"
                  value={charger.portCount}
                  onChange={(e) => handleChargerChange(charger.id, 'portCount', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}

          <button type="button" className="add-connector-btn" onClick={handleAddCharger}>
            ➕ Add Another Charger
          </button>

          <div className="info-note" style={{ marginTop: '16px' }}>
            All new ports will be registered as <strong style={{ color: '#f5c744' }}>Reserved</strong> for initial testing.
          </div>

          <button type="submit" className="manage-btn manage-btn-filled">
            Save Charger(s)
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterHardware