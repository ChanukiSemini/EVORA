// controllers/bookingController.js
//
// Purpose: fetch a single booking with everything the Review page
// needs to display — station details come via the charger the
// booking references (charger -> station).

import Booking from '../models/Booking.js';
import Charger from '../models/Charger.js';
import Station from '../models/Station.js';
import Connector from '../models/Connector.js';
import Vehicle from '../models/Vehicle.js';
import EvDriver from '../models/EvDriver.js';

export async function getBookingForReview(req, res) {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: 'charger',
                populate: [
                    { path: 'station' },   // gives us station name/address
                    { path: 'connector' }, // gives us connector name/spec
                ],
            })
            .populate('vehicle')
            .populate('driver');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}