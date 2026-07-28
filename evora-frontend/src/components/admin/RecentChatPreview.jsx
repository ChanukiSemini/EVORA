import { useNavigate } from 'react-router-dom'

function RecentChatPreview({ session }) {
  const navigate = useNavigate()

  return (
    <div className="chat-preview" onClick={() => navigate(`/admin/case/${session.id}`)}>
      <div className="avatar-circle avatar-small">{session.name.charAt(0)}</div>
      <div className="chat-preview-info">
        <div className="chat-preview-top">
          <strong>{session.name}</strong>
          <span className="chat-time">{session.timeAgo}</span>
        </div>
        <p className="chat-preview-message">{session.lastMessage}</p>
      </div>
      {session.unread && <span className="unread-dot"></span>}
    </div>
  )
}

export default RecentChatPreview