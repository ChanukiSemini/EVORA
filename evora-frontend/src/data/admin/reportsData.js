// NOTE: Booking data is mocked here as a placeholder.
// This admin module doesn't own booking/reservation data —
// once the booking module's backend API exists, replace this
// with a real fetch (e.g. GET /api/reports/bookings?range=weekly).
export const bookingsByPeriod = {
  Daily: { totalBookings: 24, cancelledBookings: 3 },
  Weekly: { totalBookings: 168, cancelledBookings: 19 },
  Monthly: { totalBookings: 742, cancelledBookings: 68 },
  Yearly: { totalBookings: 8940, cancelledBookings: 812 },
}