// ============================================
// src/pages/RescheduleBookingDemo.jsx
// EVORA - Reschedule Booking Demo Page
// ============================================

import { useNavigate } from 'react-router-dom';
import MyReservations from './MyReservations';
import RescheduleBookingModal from '../components/RescheduleBookingModal';

const RescheduleBookingDemo = () => {
    const navigate = useNavigate();

    return (
        <div className="reschedule-demo-page-wrapper">
            <MyReservations />
            <RescheduleBookingModal
                onClose={() => navigate('/bookings')}
                onConfirmReschedule={() => navigate('/bookings')}
            />
        </div>
    );
};

export default RescheduleBookingDemo;
