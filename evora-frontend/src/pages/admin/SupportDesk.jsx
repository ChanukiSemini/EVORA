import EscalationCard from '../../components/admin/EscalationCard'
import RecentChatPreview from '../../components/admin/RecentChatPreview'
import { useChats } from '../../context/admin/ChatContext'

function SupportDesk() {
  const { sessions } = useChats()

  const escalations = sessions.filter((s) => s.escalated && !s.resolved)
  const recentChats = sessions.filter((s) => !s.escalated && !s.resolved)

  return (
    <div className="dashboard-container chat-narrow page-wrapper">
      <div className="dashboard-card">
        <div className="detail-header">
          <div>
            <h2>Support Desk</h2>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>EVORA Admin Console</p>
          </div>
        </div>

        {escalations.length > 0 && (
          <>
            <h4 style={{ color: '#ff4d6d', fontSize: '12px', margin: '10px 0' }}>
              PRIORITY ESCALATIONS
            </h4>
            {escalations.map((session) => (
              <EscalationCard key={session.id} session={session} />
            ))}
          </>
        )}

        <div className="section-header-row">
          <h4 style={{ color: '#9ca3af', fontSize: '12px' }}>RECENT CHATS</h4>
          <span style={{ color: '#22e584', fontSize: '12px', cursor: 'pointer' }}>View All</span>
        </div>

        {recentChats.length === 0 && (
          <p style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
            No pending chats — all caught up! 🎉
          </p>
        )}

        {recentChats.map((session) => (
          <RecentChatPreview key={session.id} session={session} />
        ))}
      </div>
    </div>
  )
}

export default SupportDesk