import { createContext, useState, useEffect, useContext } from 'react'
import { chatSessions as initialSessions } from '../../data/admin/chatSessions'

const API_BASE_URL = 'http://localhost:5000/api/admin'
const ChatContext = createContext()

const getAuthHeaders = () => {
  const token = localStorage.getItem('evora_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export function ChatProvider({ children }) {
  const [sessions, setSessions] = useState(initialSessions)

  const normalizeCaseFromDB = (c) => ({
    id: c.caseId || c._id,
    caseId: c.caseId || c._id,
    name: c.userName || c.name || 'EV Driver',
    phone: c.phone || '+94771234567',
    chargerId: c.branchId || c.chargerId || 'branch-kandy',
    chargerRef: c.chargerId || 'charger-1',
    lastMessage: (c.messages && c.messages.length > 0)
      ? c.messages[c.messages.length - 1].text
      : (c.issue || 'Customer assistance requested'),
    escalated: c.priority === 'critical' || c.priority === 'high' || Boolean(c.escalated),
    priority: c.priority || 'medium',
    category: c.category || (c.issue?.toLowerCase().includes('cable') || c.issue?.toLowerCase().includes('jam') ? 'hardware' : 'general'),
    unread: c.unread !== undefined ? c.unread : true,
    timeAgo: c.timeAgo || 'Recently',
    loyaltyTier: c.loyaltyTier || 'Member',
    totalSessions: c.totalSessions || 12,
    aiSummary: c.aiSummary || (c.issue ? `Driver reported: "${c.issue}". Suggested action: Verify branch charger connectivity.` : null),
    confidenceScore: c.confidenceScore || 95,
    faultTag: c.faultTag || (c.priority === 'critical' ? 'Hardware Fault' : 'Inquiry'),
    resolved: c.status === 'resolved' || Boolean(c.resolved),
    context: c.context || null,
  })

  // Fetch support cases from backend
  useEffect(() => {
    async function fetchCases() {
      try {
        const response = await fetch(`${API_BASE_URL}/cases`, {
          headers: getAuthHeaders(),
        })
        if (response.ok) {
          const dbCases = await response.json()
          if (Array.isArray(dbCases) && dbCases.length > 0) {
            const formatted = dbCases.map(normalizeCaseFromDB)
            setSessions(formatted)
          }
        }
      } catch (err) {
        console.warn('Backend Cases API offline, using local state:', err.message)
      }
    }
    fetchCases()
  }, [])

  async function resolveSession(id) {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, resolved: true, status: 'resolved' } : s))
    )

    try {
      await fetch(`${API_BASE_URL}/cases/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'resolved' }),
      })
    } catch (err) {
      console.error('Failed to sync case resolution with backend:', err.message)
    }
  }

  async function updateCase(id, data) {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    )

    try {
      await fetch(`${API_BASE_URL}/cases/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
    } catch (err) {
      console.error('Failed to update case on backend:', err.message)
    }
  }

  return (
    <ChatContext.Provider value={{ sessions, resolveSession, updateCase }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChats() {
  return useContext(ChatContext)
}