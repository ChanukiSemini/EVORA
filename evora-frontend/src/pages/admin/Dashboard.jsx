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
        <div className="dashboard-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ color: '#22e584', fontSize: '22px' }}>{company.name}</h2>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>Station Admin Dashboard</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              className="search-input-small"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="action-btn-green"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                marginBottom: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 'bold',
              }}
              onClick={() => setShowAddBranchModal(true)}
            >
              ➕ Add Branch
            </button>
          </div>
        </div>

        <div className="quick-summary-row">
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

        <div className="legend-cluster" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span><span className="stat-dot" style={{ backgroundColor: '#22e584' }}></span> Open</span>
            <span><span className="stat-dot" style={{ backgroundColor: '#ff4d6d' }}></span> Closed</span>
          </div>
        </div>

        <div className="charger-grid" style={{ marginTop: '16px' }}>
          {filteredBranches.map((branch) => {
            const open = isBranchOpen(branch)
            const { availablePorts, totalPorts } = getBranchAvailability(branch)

            return (
              <div key={branch.id} onClick={() => navigate(`/admin/charger/${branch.id}`)} style={{ cursor: 'pointer' }}>
                <ChargerCard
                  name={`${company.name} ${branch.name}`}
                  location={branch.name}
                  status={open ? 'open' : 'closed'}
                  availablePlugs={availablePorts}
                  totalPlugs={totalPorts}
                />
              </div>
            )
          })}
        </div>
      </div>

      {showAddBranchModal && (
        <BranchModal onClose={() => setShowAddBranchModal(false)} />
      )}
    </div>
  )
}

export default Dashboard