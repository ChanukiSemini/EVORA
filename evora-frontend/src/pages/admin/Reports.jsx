import { useState, useEffect } from 'react'
import DonutChart from '../../components/admin/DonutChart'
import { useCompany } from '../../context/admin/CompanyContext'
import { useChats } from '../../context/admin/ChatContext'
import { bookingsByPeriod as defaultBookingsByPeriod } from '../../data/admin/reportsData'
import { getPortStatusBreakdown, getMostCommonChargerType, isBranchOpen } from '../../utils/admin/branchHelpers'

const API_BASE_URL = 'http://localhost:5000/api/admin'

function Reports() {
  const [period, setPeriod] = useState('Monthly')
  const [liveBookings, setLiveBookings] = useState(defaultBookingsByPeriod)
  const { company } = useCompany()
  const { sessions } = useChats()

  useEffect(() => {
    async function fetchReports() {
      try {
        const token = localStorage.getItem('evora_token')
        const response = await fetch(`${API_BASE_URL}/reports`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (response.ok) {
          const data = await response.json()
          if (data.bookingsByPeriod) {
            setLiveBookings(data.bookingsByPeriod)
          }
        }
      } catch (err) {
        console.warn('Could not fetch live reports, using baseline data:', err.message)
      }
    }
    fetchReports()
  }, [])

  const bookingData = liveBookings[period] || defaultBookingsByPeriod[period] || { totalBookings: 0, cancelledBookings: 0 }
  const { counts, total } = getPortStatusBreakdown(company.branches)
  const mostCommon = getMostCommonChargerType(company.branches)

  const donutSegments = [
    { key: 'available', color: '#22e584', percent: total ? Math.round((counts.available / total) * 100) : 0 },
    { key: 'occupied', color: '#3b9eff', percent: total ? Math.round((counts.occupied / total) * 100) : 0 },
    { key: 'reserved', color: '#f5c744', percent: total ? Math.round((counts.reserved / total) * 100) : 0 },
    { key: 'faulty', color: '#ff4d6d', percent: total ? Math.round((counts.faulty / total) * 100) : 0 },
  ]

  const closedBranches = company.branches.filter((branch) => !isBranchOpen(branch)).length

  const casesResolved = sessions.filter((s) => s.resolved).length
  const activeEscalations = sessions.filter((s) => s.escalated && !s.resolved).length

  return (
    <div className="dashboard-container page-wrapper">
      <div className="dashboard-card">
        <h2 style={{ marginBottom: '16px' }}>Network Reports & Analytics</h2>

        <div className="performance-card">
          <div className="performance-card-top">
            <div className="legend-list">
              <div className="legend-item">
                <span className="stat-dot" style={{ backgroundColor: '#22e584' }}></span>
                <span>Available</span>
                <strong>{counts.available}</strong>
              </div>
              <div className="legend-item">
                <span className="stat-dot" style={{ backgroundColor: '#3b9eff' }}></span>
                <span>Occupied</span>
                <strong>{counts.occupied}</strong>
              </div>
              <div className="legend-item">
                <span className="stat-dot" style={{ backgroundColor: '#f5c744' }}></span>
                <span>Reserved</span>
                <strong>{counts.reserved}</strong>
              </div>
              <div className="legend-item">
                <span className="stat-dot" style={{ backgroundColor: '#ff4d6d' }}></span>
                <span>Faulty</span>
                <strong>{counts.faulty}</strong>
              </div>
            </div>

            <select
              className="period-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div className="donut-center-wrap">
            <DonutChart segments={donutSegments} centerLabel={`${total} Ports`} large />
          </div>
        </div>

        <div className="report-sections-grid">
          <div className="report-section-card">
            <h4>BOOKINGS ({period.toUpperCase()})</h4>
            <div className="report-section-stats">
              <div className="overview-stat">
                <span className="overview-label">TOTAL</span>
                <strong style={{ fontSize: '22px' }}>{bookingData.totalBookings}</strong>
              </div>
              <div className="overview-stat">
                <span className="overview-label">CANCELLED</span>
                <strong style={{ fontSize: '22px', color: '#ff4d6d' }}>{bookingData.cancelledBookings}</strong>
              </div>
            </div>
            {bookingData.totalRevenue !== undefined && (
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', color: '#8A9EA8', display: 'flex', justifyContent: 'space-between' }}>
                <span>Est. Revenue</span>
                <strong style={{ color: '#22e584' }}>LKR {Number(bookingData.totalRevenue).toLocaleString()}</strong>
              </div>
            )}
          </div>

          <div className="report-section-card">
            <h4>NETWORK HEALTH</h4>
            <div className="report-section-stats">
              <div className="overview-stat">
                <span className="overview-label">BRANCHES</span>
                <strong style={{ fontSize: '22px' }}>{company.branches.length}</strong>
              </div>
              <div className="overview-stat">
                <span className="overview-label">CLOSED</span>
                <strong style={{ fontSize: '22px', color: closedBranches > 0 ? '#ff4d6d' : '#22e584' }}>
                  {closedBranches}
                </strong>
              </div>
            </div>
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', color: '#8A9EA8', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Hardware Ports</span>
              <strong style={{ color: '#e5e7eb' }}>{total} Ports</strong>
            </div>
          </div>

          <div className="report-section-card">
            <h4>HELP DESK</h4>
            <div className="report-section-stats">
              <div className="overview-stat">
                <span className="overview-label">RESOLVED</span>
                <strong style={{ fontSize: '22px', color: '#22e584' }}>{casesResolved}</strong>
              </div>
              <div className="overview-stat">
                <span className="overview-label">ESCALATIONS</span>
                <strong style={{ fontSize: '22px', color: activeEscalations > 0 ? '#ff4d6d' : '#22e584' }}>
                  {activeEscalations}
                </strong>
              </div>
            </div>
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', color: '#8A9EA8', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Cases Logged</span>
              <strong style={{ color: '#e5e7eb' }}>{sessions.length}</strong>
            </div>
          </div>
        </div>

        {mostCommon.type && (
          <div className="info-note" style={{ marginTop: '20px' }}>
            Most common connector type: <strong style={{ color: '#22e584' }}>{mostCommon.type}</strong> ({mostCommon.count} units across network)
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports