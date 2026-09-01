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
        <div className="dashboard-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '26px' }}>{company.name} Admin Dashboard</h2>
            <p style={{ color: '#8A9EA8', fontSize: '13px', marginTop: '2px' }}>Station branch network overview</p>
          </div>
          <div>
            <input
              className="search-input-small"
              type="text"
              placeholder="Search branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ margin: 0, padding: '10px 16px', width: '240px', borderRadius: '10px', backgroundColor: 'var(--bg-elevated, #0d3040)', border: '1px solid var(--border-accent-low, rgba(61, 220, 151, 0.25))', color: '#ffffff' }}
            />
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="quick-summary-row" style={{ marginBottom: '28px' }}>
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

        {/* Branch Section Header & Status Legend */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', fontSize: '12px', color: '#8A9EA8', marginBottom: '22px' }}>
            <span><span style={{ backgroundColor: '#22e584', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '6px' }}></span> Open</span>
            <span><span style={{ backgroundColor: '#ff4d6d', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '6px' }}></span> Closed</span>
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '18px' }}>Station Branches</h3>
        </div>

        {/* Stations Grid */}
        <div className="charger-grid" style={{ marginBottom: '20px' }}>
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

        {/* Centered Dashed Add New Branch Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <div
            onClick={() => setShowAddBranchModal(true)}
            style={{
              backgroundColor: 'rgba(61, 220, 151, 0.05)',
              border: '1.5px dashed rgba(61, 220, 151, 0.35)',
              borderRadius: '12px',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              maxWidth: '320px',
              width: '100%',
              textAlign: 'center',
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
          >
            <span style={{ fontSize: '18px' }}>➕</span>
            <div>
              <strong style={{ fontSize: '13px', color: '#22e584', display: 'block' }}>Add New Branch</strong>
              <span style={{ fontSize: '11px', color: '#8A9EA8' }}>Configure new station node</span>
            </div>
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