import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionCard from '../../components/admin/ActionCard'
import RemoveNodeModal from '../../components/admin/RemoveNodeModal'
import MaintenanceSheet from '../../components/admin/MaintenanceSheet'
import { useCompany } from '../../context/admin/CompanyContext'
import { isBranchOpen } from '../../utils/admin/branchHelpers'

function ManageInfrastructure() {
  const navigate = useNavigate()
  const { company } = useCompany()
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)

  const closedBranches = company.branches.filter((branch) => !isBranchOpen(branch)).length

  return (
    <div className="dashboard-container page-wrapper">
      <div className="dashboard-card">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate('/admin')}>{'<'}</button>
          <div>
            <h2 style={{ color: '#22e584' }}>MANAGE CHARGERS</h2>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>{company.name} · Logged in as Admin Pamod</p>
          </div>
        </div>

        <ActionCard
          icon="➕"
          title="Add New Charger"
          description="Add a new charger to an existing branch"
          color="#22e584"
          onClick={() => navigate('/admin/register-hardware')}
        />
        <ActionCard
          icon="🗑️"
          title="Remove Charger"
          description="Decommission a specific charger port"
          color="#ff4d6d"
          onClick={() => setShowRemoveModal(true)}
        />
        <ActionCard
          icon="🔧"
          title="Maintenance Mode"
          description="Temporarily disable a specific charger port"
          color="#f5c744"
          onClick={() => setShowMaintenanceModal(true)}
        />

        <h4 style={{ margin: '24px 0 10px', color: '#9ca3af', fontSize: '12px' }}>
          INFRASTRUCTURE OVERVIEW
        </h4>

        <div className="overview-grid">
          <div className="overview-stat">
            <span className="overview-label">TOTAL BRANCHES</span>
            <strong>{company.branches.length}</strong>
            <small>Across {company.name}</small>
          </div>
          <div className="overview-stat">
            <span className="overview-label">CLOSED BRANCHES</span>
            <strong style={{ color: closedBranches > 0 ? '#ff4d6d' : '#22e584' }}>
              {closedBranches}
            </strong>
            <small>Requires Attention</small>
          </div>
        </div>
      </div>

      {showRemoveModal && (
        <RemoveNodeModal onClose={() => setShowRemoveModal(false)} />
      )}

      {showMaintenanceModal && (
        <MaintenanceSheet onClose={() => setShowMaintenanceModal(false)} />
      )}
    </div>
  )
}

export default ManageInfrastructure