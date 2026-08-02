import { createContext, useContext, useState } from 'react'

const AccountTypeContext = createContext(null)

export function AccountTypeProvider({ children }) {
  // 'driver' | 'host'
  const [accountType, setAccountType] = useState('driver')

  return (
    <AccountTypeContext.Provider value={{ accountType, setAccountType }}>
      {children}
    </AccountTypeContext.Provider>
  )
}

export function useAccountType() {
  const ctx = useContext(AccountTypeContext)
  if (!ctx) throw new Error('useAccountType must be used within AccountTypeProvider')
  return ctx
}
