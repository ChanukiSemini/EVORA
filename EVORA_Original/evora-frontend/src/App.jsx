import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookCharger from './pages/BookCharger'
import ChooseAccountType from './pages/ChooseAccountType'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import CompleteProfile from './pages/CompleteProfile'
import CreateDriverAccount from './pages/CreateDriverAccount'
import CreateHostAccount from './pages/CreateHostAccount'
import OtpVerification from './pages/OtpVerification'
import AccountCreated from './pages/AccountCreated'
import Dashboard from './pages/Dashboard'
import { AccountTypeProvider } from './context/AccountTypeContext'

/**
 * Wraps every auth/onboarding page in the ".evora-auth" class.
 * This is what scopes the auth flow's Tailwind-based theme (colors,
 * fonts, .card/.btn-primary/.field styling) so it never leaks out
 * and affects the original LandingPage or BookCharger screens - see
 * src/auth-theme.css for the full explanation.
 */
function AuthFlowLayout() {
  return (
    <AccountTypeProvider>
      <div className="evora-auth">
        <Outlet />
      </div>
    </AccountTypeProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Original app screens - untouched */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/book-charger" element={<BookCharger />} />

        {/* New auth / onboarding flow, scoped under .evora-auth */}
        <Route element={<AuthFlowLayout />}>
          <Route path="/choose-account-type" element={<ChooseAccountType />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/create-account/driver" element={<CreateDriverAccount />} />
          <Route path="/create-account/host" element={<CreateHostAccount />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/account-created" element={<AccountCreated />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
