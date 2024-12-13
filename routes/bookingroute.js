const express = require("express");
const router = express.Router();
const Booking = require('../models/booking')
const Room=require("../models/room.js")
router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, transactionid } = req.body;
  
  try {
    const newbooking = new Booking({
      room: room.name,
      roomid: room._id,
      userid,
      fromdate,
      todate,
      totalamount,
      totaldays,
      transactionid
    });

    const booking = await newbooking.save();
    const temproom=await Room.findOne({_id:room._id})
    temproom.currentbooking.push({
      bookingid:booking._id,
      fromdate:fromdate,
      todate:todate,
      userid:userid,
      status:booking.status,
    })
    res.status(200).json({ message: 'Room booked successfully', booking });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(400).json({ message: 'Something went wrong', error: error.message });
  }
});

module.exports = router;