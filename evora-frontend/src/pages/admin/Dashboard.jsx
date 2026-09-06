import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChargerCard from '../../components/admin/ChargerCard'
import BranchModal from '../../components/admin/BranchModal'
import { useCompany } from '../../context/admin/CompanyContext'
import { getBranchAvailability, isBranchOpen, getCompanyTotals } from '../../utils/admin/branchHelpers'

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddBranchModal, setShowAddBranchModal] = useState(false)
  const navigate = useNavigate()
  const { company } = useCompany()

  const filteredBranches = company.branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totals = getCompanyTotals(company.branches)

  return (
    <div className="dashboard-container page-wrapper">
      <div className="dashboard-card">
        {/* Top Header Row */}
        <div className="dashboard-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '26px', margin: 0 }}>{company.name} Admin Dashboard</h2>
            <p style={{ color: '#8A9EA8', fontSize: '13px', marginTop: '4px', margin: 0 }}>Station branch network overview</p>
          </div>

          {/* Search bar + Add New Branch Button placed in Top Right Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <input
              className="search-input-small"
              type="text"
              placeholder="Search branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ margin: 0, padding: '10px 16px', width: '220px', borderRadius: '10px', backgroundColor: 'var(--bg-elevated, #0d3040)', border: '1px solid var(--border-accent-low, rgba(61, 220, 151, 0.25))', color: '#ffffff' }}
            />

            <button
              onClick={() => setShowAddBranchModal(true)}
              style={{
                backgroundColor: '#3DDC97',
                color: '#031C26',
                fontWeight: 'bold',
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(61, 220, 151, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '14px' }}>➕</span> Add New Branch
            </button>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="quick-summary-row" style={{ marginBottom: '36px' }}>
          <div className="quick-summary-item">
            <span className="overview-label">BRANCHES</span>
            <strong>{totals.totalBranches}</strong>
          </div>
          <div className="quick-summary-item">
            <span className="overview-label">TOTAL PORTS</span>
            <strong>{totals.totalPorts}</strong>
          </div>
          <div className="quick-summary-item">
            <span className="overview-label">AVAILABLE</span>
            <strong style={{ color: '#22e584' }}>{totals.availablePorts}</strong>
          </div>
          <div className="quick-summary-item">
            <span className="overview-label">CLOSED</span>
            <strong style={{ color: totals.closedBranches > 0 ? '#ff4d6d' : '#22e584' }}>
              {totals.closedBranches}
            </strong>
          </div>
        </div>

        {/* Legend stays up near KPI summary row */}
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', fontSize: '12px', color: '#8A9EA8', marginTop: '16px', marginBottom: '36px' }}>
          <span><span style={{ backgroundColor: '#22e584', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '6px' }}></span> Open</span>
          <span><span style={{ backgroundColor: '#ff4d6d', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '6px' }}></span> Closed</span>
        </div>

        {/* Station Branches Title & Grid pushed lower down */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#ffffff', fontSize: '20px', margin: '0 0 18px' }}>Station Branches</h3>

          {/* Stations Grid */}
          <div className="charger-grid">
            {filteredBranches.map((branch) => {
              const open = isBranchOpen(branch)
              const { availablePorts, totalPorts } = getBranchAvailability(branch)

              return (
                <div key={branch.id} onClick={() => navigate(`/admin/charger/${branch.id}`)} style={{ cursor: 'pointer' }}>
                  <ChargerCard
                    name={`${company.name} ${branch.name}`}
                    location={branch.address || branch.name}
                    status={open ? 'open' : 'closed'}
                    availablePlugs={availablePorts}
                    totalPlugs={totalPorts}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showAddBranchModal && (
        <BranchModal onClose={() => setShowAddBranchModal(false)} />
      )}
    </div>
  )
}

export default Dashboard