import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function HostCreateAccount() {
  const navigate = useNavigate();

  // Unified Host Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    nicBrNumber: '',
    stationName: '',
    email: '',
    countryCode: '+94',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    docFile: null,
    docFileName: '',
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const countryDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close country dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setOpenCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const countryOptions = [
    { code: '+94', name: 'Sri Lanka' },
    { code: '+1', name: 'United States / Canada' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+61', name: 'Australia' },
    { code: '+91', name: 'India' },
    { code: '+65', name: 'Singapore' },
    { code: '+971', name: 'United Arab Emirates' },
    { code: '+49', name: 'Germany' },
    { code: '+81', name: 'Japan' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (error) setError('');
  };

  const handleCountrySelect = (code) => {
    setFormData((prev) => ({ ...prev, countryCode: code }));
    setOpenCountryDropdown(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      setFormData((prev) => ({ ...prev, docFile: file, docFileName: file.name }));
      if (error) setError('');
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, docFile: null, docFileName: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Password Strength Calculation (0 to 4)
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || pwd.length >= 12) score += 1;
    return score;
  }, [formData.password]);

  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setError('Please enter your full name or business name (at least 2 characters)');
      return;
    }

    if (!formData.nicBrNumber.trim() || formData.nicBrNumber.trim().length < 4) {
      setError('Please enter a valid NIC, Passport, or Business Registration (BR) number');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address (e.g. host@evora.lk)');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || cleanPhone.length < 7) {
      setError('Please enter a valid phone number (at least 7 digits)');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy');
      return;
    }

    setError('');
    setIsLoading(true);

    const stationDisplayName = formData.stationName.trim()
      ? formData.stationName.trim()
      : `${formData.fullName.trim()}'s Charging Station`;

    const payload = {
      fullName: formData.fullName.trim(),
      name: stationDisplayName,
      company: formData.fullName.trim(),
      brNo: formData.nicBrNumber.trim(),
      nicPassport: formData.nicBrNumber.trim(),
      nicBrNumber: formData.nicBrNumber.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: 'host',
      phone: `${formData.countryCode} ${formData.phone}`,
      stationName: stationDisplayName,
      stationAddress: formData.fullName.trim(),
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Host registration failed. Please try again.');
      }

      // Store authenticated user session
      if (data.token) {
        localStorage.setItem('evora_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('evora_host_user', JSON.stringify(data.user));
        localStorage.setItem('evora_current_user', JSON.stringify(data.user));
      }

      navigate('/verify-otp', {
        state: {
          phone: `${formData.countryCode} ${formData.phone}`,
          email: formData.email,
          role: 'host',
        },
      });
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (type) => {
    if (type === 'terms') {
      setModalTitle('Host Station Terms & Conditions');
      setModalContent(
        'As an Evora Station Host, you agree to provide secure and safe EV charging infrastructure, maintain accurate pricing tariffs and charger uptime, adhere to local electricity standards, and comply with safety guidelines.'
      );
    } else if (type === 'privacy') {
      setModalTitle('Host Privacy Policy');
      setModalContent(
        'Evora securely handles your host verification records, payouts, identity information, and charging session analytics. All data and documents are encrypted with AES-256 standard protocols.'
      );
    }
    setShowTermsModal(true);
  };

  return (
    <div className="host-register-page">
      {/* Background overlay */}
      <div className="host-register-bg-overlay" />

      <div className="host-register-wrapper">
        <div className="host-register-card">
          {/* Card Fixed Header Section (Does not scroll) */}
          <div className="host-card-fixed-header">
            {/* Top Bar Actions */}
            <div className="host-register-topbar">
              <button
                type="button"
                className="host-register-back-btn"
                onClick={() => navigate(-1)}
                aria-label="Go back"
                title="Back"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3DDC97" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>

              <button
                type="button"
                className="host-register-help-btn"
                onClick={() => setShowHelpModal(true)}
                aria-label="Host Registration Help"
                title="Help & Info"
              >
                <span className="help-icon">?</span>
              </button>
            </div>

            {/* Heading & Subheading */}
            <div className="host-register-header-text">
              <h1 className="host-register-heading">Create Host Account</h1>
              <p className="host-register-subheading">
                Register your charging stations and manage host operations on Evora.
              </p>
            </div>
          </div>

          {/* Scrollable Form Content Area with Interactive Scrollbar */}
          <div className="host-card-scrollable-content">
            {/* Feedback Alerts */}
            {error && (
              <div className="host-alert-error" role="alert">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="host-alert-success" role="status">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Registration Form */}
            <form className="host-register-form" onSubmit={handleSubmit} noValidate>
              <div className="host-fields-section">
                {/* Row 1: Full Name / Business Name */}
                <div className="host-field-wrapper">
                  <label className="host-field-label">Full Name / Business Name</label>
                  <div className="host-input-group">
                    <div className="input-prefix-icon">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      className="host-text-input"
                      placeholder="e.g. Nimal Perera or GreenVolt Energy"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: NIC / Passport / BR Number */}
                <div className="host-field-wrapper">
                  <label className="host-field-label">NIC / Passport / BR Number</label>
                  <div className="host-input-group">
                    <div className="input-prefix-icon">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="nicBrNumber"
                      className="host-text-input"
                      placeholder="e.g. 200012345678 or PV 00123456"
                      value={formData.nicBrNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <span className="field-hint-text">Required for host identity & station verification</span>
                </div>

                {/* Row 3: Charging Station / Location Name (Optional) */}
                <div className="host-field-wrapper">
                  <label className="host-field-label">Charging Station / Location Name (Optional)</label>
                  <div className="host-input-group">
                    <div className="input-prefix-icon">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="stationName"
                      className="host-text-input"
                      placeholder="e.g. Colombo 03 Fast Hub or Home Wallbox"
                      value={formData.stationName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <span className="field-hint-text">The name displayed to drivers on the EVORA map</span>
                </div>

                {/* Row 4: Host Email Address */}
                <div className="host-field-wrapper">
                  <label className="host-field-label">Email Address</label>
                  <div className="host-input-group">
                    <div className="input-prefix-icon">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="host-text-input"
                      placeholder="host@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Row 5: Phone Number with Country Code */}
                <div className="host-field-wrapper" ref={countryDropdownRef}>
                  <label className="host-field-label">Phone Number</label>
                  <div className="host-input-group phone-field">
                    <div className="input-prefix-icon">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>

                    <div className="phone-country-custom-wrap">
                      <button
                        type="button"
                        className="custom-country-trigger"
                        onClick={() => setOpenCountryDropdown(!openCountryDropdown)}
                      >
                        <span className="country-code-val">{formData.countryCode}</span>
                        <svg className={`dropdown-chevron-svg ${openCountryDropdown ? 'open' : ''}`} viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#3DDC97" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {openCountryDropdown && (
                        <div className="custom-dropdown-menu country-dropdown-menu">
                          {countryOptions.map((opt) => (
                            <div
                              key={opt.code}
                              className={`custom-dropdown-item ${formData.countryCode === opt.code ? 'selected' : ''}`}
                              onClick={() => handleCountrySelect(opt.code)}
                            >
                              <span className="dropdown-opt-code">{opt.code}</span>
                              <span className="dropdown-opt-name">{opt.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="phone-divider-bar" />

                    <input
                      type="tel"
                      name="phone"
                      className="host-text-input phone-number-input"
                      placeholder="77 123 4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                {/* Row 6: Passwords Grid */}
                <div className="host-passwords-grid">
                  <div className="host-field-wrapper">
                    <label className="host-field-label">Password</label>
                    <div className="host-input-group">
                      <div className="input-prefix-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="host-text-input"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="host-password-toggle-btn"
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
                  </div>

                  <div className="host-field-wrapper">
                    <label className="host-field-label">Confirm Password</label>
                    <div className="host-input-group">
                      <div className="input-prefix-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        className="host-text-input"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        required
                      />
                      <div className="input-suffix-actions">
                        {passwordsMatch && (
                          <span className="password-match-icon" title="Passwords match">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3DDC97" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                        <button
                          type="button"
                          className="host-password-toggle-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? (
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
                    </div>
                  </div>
                </div>

                {/* Password Strength Meter */}
                <div className="password-strength-container host-strength-bar">
                  <div className="strength-meter-bar">
                    <div className={`strength-segment segment-1 ${passwordStrength >= 1 ? 'active' : ''}`} />
                    <div className={`strength-segment segment-2 ${passwordStrength >= 2 ? 'active' : ''}`} />
                    <div className={`strength-segment segment-3 ${passwordStrength >= 3 ? 'active' : ''}`} />
                    <div className={`strength-segment segment-4 ${passwordStrength >= 4 ? 'active' : ''}`} />
                  </div>
                  <span className="strength-label">Password strength</span>
                </div>

                {/* Row 7: Document Upload Box */}
                <div
                  className="host-upload-box"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="host-hidden-file-input"
                    onChange={handleFileUpload}
                    accept=".pdf,.png,.jpg,.jpeg"
                  />

                  <div className="upload-cloud-circle">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#3DDC97" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 16l-4-4-4 4" />
                      <path d="M12 12v9" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                  </div>

                  <h4 className="upload-main-title">Upload Verification Document</h4>
                  <p className="upload-sub-text">
                    {formData.docFileName ? (
                      <span className="uploaded-filename">
                        📄 {formData.docFileName}
                        <button
                          type="button"
                          className="btn-remove-uploaded"
                          onClick={handleRemoveFile}
                          title="Remove file"
                        >
                          ✕
                        </button>
                      </span>
                    ) : (
                      'NIC, Passport copy, or BR Certificate (PDF / Image max 5MB)'
                    )}
                  </p>

                  <span className="upload-badge-pill">Required for verification</span>
                </div>
              </div>

              {/* Terms of Service Checkbox */}
              <div className="host-terms-row">
                <label className="host-checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="host-hidden-checkbox"
                  />
                  <span className="host-custom-checkbox">
                    {formData.agreeTerms && (
                      <svg viewBox="0 0 24 24" width="13" height="13" stroke="#031C26" strokeWidth="3.5" fill="none">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span className="host-terms-text">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="host-terms-link"
                      onClick={(e) => {
                        e.preventDefault();
                        openModal('terms');
                      }}
                    >
                      Terms & Conditions
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      className="host-terms-link"
                      onClick={(e) => {
                        e.preventDefault();
                        openModal('privacy');
                      }}
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="host-btn-submit"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Registering Host...' : 'Continue'}</span>
                {!isLoading && (
                  <svg className="submit-arrow-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>

              {/* Footer / Login Link */}
              <div className="host-card-footer">
                <span className="footer-label">Already have an account?</span>{' '}
                <Link to="/login" className="footer-login-link">
                  Log In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="driver-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="driver-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="driver-modal-header">
              <h3 className="modal-title">Host Account Information</h3>
              <button
                type="button"
                className="driver-modal-close-icon"
                onClick={() => setShowHelpModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="driver-modal-body">
              <p>
                <strong>⚡ Evora Charging Station Host:</strong>
              </p>
              <p>
                As an Evora Host, you can list and monetize your EV charging stations (residential wallboxes, commercial hubs, or public chargers), manage reservations, track real-time power analytics, and set automated billing.
              </p>
              <br />
              <p>
                <strong>📋 Verification Requirements:</strong>
              </p>
              <p>
                Provide a valid NIC / Passport number (for individual hosts) or Business Registration number (for commercial hosts) along with a verification document to activate your charging station on the Evora network.
              </p>
            </div>
            <button
              type="button"
              className="driver-btn-modal-action"
              onClick={() => setShowHelpModal(false)}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="driver-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="driver-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="driver-modal-header">
              <h3 className="modal-title">{modalTitle}</h3>
              <button
                type="button"
                className="driver-modal-close-icon"
                onClick={() => setShowTermsModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="driver-modal-body">
              <p>{modalContent}</p>
            </div>
            <button
              type="button"
              className="driver-btn-modal-action"
              onClick={() => setShowTermsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
