import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AccountCreatedSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state || {};
  const storedUser = JSON.parse(localStorage.getItem('evora_current_user') || '{}');
  const role = stateData.role || storedUser.role || 'driver';

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // Auto-redirect to login
      navigate('/login');
    }
  }, [countdown, navigate]);

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="account-success-page">
      {/* Background overlay */}
      <div className="account-success-bg-overlay" />

      <div className="account-success-wrapper">
        <div className="account-success-card">
          {/* Concentric Success Badge & Checkmark Graphic */}
          <div className="success-badge-wrapper">
            <div className="success-orbit-outer-ring">
              <div className="orbit-dot dot-1" />
              <div className="orbit-dot dot-2" />
              <div className="orbit-dot dot-3" />
            </div>

            <div className="success-orbit-middle-ring" />

            <div className="success-checkmark-circle">
              <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#031C26" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="success-title">Account Created!</h1>

          {/* Description */}
          <p className="success-description">
            Thank you for signing up! Your {role === 'host' ? 'host' : 'driver'} account has been successfully created. You can now log in using your registered credentials.
          </p>

          {/* Continue Button */}
          <button
            type="button"
            className="success-btn-continue"
            onClick={handleContinue}
          >
            <span>Continue to Login</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Redirect Timer Indicator */}
          <div className="success-redirect-status">
            <div className="redirect-spinner-ring" />
            <span className="redirect-text">
              Redirecting to login in {countdown}s...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
