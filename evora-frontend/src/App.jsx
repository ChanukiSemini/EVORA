import { Routes, Route, Navigate } from 'react-router-dom'
import ChooseAccountType from './pages/ChooseAccountType.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import CompleteProfile from './pages/CompleteProfile.jsx'
import CreateDriverAccount from './pages/CreateDriverAccount.jsx'
import CreateHostAccount from './pages/CreateHostAccount.jsx'
import OtpVerification from './pages/OtpVerification.jsx'
import AccountCreated from './pages/AccountCreated.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChooseAccountType />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/create-account/driver" element={<CreateDriverAccount />} />
      <Route path="/create-account/host" element={<CreateHostAccount />} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route path="/account-created" element={<AccountCreated />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
