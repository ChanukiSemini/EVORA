import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useChats } from '../../context/admin/ChatContext'
import { useCompany } from '../../context/admin/CompanyContext'

function CaseDetail() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const { sessions, resolveSession } = useChats()
  const { company, setChargerStatus } = useCompany()
  const [copied, setCopied] = useState(false)

  const session = sessions.find((s) => s.id === caseId)
  const branch = company.branches.find((b) => b.id === session?.chargerId)
  const charger = branch?.chargers.find((c) => c.id === session?.chargerRef)

  if (!session) {
    return (
      <div className="dashboard-container chat-narrow page-wrapper">
        <div className="dashboard-card">
          <p>Case not found.</p>
          <button className="back-btn" onClick={() => navigate('/admin/chatbot')}>{'<'} Back</button>
        </div>
      </div>
    )
  }

  const chargerHasFault = charger
    ? charger.ports.some((p) => p.status === 'faulty')
    : branch?.chargers.some((c) => c.ports.some((p) => p.status === 'faulty'))

  function handleSetFaulty() {
    if (charger) {
      setChargerStatus(branch.id, charger.id, 'faulty')
    }
  }

  function handleCopyPhone() {
    navigator.clipboard.writeText(session.phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleResolve() {
    resolveSession(session.id)
    navigate('/admin/chatbot')
  }

  function handleFlagBug() {
    resolveSession(session.id)
    alert('Flagged for dev team review. Case marked as handled.')
    navigate('/admin/chatbot')
  }

  return (
    <div className="dashboard-container chat-narrow page-wrapper">
      <div className="dashboard-card">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate('/admin/chatbot')}>{'<'}</button>
          <div>
            <h2>Case Detail</h2>
            {session.escalated && (
              <p style={{ color: '#ff4d6d', fontSize: '12px', fontWeight: 'bold' }}>
                CRITICAL ESCALATION
              </p>
            )}
          </div>
        </div>

        {session.aiSummary ? (
          <>
            <h4 style={{ color: '#22e584', fontSize: '12px', margin: '16px 0 8px' }}>
              🧠 AI PROBLEM SUMMARY
            </h4>
            <div className="ai-summary-box">
              <p>{session.aiSummary}</p>
              <div className="ai-summary-footer">
                <span>Confidence Score: {session.confidenceScore}%</span>
                <span className="fault-tag">{session.faultTag}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h4 style={{ color: '#9ca3af', fontSize: '12px', margin: '16px 0 8px' }}>
              💬 CONVERSATION SUMMARY
            </h4>
            <div className="ai-summary-box" style={{ borderLeftColor: '#3b9eff' }}>
              <p>{session.lastMessage}</p>
              <div className="ai-summary-footer">
                <span>{session.timeAgo}</span>
                <span className="fault-tag">
                  {session.category === 'app_issue' ? 'App Issue' :
                    session.category === 'billing' ? 'Billing' : 'General Inquiry'}
                </span>
              </div>
            </div>
          </>
        )}

        {session.context && (
          <>
            <h4 style={{ color: '#9ca3af', fontSize: '12px', margin: '16px 0 8px' }}>
              📋 CASE CONTEXT
            </h4>
            <div className="context-box">
              {session.category === 'billing' && (
                <>
                  <div className="context-row">
                    <span>Billing Cycle</span>
                    <strong>{session.context.billingCycle}</strong>
                  </div>
                  <div className="context-row">
                    <span>Last Payment</span>
                    <strong>{session.context.lastPayment}</strong>
                  </div>
                  <div className="context-row">
                    <span>Account Status</span>
                    <strong>{session.context.accountStatus}</strong>
                  </div>
                  <p className="context-question">{session.context.question}</p>
                </>
              )}

              {session.category === 'app_issue' && (
                <>
                  <div className="context-row">
                    <span>Error Code</span>
                    <strong style={{ color: '#ff4d6d' }}>{session.context.errorCode}</strong>
                  </div>
                  <div className="context-row">
                    <span>Device</span>
                    <strong>{session.context.device}</strong>
                  </div>
                  <p className="context-question">{session.context.description}</p>
                </>
              )}

              {session.category === 'general' && (
                <>
                  <div className="context-row">
                    <span>Related Station</span>
                    <strong>{session.context.relatedStation}</strong>
                  </div>
                  <p className="context-question">{session.context.question}</p>
                </>
              )}
            </div>
          </>
        )}

        <h4 style={{ color: '#9ca3af', fontSize: '12px', margin: '20px 0 8px' }}>
          CUSTOMER DETAILS
        </h4>
        <div className="customer-card">
          <div className="customer-top">
            <div className="avatar-circle">{session.name.charAt(0)}</div>
            <div>
              <strong>{session.name}</strong>
            </div>
          </div>

          <div className="customer-stats">
            <div className="customer-stat">
              <span className="overview-label">LOYALTY</span>
              <strong>{session.loyaltyTier}</strong>
            </div>
            <div className="customer-stat">
              <span className="overview-label">SESSIONS</span>
              <strong>{session.totalSessions} Total</strong>
            </div>
          </div>

          <div className="phone-copy-row">
            <span>📞 {session.phone}</span>
            <button className="copy-btn" onClick={handleCopyPhone}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {branch && (
          <>
            <h4 style={{ color: '#9ca3af', fontSize: '12px', margin: '20px 0 8px' }}>
              TECHNICAL CONTEXT
            </h4>

            {charger ? (
              <>
                <div className="tech-context-row" style={{ cursor: 'default' }}>
                  <span>
                    ⚡ {branch.name} — {charger.type} ({charger.id.replace('charger-', 'Charger ')})
                  </span>
                  <span className={chargerHasFault ? 'status-badge-fault' : 'status-badge-ok'}>
                    {chargerHasFault ? 'FAULT' : 'OK'}
                  </span>
                </div>

                <button
                  className="action-btn action-btn-red"
                  style={{ marginTop: '10px' }}
                  onClick={handleSetFaulty}
                  disabled={chargerHasFault}
                >
                  {chargerHasFault ? '⚠ Already in Faulty Mode' : '🔧 Set This Charger to Faulty Mode'}
                </button>
              </>
            ) : (
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>
                Branch — {branch.name}
              </p>
            )}
          </>
        )}

        <h4 style={{ color: '#9ca3af', fontSize: '12px', margin: '20px 0 8px' }}>
          CASE ACTIONS
        </h4>

        {session.category === 'app_issue' ? (
          <button className="action-btn action-btn-yellow" onClick={handleFlagBug}>
            🐞 Flag as Bug Report
          </button>
        ) : (
          <button className="action-btn action-btn-green" onClick={handleResolve}>
            ✅ Mark as Resolved
          </button>
        )}
      </div>
    </div>
  )
}

export default CaseDetail