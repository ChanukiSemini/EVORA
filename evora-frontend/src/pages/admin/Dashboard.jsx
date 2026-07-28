import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChargerCard from '../../components/admin/ChargerCard'
import { useCompany } from '../../context/admin/CompanyContext'
import { getBranchAvailability, isBranchOpen, getCompanyTotals } from '../../utils/admin/branchHelpers'


function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { company } = useCompany()

  const filteredBranches = company.branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totals = getCompanyTotals(company.branches)

  return (
    <div className="dashboard-container page-wrapper">
      <div className="dashboard-card">
        <div className="dashboard-top-row">
          <div>
            <h2 style={{ color: '#22e584', fontSize: '22px' }}>{company.name}</h2>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>Station Admin Dashboard</p>
          </div>
          <input
            className="search-input-small"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

        <div className="legend-cluster" style={{ justifyContent: 'flex-start', marginTop: '20px' }}>
          <span><span className="stat-dot" style={{ backgroundColor: '#22e584' }}></span> Open</span>
          <span><span className="stat-dot" style={{ backgroundColor: '#ff4d6d' }}></span> Closed</span>
        </div>

        <div className="charger-grid" style={{ marginTop: '16px' }}>
          {filteredBranches.map((branch) => {
            const open = isBranchOpen(branch)
            const { availablePorts, totalPorts } = getBranchAvailability(branch)

            return (
              <div key={branch.id} onClick={() => navigate(`/admin/charger/${branch.id}`)}>
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
    </div>
  )
}

export default Dashboard