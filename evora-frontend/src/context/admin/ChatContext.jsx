import { createContext, useState, useContext } from 'react'
import { chatSessions as initialSessions } from '../../data/admin/chatSessions'

const ChatContext = createContext()

export function ChatProvider({ children }) {
  const [sessions, setSessions] = useState(initialSessions)

  function resolveSession(id) {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, resolved: true } : s))
    )
  }

  return (
    <ChatContext.Provider value={{ sessions, resolveSession }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChats() {
  return useContext(ChatContext)
}