import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve passed state or fallback to stored user info
  const stateData = location.state || {};
  const storedUser = JSON.parse(localStorage.getItem('evora_current_user') || '{}');

  const phone = stateData.phone || storedUser.phone || '+94 77 123 4567';
  const role = stateData.role || storedUser.role || 'driver';
  const email = stateData.email || storedUser.email || 'user@evora.lk';

  // Mask email for display (e.g., "ch****@gmail.com")
  const maskedEmail = maskEmail(email);

  // 6-digit OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeIdx, setActiveIdx] = useState(0);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend Timer Countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle Physical Keyboard Input
  const handleInputChange = (e, index) => {
    const val = e.target.value;
    if (error) setError('');

    // If typing single digit
    if (/^[0-9]$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      // Move to next box
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
        setActiveIdx(index + 1);
      }
    } else if (val === '') {
      // Empty
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move back and delete previous
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
        setActiveIdx(index - 1);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIdx(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveIdx(index + 1);
    }
  };

  // Handle Pasting Full 6-digit Code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
      setActiveIdx(5);
      if (error) setError('');
    }
  };

  // On-screen Keypad Clicks
  const handleKeypadPress = (key) => {
    if (error) setError('');

    if (key === 'backspace') {
      // Find the last filled digit
      let targetIdx = activeIdx;
      if (!otp[targetIdx] && targetIdx > 0) {
        targetIdx = targetIdx - 1;
      }
      const newOtp = [...otp];
      newOtp[targetIdx] = '';
      setOtp(newOtp);
      inputRefs.current[targetIdx]?.focus();
      setActiveIdx(targetIdx);
    } else if (typeof key === 'number' || /^[0-9]$/.test(key)) {
      // Find first empty or current active
      let firstEmpty = otp.findIndex((d) => d === '');
      if (firstEmpty === -1) firstEmpty = 5;

      const newOtp = [...otp];
      newOtp[firstEmpty] = String(key);
      setOtp(newOtp);

      const nextIdx = Math.min(firstEmpty + 1, 5);
      inputRefs.current[nextIdx]?.focus();
      setActiveIdx(nextIdx);
    }
  };

  // Resend OTP Code
  const handleResendCode = () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    setInfoMsg('A new 6-digit verification code has been sent!');
    setTimeout(() => setInfoMsg(''), 4000);
  };

  // Submit Verification
  const handleVerify = (e) => {
    if (e) e.preventDefault();
    const enteredCode = otp.join('');

    if (enteredCode.length < 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/account-success', {
        state: {
          role,
          phone,
          email,
        },
      });
    }, 700);
  };

  return (
    <div className="otp-verify-page">
      {/* Background overlay */}
      <div className="otp-verify-bg-overlay" />

      <div className="otp-verify-wrapper">
        <div className="otp-verify-card">
          {/* Top Bar Header with Back Button */}
          <div className="otp-verify-topbar">
            <button
              type="button"
              className="otp-back-btn"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              title="Back"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3DDC97" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          </div>

          {/* Heading & Subtitle */}
          <div className="otp-header-text">
            <h1 className="otp-title">Verify Your Email</h1>
            <p className="otp-subtitle">
              Enter the 6-digit code sent to <strong className="highlight-email">{maskedEmail}</strong>
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="otp-alert-error" role="alert">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {infoMsg && (
            <div className="otp-alert-info" role="status">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{infoMsg}</span>
            </div>
          )}

          {/* 6-Digit OTP Boxes */}
          <div className="otp-boxes-container" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className={`otp-digit-box ${digit ? 'filled' : ''} ${activeIdx === idx ? 'active' : ''}`}
                value={digit}
                onChange={(e) => handleInputChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onFocus={() => setActiveIdx(idx)}
                ref={(el) => (inputRefs.current[idx] = el)}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {/* Resend Code Section */}
          <div className="otp-resend-row">
            <span className="resend-label">Didn't receive the code?</span>
            {canResend ? (
              <button
                type="button"
                className="btn-resend-active"
                onClick={handleResendCode}
              >
                Resend Code
              </button>
            ) : (
              <span className="resend-timer-text">
                <span className="resend-text-green">Resend Code</span>{' '}
                <span className="timer-count">00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}s</span>
              </span>
            )}
          </div>

          {/* On-screen Numeric Keypad */}
          <div className="otp-numeric-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                className="keypad-btn"
                onClick={() => handleKeypadPress(num)}
              >
                {num}
              </button>
            ))}
            <div className="keypad-btn empty-key" />
            <button
              type="button"
              className="keypad-btn"
              onClick={() => handleKeypadPress(0)}
            >
              0
            </button>
            <button
              type="button"
              className="keypad-btn backspace-key"
              onClick={() => handleKeypadPress('backspace')}
              aria-label="Delete last digit"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
          </div>

          {/* Action Verify Button */}
          <button
            type="button"
            className="otp-btn-verify"
            onClick={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper to mask email address (e.g. "ev***@gmail.com")
function maskEmail(email) {
  if (!email) return 'your email address';
  const clean = email.trim();
  const parts = clean.split('@');
  if (parts.length !== 2) return clean;
  const [name, domain] = parts;
  if (name.length <= 2) {
    return `${name}***@${domain}`;
  }
  const visible = name.slice(0, 2);
  const hiddenLength = Math.min(Math.max(name.length - 2, 3), 6);
  return `${visible}${'*'.repeat(hiddenLength)}@${domain}`;
}
