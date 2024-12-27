const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const mongoose = require('mongoose');

const Booking = require('../models/booking');
const Room = require('../models/room');

// Simplified validation middleware to match the model
const validateBookingRequest = async (req, res, next) => {

  // console.log("Full booking request body:", JSON.stringify(req.body, null, 2));

  const { room, user, fromDate, toDate, totalAmount, totalDays, paymentId } = req.body;

  // Log individual fields for debugging
  // console.log("Extracted fields:", {
  //   room,
  //   user,
  //   fromDate,
  //   toDate,
  //   totalAmount,
  //   totalDays,
  //   paymentId
  // });
  const validationErrors = [];

  // Basic required field validation
  if (!room) validationErrors.push('Room ID is required');
  if (!user) validationErrors.push('User ID is required');
  if (!fromDate) validationErrors.push('From date is required');
  if (!toDate) validationErrors.push('To date is required');
  if (!totalAmount) validationErrors.push('Total amount is required');
  if (!totalDays) validationErrors.push('Total days is required');

  // Date validation
  if (fromDate && toDate) {
    const fromMoment = moment(fromDate, 'YYYY-MM-DD', true);
    const toMoment = moment(toDate, 'YYYY-MM-DD', true);

    if (!fromMoment.isValid()) {
      validationErrors.push('Invalid from date format. Use YYYY-MM-DD');
    }
    if (!toMoment.isValid()) {
      validationErrors.push('Invalid to date format. Use YYYY-MM-DD');
    }
    if (fromMoment.isValid() && toMoment.isValid() && toMoment.isBefore(fromMoment)) {
      validationErrors.push('To date cannot be before from date');
    }
  }

  // Numeric validation
  if (totalAmount && totalAmount <= 0) {
    validationErrors.push('Total amount must be positive');
  }
  if (totalDays && totalDays <= 0) {
    validationErrors.push('Total days must be positive');
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: validationErrors.join(', ')
    });
  }

  next();
};

// Room availability check
const checkRoomAvailability = async (roomId, fromDate, toDate) => {
  const existingBookings = await Booking.find({
    roomid: roomId,
    $or: [
      {
        fromdate: { $lte: toDate },
        todate: { $gte: fromDate }
      }
    ]
  });

  return existingBookings.length === 0;
};

// Booking route
router.post("/bookroom", validateBookingRequest, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { room: roomId, user, fromDate, toDate, totalAmount, totalDays, paymentId } = req.body;
    const roomDetails = await Room.findById(roomId);
    if (!roomDetails) {
      throw new Error('Room not found');
    }
    // Check room availability
    const isAvailable = await checkRoomAvailability(roomId, fromDate, toDate);
    if (!isAvailable) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        status: 'error',
        message: 'Room is not available for the selected dates'
      });
    }

    // Create new booking - matching the schema structure
    const newBooking = new Booking({
      room: roomDetails.name,
      roomid: roomId,
      userid: user,
      fromdate: fromDate,
      todate: toDate,
      totalamount: totalAmount,
      totaldays: totalDays,
      transactionid: paymentId || uuidv4(),
      status: "booked"
    });

    const savedBooking = await newBooking.save({ session });

    // Update room's current bookings
    await Room.findByIdAndUpdate(
      roomId,
      {
        $push: {
          currentbooking: {
            bookingid: savedBooking._id,
            fromdate: fromDate,
            todate: toDate,
            userid: user,
            status: "booked"
          }
        }
      },
      { session, new: true }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: 'success',
      message: 'Room booked successfully',
      booking: savedBooking
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Booking error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});


router.post("/getbooking",async(req,res)=>{
  const userid=req.body.userid;
  try{
    const bookings=await Booking.find({userid:userid})
    res.json(bookings)
  }
  catch(error){
    return res.status(500).json({error})
  }
})

router.post("/cancelbooking",async(req,res)=>{
  const{bookingid,roomid}=req.body
  try {
    const bookingobject=await Booking.findOne({_id:bookingid})
    bookingobject.status='cancelled'
    await bookingobject.save()
    const room=await Room.findOne({_id:roomid})
     const bookings=room.currentbooking
     const temp=bookings.filter(booking=>booking.bookingid.toString()!==bookingid)
     room.currentbooking=temp

     await room.save()

     res.send("Booking Cancelled Sucessfully")
  } catch (error) {
    return res.status(400).json({error})
  }
})

module.exports = router;