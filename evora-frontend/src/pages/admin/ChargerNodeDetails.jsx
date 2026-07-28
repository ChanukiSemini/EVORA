import { useParams, useNavigate } from 'react-router-dom'
import { useCompany } from '../../context/admin/CompanyContext'
import ChargerUnit from '../../components/admin/ChargerUnit'
import { getBranchAvailability, isBranchOpen } from '../../utils/admin/branchHelpers'

function ChargerNodeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { company, setBranchStatus } = useCompany()

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
        >
          {open ? '🔒 Mark Branch as Closed' : '🔓 Reopen Branch'}
        </button>

        <h4 style={{ margin: '20px 0 4px', color: '#9ca3af', fontSize: '12px' }}>
          CHARGERS
        </h4>

        {branch.chargers.map((charger) => (
          <ChargerUnit key={charger.id} charger={charger} />
        ))}
      </div>
    </div>
  )
}

export default ChargerNodeDetails