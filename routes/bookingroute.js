const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const Booking = require('../models/booking');
const Room = require('../models/room');

// Middleware to validate booking details
const validateBookingDetails = (req, res, next) => {
  const { room, user, bookingDates, billing } = req.body;

  // Check for required fields
  if (!room || !user || !bookingDates || !billing) {
    return res.status(400).json({ message: 'Missing required booking information' });
  }

  // Validate dates
  const from = moment(bookingDates.fromDate, 'DD-MM-YYYY');
  const to = moment(bookingDates.toDate, 'DD-MM-YYYY');

  if (!from.isValid() || !to.isValid()) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  if (to.isBefore(from)) {
    return res.status(400).json({ message: 'End date cannot be before start date' });
  }

  next();
};

// Check room availability
const checkRoomAvailability = async (roomId, fromDate, toDate) => {
  const existingBookings = await Booking.find({
    roomid: roomId,
    $or: [
      {
        'bookingDates.fromDate': { $lte: toDate },
        'bookingDates.toDate': { $gte: fromDate }
      }
    ]
  });

  return existingBookings.length === 0;
};

router.post("/bookroom", validateBookingDetails, async (req, res) => {
  const { 
    room, 
    user, 
    bookingDates, 
    billing, 
    paymentId 
  } = req.body;
  
  try {
    // Verify room availability
    const isAvailable = await checkRoomAvailability(room.roomId, bookingDates.fromDate, bookingDates.toDate);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }

    // Generate a unique booking reference
    const bookingReference = uuidv4();

    // Create new booking
    const newBooking = new Booking({
      room: {
        name: room.name,
        roomId: room.roomId,
        rentPerDay: room.rentPerDay,
        maxCount: room.maxCount
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      bookingDates: {
        fromDate: bookingDates.fromDate,
        toDate: bookingDates.toDate
      },
      billing: {
        totalDays: billing.totalDays,
        totalAmount: billing.totalAmount
      },
      transactionid: paymentId || bookingReference,
      bookingReference,
      status: 'confirmed',
      bookingTimestamp: new Date().toISOString()
    });

    // Save booking
    const savedBooking = await newBooking.save();

    // Update room's current bookings
    const roomToUpdate = await Room.findById(room.roomId);
    if (!roomToUpdate) {
      return res.status(404).json({ message: 'Room not found' });
    }

    roomToUpdate.currentbooking.push({
      bookingid: savedBooking._id,
      fromdate: bookingDates.fromDate,
      todate: bookingDates.toDate,
      userid: user.id,
      status: savedBooking.status,
    });

    await roomToUpdate.save();

    // Send confirmation response
    res.status(200).json({ 
      message: 'Room booked successfully', 
      booking: savedBooking,
      bookingReference 
    });
  } catch (error) {
    console.error("Booking error:", error);
    
    // Differentiate between different types of errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.errors 
      });
    }

    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

module.exports = router;