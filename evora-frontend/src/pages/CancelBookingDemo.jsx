// ============================================
// src/pages/CancelBookingDemo.jsx
// EVORA - Cancel Booking Standalone Demo Route Page
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import MyReservations from './MyReservations';
import CancelBookingModal from '../components/CancelBookingModal';

const CancelBookingDemo = () => {
    const navigate = useNavigate();

    return (
        <div className="cancel-demo-page-wrapper">
            <MyReservations />
            <CancelBookingModal
                onClose={() => navigate('/bookings')}
                onConfirmCancel={() => navigate('/bookings')}
            />
        </div>
    );
};

export default CancelBookingDemo;
