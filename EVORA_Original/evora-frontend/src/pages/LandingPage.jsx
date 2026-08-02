// ============================================
// src/pages/LandingPage.jsx
// NO css import here — everything is in index.css
// Image is at src/assets/ev-hero.jpg
// ============================================

import { useNavigate } from 'react-router-dom';
import evHero from '../assets/ev-hero.jpg';

const features = [
    'Find available EV chargers near you',
    'Real-time slot availability',
    'Manage all your reservations in one place',
    'Supports CCS2, AC Type 2 and more',
];

const LandingPage = () => {
    const navigate = useNavigate();

    const goToBooking = () => navigate('/book-charger');
    const goToLogin = () => navigate('/choose-account-type');

    return (
        <div className="landing-wrapper">

            {/* ════════════════════════════════
          MOBILE LAYOUT  (hidden ≥ 768px)
          ════════════════════════════════ */}
            <div className="landing-screen">

                {/* Logo */}
                <h1 className="landing-logo">EVORA</h1>

                {/* Hero image */}
                <div className="landing-hero-card">
                    <img src={evHero} alt="EV Charging" />
                </div>

                {/* Text */}
                <div className="landing-text-block">
                    <p className="landing-headline">
                        Sri Lanka's<br />Smart EV Charging Network
                    </p>
                    <p className="landing-subtext">
                        Find available chargers, book your slot and
                        manage charging sessions with ease
                    </p>
                </div>

                {/* Buttons */}
                <div className="landing-buttons">
                    <button className="btn-get-started" onClick={goToBooking}>
                        Get Started <span className="btn-arrow">→</span>
                    </button>
                    <button className="btn-login" onClick={goToLogin}>
                        Log in
                    </button>
                </div>

                <p className="landing-footer">● EVORA</p>
            </div>


            {/* ════════════════════════════════
          DESKTOP LAYOUT  (hidden < 768px)
          Left: full bleed hero image
          Right: logo + text + buttons
          ════════════════════════════════ */}
            <div className="landing-desktop">

                {/* Left — image panel */}
                <div className="desktop-left">
                    <img src={evHero} alt="EV Charging" />
                    <div className="desktop-image-badge">
                        <span className="desktop-image-badge-title">EVORA</span>
                        <span className="desktop-image-badge-sub">
                            Smart EV Charging Network
                        </span>
                    </div>
                </div>

                {/* Right — content panel */}
                <div className="desktop-right">

                    <h1 className="landing-logo">EVORA</h1>

                    <div className="landing-text-block">
                        <p className="landing-headline">
                            Sri Lanka's<br />Smart EV Charging Network
                        </p>
                        <p className="landing-subtext">
                            Find available chargers, book your slot and
                            manage charging sessions with ease
                        </p>
                    </div>

                    {/* Feature list — desktop only */}
                    <ul className="desktop-features">
                        {features.map((f, i) => (
                            <li key={i} className="feature-item">
                                <span className="feature-dot" />
                                {f}
                            </li>
                        ))}
                    </ul>

                    <div className="landing-buttons">
                        <button className="btn-get-started" onClick={goToBooking}>
                            Get Started <span className="btn-arrow">→</span>
                        </button>
                        <button className="btn-login" onClick={goToLogin}>
                            Log in
                        </button>
                    </div>

                    <p className="landing-footer">● EVORA</p>
                </div>

            </div>

        </div>
    );
};

export default LandingPage;
