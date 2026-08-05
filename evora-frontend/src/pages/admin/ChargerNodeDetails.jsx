import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCompany } from '../../context/admin/CompanyContext'
import ChargerUnit from '../../components/admin/ChargerUnit'
import BranchModal from '../../components/admin/BranchModal'
import { getBranchAvailability, isBranchOpen } from '../../utils/admin/branchHelpers'

function ChargerNodeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { company, setBranchStatus } = useCompany()
  const [showEditModal, setShowEditModal] = useState(false)

  const branch = company.branches.find((b) => b.id === id)

  if (!branch) {
    return (
      <div className="dashboard-container page-wrapper">
        <div className="dashboard-card">
          <p>Branch not found.</p>
          <button className="back-btn" onClick={() => navigate('/admin')}>{'<'} Back</button>
        </div>
      </div>
    )
  }

  const { availablePorts, totalPorts } = getBranchAvailability(branch)
  const open = isBranchOpen(branch)

  function handleToggleBranch() {
    setBranchStatus(branch.id, open ? 'faulty' : 'available')
  }

  return (
    <div className="dashboard-container page-wrapper">
      <div className="dashboard-card">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate('/admin')}>{'<'}</button>
          <div>
            <h2>{company.name} {branch.name}</h2>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>
              🕐 {branch.openHours} · {availablePorts}/{totalPorts} ports available
            </p>
          </div>
        </div>

        <button
          className={open ? 'action-btn action-btn-red' : 'action-btn action-btn-green'}
          onClick={handleToggleBranch}
          style={{ marginBottom: '16px' }}
        >
          {open ? '🔒 Mark Branch as Closed' : '🔓 Reopen Branch'}
        </button>

        <div style={{
          backgroundColor: '#0d3040',
          border: '1px solid rgba(61, 220, 151, 0.2)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#8A9EA8', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              BRANCH DETAILS
            </span>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#22e584',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ✏️ Edit Details
            </button>
          </div>
          <div style={{ fontSize: '13px', color: '#e5e7eb', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div>📍 <strong>Address:</strong> {branch.address || 'Not specified'}</div>
            <div>🕐 <strong>Operating Hours:</strong> {branch.openHours || '24/7'}</div>
            <div>📞 <strong>Contact Phone:</strong> {branch.phone || 'Not specified'}</div>
          </div>
        </div>

        <h4 style={{ margin: '20px 0 4px', color: '#9ca3af', fontSize: '12px' }}>
          CHARGERS
        </h4>

        {branch.chargers.length > 0 ? (
          branch.chargers.map((charger) => (
            <ChargerUnit key={charger.id} charger={charger} />
          ))
        ) : (
          <div style={{
            backgroundColor: '#0d3040',
            border: '1px border-dashed rgba(61, 220, 151, 0.15)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
            color: '#8A9EA8',
            fontSize: '13px',
            marginTop: '8px',
          }}>
            No chargers configured for this branch yet. You can add chargers using <strong>Manage Infrastructure</strong> in the admin menu.
          </div>
        )}
      </div>

      {showEditModal && (
        <BranchModal
          branchToEdit={branch}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}

export default ChargerNodeDetails