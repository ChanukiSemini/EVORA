import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Store auth session
      if (data.token) {
        localStorage.setItem('evora_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('evora_current_user', JSON.stringify(data.user));
        if (data.user.role === 'driver') {
          localStorage.setItem('evora_driver_user', JSON.stringify(data.user));
        } else if (data.user.role === 'host') {
          localStorage.setItem('evora_host_user', JSON.stringify(data.user));
        }
      }

      // Route according to user role
      const userRole = (data.user?.role || '').toLowerCase();
      if (userRole === 'host' || userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/book-charger');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background layer for overlay/wallpaper */}
      <div className="login-bg-overlay" />

      <div className="login-wrapper">
        {/* Desktop Left Showcase Panel (visible ≥ 1024px) */}
        <div className="login-desktop-showcase">
          <div className="login-showcase-content">
            <div className="login-showcase-brand" onClick={() => navigate('/')}>
              <span className="brand-dot">●</span> EVORA
            </div>
            <div className="login-showcase-hero">
              <h2 className="login-showcase-title">
                Smart EV Charging
                <br />
                <span>Made Effortless.</span>
              </h2>
              <p className="login-showcase-text">
                Access Sri Lanka's largest network of smart EV chargers, manage reservations, track energy, and power your journey seamlessly.
              </p>
            </div>
            <div className="login-showcase-badges">
              <div className="showcase-badge">
                <span className="badge-value">50+</span>
                <span className="badge-label">Supercharge Hubs</span>
              </div>
              <div className="showcase-badge">
                <span className="badge-value">99.9%</span>
                <span className="badge-label">Network Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Card (Mobile, Tablet, and Desktop Right Panel) */}
        <div className="login-card-container">
          <div className="login-card">
            {/* Title & Subtitle */}
            <div className="login-header-text">
              <h1 className="login-title">Evora</h1>
              <p className="login-tagline">Power Your Journey</p>
            </div>

            {/* Error Message */}
            {error && <div className="login-error-alert">{error}</div>}

            {/* Login Form */}
            <form className="login-form" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="login-input-group">
                <div className="login-input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  type="email"
                  className="login-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="login-input-group">
                <div className="login-input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#8A9EA8" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#8A9EA8" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="login-options-row">
                <label className="login-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="login-checkbox"
                  />
                  <span className="checkbox-custom">
                    {rememberMe && (
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="#031C26" strokeWidth="3" fill="none">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span className="checkbox-text">Remember Me</span>
                </label>

                <button
                  type="button"
                  className="login-forgot-btn"
                  onClick={() => alert('Password reset instructions will be sent to your email.')}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-login-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Footer / Create Account Link */}
            <div className="login-card-footer">
              <span className="footer-label">Don't have an account?</span>{' '}
              <Link to="/account-type" className="footer-signup-link">
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
