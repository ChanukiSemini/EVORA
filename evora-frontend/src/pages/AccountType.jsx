import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccountType({ driverImg, hostImg }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('driver');
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'driver') {
      setTimeout(() => {
        navigate('/register-driver');
      }, 300);
    } else if (role === 'host') {
      setTimeout(() => {
        navigate('/register-host');
      }, 300);
    }
  };

  return (
    <div className="account-type-page">
      {/* Background elements */}
      <div className="account-type-bg-overlay" />
      <div className="account-type-grid-bg" />

      <div className="account-type-layout-wrapper">
        <div className="account-type-container">
          {/* Header Row: Title on Left, Help Button on Right */}
          <div className="account-type-header">
            <div className="account-type-header-row">
              <h1 className="account-type-title">
                Choose Your
                <br />
                <span>Account Type</span>
              </h1>
              <button
                type="button"
                className="account-type-help-btn"
                onClick={() => setShowHelpModal(!showHelpModal)}
                aria-label="Account Type Help"
                title="Help & Info"
              >
                <span className="help-icon">?</span>
              </button>
            </div>
            <p className="account-type-subtitle">
              Select the role that best describes you to personalize your Evora experience
            </p>
          </div>

          {/* Role Cards List */}
          <div className="account-type-cards">
            {/* Card 1: Driver */}
            <div
              className={`account-role-card ${selectedRole === 'driver' ? 'active-role' : ''}`}
              onClick={() => handleRoleSelect('driver')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleRoleSelect('driver')}
            >
              {/* Selection Checkmark Badge */}
              {selectedRole === 'driver' && (
                <div className="role-check-badge">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="3" fill="none">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {/* Icon / Image Avatar */}
              <div className="role-icon-circle">
                <div className="role-icon-wrapper">
                  {driverImg ? (
                    <img src={driverImg} alt="Driver" className="role-custom-img" />
                  ) : (
                    <>
                      <svg
                        className="role-svg-main"
                        viewBox="0 0 24 24"
                        width="36"
                        height="36"
                        fill="none"
                        stroke="#3DDC97"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10l-1.5-4.5c-.3-.8-1-1.5-1.9-1.5H11.4c-.9 0-1.6.7-1.9 1.5L8 10s-2.7.6-4.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                      <span className="role-badge-pill">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="#3DDC97">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <h2 className="role-title">I'm a Driver</h2>
              <p className="role-description">
                Find nearby charging stations, check availability, view pricing and navigate to your nearest Evora point.
              </p>

              {/* Arrow Action */}
              <div className="role-card-footer">
                <span className="role-arrow">→</span>
              </div>
            </div>

            {/* Card 2: Host */}
            <div
              className={`account-role-card ${selectedRole === 'host' ? 'active-role' : ''}`}
              onClick={() => handleRoleSelect('host')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleRoleSelect('host')}
            >
              {/* Selection Checkmark Badge */}
              {selectedRole === 'host' && (
                <div className="role-check-badge">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="3" fill="none">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {/* Icon / Image Avatar */}
              <div className="role-icon-circle">
                <div className="role-icon-wrapper">
                  {hostImg ? (
                    <img src={hostImg} alt="Host" className="role-custom-img" />
                  ) : (
                    <>
                      <svg
                        className="role-svg-main"
                        viewBox="0 0 24 24"
                        width="36"
                        height="36"
                        fill="none"
                        stroke="#3DDC97"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <circle cx="19" cy="11" r="2" />
                        <path d="M19 8v1" />
                        <path d="M19 13v1" />
                        <path d="M16.5 9.5l.8.5" />
                        <path d="M20.7 12l.8.5" />
                        <path d="M16.5 12.5l.8-.5" />
                        <path d="M20.7 10l.8-.5" />
                      </svg>
                      <span className="role-badge-pill">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="#3DDC97">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <h2 className="role-title">I'm a Host</h2>
              <p className="role-description">
                Manage charging stations, monitor usage, update availability and oversee the Evora network operations.
              </p>

              {/* Arrow Action */}
              <div className="role-card-footer">
                <span className="role-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="account-type-footer">
            <button
              type="button"
              className="btn-back-link"
              onClick={() => navigate('/')}
            >
              Back to Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="account-type-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="account-type-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Choosing Your Role</h3>
            <p className="modal-text">
              <strong>Driver:</strong> Choose this if you drive an EV and want to locate, reserve, and pay for charging sessions across our network.
            </p>
            <p className="modal-text" style={{ marginTop: '12px' }}>
              <strong>Host:</strong> Choose this if you own or manage commercial or residential EV charging hardware and want to offer your chargers on Evora.
            </p>
            <button className="btn-modal-close" onClick={() => setShowHelpModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
