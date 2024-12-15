import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useRazorpay } from "react-razorpay";
import Loader from "../components/Loader";
import Error from "../components/Error";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
// Import environment variables using create-react-app's method

const BookingScreen = () => {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();

  useEffect(() => {
    const getRoomById = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/rooms/getroombyid", { roomid });
        setRoom(data.room);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    getRoomById();
  }, [roomid]);

  useEffect(() => {
    if (room) {
      const fromMoment = moment(fromdate, 'DD-MM-YYYY');
      const toMoment = moment(todate, 'DD-MM-YYYY');
      const duration = moment.duration(toMoment.diff(fromMoment));
      const days = duration.asDays() + 1;
      setTotalDays(days);
      setTotalAmount(room.rentperday * days);
    }
  }, [room, fromdate, todate]);

  const bookRoom = async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      alert("Please log in to book a room");
      return;
    }
  
    // Create a detailed booking details object
    const bookingDetails = {
      room: {
        name: room.name,
        roomId: room._id,
        rentPerDay: room.rentperday,
        maxCount: room.maxcount
      },
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email
      },
      bookingDates: {
        fromDate: fromdate,
        toDate: todate
      },
      billing: {
        totalDays: totalDays,
        totalAmount: totalAmount,
        amountInPaise: totalAmount * 100
      },
      bookingTimestamp: new Date().toISOString()
    };
  
    // Log the booking details to console
    console.log("Booking Details:", JSON.stringify(bookingDetails, null, 2));
  
    // Validate Razorpay key
    if (!RAZORPAY_KEY_ID) {
      alert("Razorpay key is not configured. Please contact support.");
      return;
    }

    // Initiate Razorpay payment
    const paymentOptions = {
      key: RAZORPAY_KEY_ID, // Use the environment variable
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      name: "Hotel Booking",
      description: `Booking for ${room.name}`,
      handler: async (response) => {
        try {
          // Log payment response to console
          console.log("Payment Response:", response);

          // Optional: Send booking and payment details to backend
          await axios.post('/api/bookings/bookroom', {
            ...bookingDetails,
            paymentId: response.razorpay_payment_id
          });

          alert("Payment Successful!");
          navigate('/bookings');
        } catch (error) {
          console.error("Error finalizing booking:", error);
          alert("Booking processed, but there was an issue confirming with the server.");
        }
      },
      prefill: {
        name: currentUser.name,
        email: currentUser.email,
        contact: currentUser.phone
      },
      theme: {
        color: "#F37254"
      }
    };
  
    try {
      const razorpayInstance = new Razorpay(paymentOptions);
      razorpayInstance.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      alert("There was an issue with the payment gateway. Please try again.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <Error />;
  if (!room) return <h1>Room not found</h1>;

  return (
    <div className="imgbox bs">
      <div className="row mt-5 book left">
        <div className="col-md-5">
          <h3>{room.name}</h3>
          <img 
            src={room.imageurls[0]} 
            className="bigimg iii" 
            style={{marginTop:'30px'}} 
            alt={room.name} 
          />
        </div>
        <div className="col-md-5 right">
          <div style={{textAlign:'right'}}>
            <h3 style={{fontWeight:'700', marginBottom:'45px'}}>Booking Details</h3>
            <hr className="hrtag" />
            <b>
              <p>Name: {JSON.parse(localStorage.getItem('currentUser'))?.name || 'Guest'}</p>
              <p>From Date: {fromdate}</p>
              <p>To Date: {todate}</p>
              <p>Max Count: {room.maxcount}</p>
            </b>
          </div>
          <div style={{textAlign:'right'}}>
            <h4 style={{fontWeight:'600'}}>Billing</h4>
            <hr className="hrtag" />
            <b>
              <p>Total Days: {totalDays}</p>
              <p>Rent Per Day: {room.rentperday}</p>
              <p>Total Amount: {totalAmount}</p>
            </b>
          </div>
          <div style={{float:'right'}}>
            <button className="btn btn-primary" onClick={bookRoom}>
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingScreen;