import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function DriverCreateAccount() {
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+94',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleCategory: 'Sedan',
    connectorType: 'Connector Type (e.g. Type 2, CCS)',
    vehicleModel: '',
    vehicleRegNumber: '',
    agreeTerms: false,
  });

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState(null); // 'country' | 'connector' | 'model' | 'category' | null

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  // Dropdown refs for click-outside detection
  const countryDropdownRef = useRef(null);
  const connectorDropdownRef = useRef(null);
  const modelDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown === 'country' &&
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      } else if (
        openDropdown === 'connector' &&
        connectorDropdownRef.current &&
        !connectorDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      } else if (
        openDropdown === 'model' &&
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      } else if (
        openDropdown === 'category' &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Options lists
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

  const connectorOptions = [
    { value: 'Type 2 (Mennekes)', label: 'Type 2 (Mennekes - AC Fast)' },
    { value: 'CCS 2 (Combo 2)', label: 'CCS 2 (Combo 2 - DC Ultra Fast)' },
    { value: 'CHAdeMO', label: 'CHAdeMO (DC Fast)' },
    { value: 'GB/T', label: 'GB/T (China Standard)' },
    { value: 'Tesla / NACS', label: 'Tesla Supercharger / NACS' },
  ];

  const vehicleModelOptions = [
    'Nissan Leaf',
    'Tesla Model 3',
    'Tesla Model Y',
    'Hyundai Ioniq 5',
    'Hyundai Kona Electric',
    'MG ZS EV',
    'BYD Atto 3',
    'BYD Seal',
    'BYD Dolphin',
    'Porsche Taycan',
    'Audi e-tron',
    'BMW i4',
    'BMW iX3',
    'Kia EV6',
    'Mercedes-Benz EQB',
    'Volvo EX30',
  ];

  const categoryOptions = [
    'Sedan',
    'SUV',
    'Hatchback',
    'Crossover',
    'Van / MPV',
    'Coupe / Sports',
    'Pickup Truck',
  ];

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSelectOption = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setOpenDropdown(null);
    if (error) setError('');
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

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
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
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setError('');
    setIsLoading(true);

    const driverProfile = {
      fullName: formData.fullName,
      email: formData.email,
      phone: `${formData.countryCode} ${formData.phone}`,
      vehicleCategory: formData.vehicleCategory,
      connectorType: formData.connectorType === 'Connector Type (e.g. Type 2, CCS)' ? 'Type 2 (Mennekes)' : formData.connectorType,
      vehicleModel: formData.vehicleModel || 'Electric Vehicle',
      vehicleRegNumber: formData.vehicleRegNumber || 'WP-EV-0001',
      registeredAt: new Date().toISOString(),
      role: 'driver',
    };

    localStorage.setItem('evora_driver_user', JSON.stringify(driverProfile));
    localStorage.setItem('evora_current_user', JSON.stringify(driverProfile));

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Account created successfully! Welcome to Evora.');
      setTimeout(() => {
        navigate('/book-charger');
      }, 1000);
    }, 700);
  };

  const openModal = (type) => {
    if (type === 'terms') {
      setModalTitle('Terms of Service');
      setModalContent(
        'By creating an Evora Driver Account, you agree to comply with our charging network guidelines, reserve charging slots responsibly, and maintain accurate vehicle information for optimal charging compatibility.'
      );
    } else if (type === 'privacy') {
      setModalTitle('Privacy Policy');
      setModalContent(
        'Evora is committed to protecting your privacy. Your vehicle details, reservation history, and payment information are encrypted with industry-standard protocols and never shared with unauthorized third parties.'
      );
    }
    setShowTermsModal(true);
  };

  return (
    <div className="driver-register-page">
      {/* Background overlay */}
      <div className="driver-register-bg-overlay" />

      <div className="driver-register-wrapper">
        {/* Main Glassmorphic Form Card */}
        <div className="driver-register-card">
          {/* Top Bar Navigation */}
          <div className="driver-register-topbar">
            <button
              type="button"
              className="driver-register-back-btn"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              title="Back"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3DDC97" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            <h1 className="driver-register-heading">Create Account</h1>

            <button
              type="button"
              className="driver-register-help-btn"
              onClick={() => setShowHelpModal(true)}
              aria-label="Registration Help"
              title="Help & Info"
            >
              <span className="help-icon">?</span>
            </button>
          </div>

          {/* Evora Branding Badge */}
          <div className="driver-register-brand">
            <div className="driver-brand-icon-wrap">
              <svg className="driver-bolt-icon" viewBox="0 0 24 24" width="30" height="30" fill="#3DDC97">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h2 className="driver-brand-name">Evora</h2>
            <p className="driver-brand-tagline">Driver Account Registration</p>
          </div>

          <div className="driver-form-divider" />

          {/* Feedback Alerts */}
          {error && (
            <div className="driver-alert-error" role="alert">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="driver-alert-success" role="status">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form className="driver-register-form" onSubmit={handleSubmit} noValidate>
            {/* SECTION 1: PERSONAL INFORMATION */}
            <div className="driver-form-section">
              <div className="driver-section-header">
                <svg className="section-header-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="section-header-title">PERSONAL INFORMATION</span>
              </div>

              <div className="driver-fields-grid personal-grid">
                {/* Full Name */}
                <div className="driver-input-group full-name-field">
                  <div className="input-prefix-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    className="driver-text-input"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="driver-input-group email-field">
                  <div className="input-prefix-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="driver-text-input"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Phone Number with Custom Interactive Country Code Dropdown */}
                <div className="driver-input-group phone-field" ref={countryDropdownRef}>
                  <div className="input-prefix-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>

                  <div className="phone-country-custom-wrap">
                    <button
                      type="button"
                      className="custom-country-trigger"
                      onClick={() => setOpenDropdown(openDropdown === 'country' ? null : 'country')}
                      aria-expanded={openDropdown === 'country'}
                    >
                      <span className="country-code-val">{formData.countryCode}</span>
                      <svg className={`dropdown-chevron-svg ${openDropdown === 'country' ? 'open' : ''}`} viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#3DDC97" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {openDropdown === 'country' && (
                      <div className="custom-dropdown-menu country-dropdown-menu">
                        {countryOptions.map((opt) => (
                          <div
                            key={opt.code}
                            className={`custom-dropdown-item ${formData.countryCode === opt.code ? 'selected' : ''}`}
                            onClick={() => handleSelectOption('countryCode', opt.code)}
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
                    className="driver-text-input phone-number-input"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: SECURITY */}
            <div className="driver-form-section">
              <div className="driver-section-header">
                <svg className="section-header-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="section-header-title">SECURITY</span>
              </div>

              <div className="driver-fields-grid security-grid">
                {/* Password Input */}
                <div className="driver-input-group">
                  <div className="input-prefix-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="driver-text-input"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="driver-password-toggle-btn"
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

                {/* Confirm Password Input */}
                <div className="driver-input-group">
                  <div className="input-prefix-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="driver-text-input"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                      className="driver-password-toggle-btn"
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

              {/* Password Strength Segmented Bar */}
              <div className="password-strength-container">
                <div className="strength-meter-bar">
                  <div className={`strength-segment segment-1 ${passwordStrength >= 1 ? 'active' : ''}`} />
                  <div className={`strength-segment segment-2 ${passwordStrength >= 2 ? 'active' : ''}`} />
                  <div className={`strength-segment segment-3 ${passwordStrength >= 3 ? 'active' : ''}`} />
                  <div className={`strength-segment segment-4 ${passwordStrength >= 4 ? 'active' : ''}`} />
                </div>
                <span className="strength-label">Password strength</span>
              </div>
            </div>

            {/* SECTION 3: VEHICLE DETAILS */}
            <div className="driver-form-section">
              <div className="driver-section-header">
                <svg className="section-header-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10l-1.5-4.5c-.3-.8-1-1.5-1.9-1.5H11.4c-.9 0-1.6.7-1.9 1.5L8 10s-2.7.6-4.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
                <span className="section-header-title">VEHICLE DETAILS</span>
              </div>

              <div className="driver-fields-grid vehicle-grid">
                {/* Custom Interactive Connector Type Dropdown */}
                <div className="driver-input-group custom-select-wrapper" ref={connectorDropdownRef}>
                  <div className="input-prefix-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>

                  <button
                    type="button"
                    className="custom-select-trigger"
                    onClick={() => setOpenDropdown(openDropdown === 'connector' ? null : 'connector')}
                    aria-expanded={openDropdown === 'connector'}
                  >
                    <span className={`selected-value-text ${formData.connectorType.startsWith('Connector Type') ? 'is-placeholder' : ''}`}>
                      {formData.connectorType}
                    </span>
                    <svg className={`dropdown-chevron-svg ${openDropdown === 'connector' ? 'open' : ''}`} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {openDropdown === 'connector' && (
                    <div className="custom-dropdown-menu">
                      {connectorOptions.map((opt) => (
                        <div
                          key={opt.value}
                          className={`custom-dropdown-item ${formData.connectorType === opt.value ? 'selected' : ''}`}
                          onClick={() => handleSelectOption('connectorType', opt.value)}
                        >
                          <span>{opt.label}</span>
                          {formData.connectorType === opt.value && (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#3DDC97" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Interactive Vehicle Model Dropdown / Input */}
                <div className="driver-input-group custom-select-wrapper" ref={modelDropdownRef}>
                  <div className="input-prefix-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10l-1.5-4.5c-.3-.8-1-1.5-1.9-1.5H11.4c-.9 0-1.6.7-1.9 1.5L8 10s-2.7.6-4.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    name="vehicleModel"
                    className="driver-text-input model-input-field"
                    placeholder="Vehicle Model"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    onClick={() => setOpenDropdown('model')}
                    autoComplete="off"
                  />

                  <button
                    type="button"
                    className="dropdown-toggle-icon-btn"
                    onClick={() => setOpenDropdown(openDropdown === 'model' ? null : 'model')}
                    aria-label="Toggle model choices"
                  >
                    <svg className={`dropdown-chevron-svg ${openDropdown === 'model' ? 'open' : ''}`} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {openDropdown === 'model' && (
                    <div className="custom-dropdown-menu">
                      {vehicleModelOptions.map((model) => (
                        <div
                          key={model}
                          className={`custom-dropdown-item ${formData.vehicleModel === model ? 'selected' : ''}`}
                          onClick={() => handleSelectOption('vehicleModel', model)}
                        >
                          <span>{model}</span>
                          {formData.vehicleModel === model && (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#3DDC97" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vehicle Registration Number */}
                <div className="driver-input-group">
                  <div className="input-prefix-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="vehicleRegNumber"
                    className="driver-text-input"
                    placeholder="Vehicle Registration Number"
                    value={formData.vehicleRegNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* Custom Interactive Vehicle Category Dropdown */}
                <div className="driver-input-group custom-select-wrapper" ref={categoryDropdownRef}>
                  <div className="input-prefix-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>

                  <button
                    type="button"
                    className="custom-select-trigger"
                    onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                    aria-expanded={openDropdown === 'category'}
                  >
                    <span className="selected-value-text">{formData.vehicleCategory}</span>
                    <svg className={`dropdown-chevron-svg ${openDropdown === 'category' ? 'open' : ''}`} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3DDC97" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {openDropdown === 'category' && (
                    <div className="custom-dropdown-menu">
                      {categoryOptions.map((cat) => (
                        <div
                          key={cat}
                          className={`custom-dropdown-item ${formData.vehicleCategory === cat ? 'selected' : ''}`}
                          onClick={() => handleSelectOption('vehicleCategory', cat)}
                        >
                          <span>{cat}</span>
                          {formData.vehicleCategory === cat && (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#3DDC97" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terms of Service & Privacy Checkbox */}
            <div className="driver-terms-row">
              <label className="driver-checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="driver-hidden-checkbox"
                />
                <span className="driver-custom-checkbox">
                  {formData.agreeTerms && (
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="#031C26" strokeWidth="3.5" fill="none">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="driver-terms-text">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="driver-terms-link"
                    onClick={(e) => {
                      e.preventDefault();
                      openModal('terms');
                    }}
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="driver-terms-link"
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
              className="driver-btn-submit"
              disabled={isLoading}
            >
              <span>{isLoading ? 'Creating Account...' : 'Create My Account'}</span>
              {!isLoading && (
                <svg className="submit-arrow-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>

            {/* Footer / Login Link */}
            <div className="driver-card-footer">
              <span className="footer-label">Already have an account?</span>{' '}
              <Link to="/login" className="footer-login-link">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="driver-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="driver-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="driver-modal-header">
              <h3 className="modal-title">Driver Registration Help</h3>
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
              <p><strong>Why register as a Driver?</strong></p>
              <p>With an Evora Driver account, you get access to instant station reservations, smart charging status notifications, automated billing, and live route navigation.</p>
              <br />
              <p><strong>Vehicle & Connector Type:</strong></p>
              <p>Selecting your connector type (e.g. Type 2 or CCS 2) allows Evora to filter compatible chargers automatically and optimize charging times for your specific battery.</p>
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

      {/* Terms / Privacy Modal */}
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
