import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionCard from '../../components/admin/ActionCard'
import RemoveNodeModal from '../../components/admin/RemoveNodeModal'
import MaintenanceSheet from '../../components/admin/MaintenanceSheet'
import { useCompany } from '../../context/admin/CompanyContext'

function ManageInfrastructure() {
  const navigate = useNavigate()
  const { company } = useCompany()
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)

  return (
    <div className="dashboard-container page-wrapper">
      <div className="dashboard-card">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate('/admin')}>{'<'}</button>
          <div>
            <h2 style={{ color: '#22e584', fontSize: '24px', margin: 0, fontWeight: 'bold' }}>MANAGE CHARGERS </h2>
            <p style={{ color: '#8A9EA8', fontSize: '13px', marginTop: '4px', margin: 0 }}>
              {company.name} - Logged in as Admin Pamod
            </p>
          </div>
        </div>

        <div style={{ padding: '24px 0 8px' }}>
          <div className="action-cards-grid" style={{ width: '100%', margin: 0 }}>
            <ActionCard
              icon="➕"
              title="Add New Charger"
              description="Add a new charger to an existing branch."
              color="#22e584"
              onClick={() => navigate('/admin/register-hardware')}
            />
            <ActionCard
              icon="🗑️"
              title="Remove Charger"
              description="Decommission a specific charger port."
              color="#ff4d6d"
              onClick={() => setShowRemoveModal(true)}
            />
            <ActionCard
              icon="🔧"
              title="Maintenance Mode"
              description="Temporarily disable a specific charger port."
              color="#f5c744"
              onClick={() => setShowMaintenanceModal(true)}
            />
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