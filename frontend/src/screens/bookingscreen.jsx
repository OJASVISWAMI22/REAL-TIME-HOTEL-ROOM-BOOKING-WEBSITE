import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useRazorpay } from "react-razorpay";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
const RAZORPAY_KEY_ID = "rzp_test_mIb4yljUBLSy6R";

const BookingScreen = () => {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();

  useEffect(() => {
    const getRoomById = async () => {
      if (!localStorage.getItem("currentUser")) {
        window.location.href = "/login";
      }
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
      const from = moment(fromdate, "DD-MM-YYYY");
      const to = moment(todate, "DD-MM-YYYY");

      if (!from.isValid() || !to.isValid()) {
        console.error("Invalid date format");
        return;
      }

      const days = to.diff(from, "days") + 1;
      setTotalDays(days);
      setTotalAmount(room.rentperday * days);
    }
  }, [room, fromdate, todate]);

  const validateDates = () => {
    const from = moment(fromdate, "DD-MM-YYYY");
    const to = moment(todate, "DD-MM-YYYY");
    const today = moment().startOf("day");

    if (!from.isValid() || !to.isValid()) {
      alert("Invalid booking dates");
      return false;
    }

    if (from.isBefore(today)) {
      alert("Cannot book dates in the past");
      return false;
    }

    if (from.isAfter(to)) {
      alert("Check-out date must be after check-in date");
      return false;
    }

    return true;
  };

  const handlePaymentSuccess = async (response) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      const bookingDetails = {
        room: room._id,
        user: currentUser._id,
        fromDate: moment(fromdate, "DD-MM-YYYY").format("YYYY-MM-DD"),
        toDate: moment(todate, "DD-MM-YYYY").format("YYYY-MM-DD"),
        totalAmount,
        totalDays,
        paymentId: response.razorpay_payment_id,
      };

      const result = await axios.post("/api/bookings/bookroom", bookingDetails);

      if (result.data.status === "success") {
        Swal.fire("Congratulations", "Room booked scuceefully", "sucess");
        navigate("/profile");
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      Swal.fire("OOPS", "Something went wrong", "error");
    } finally {
      setBookingInProgress(false);
    }
  };

  const bookRoom = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        alert("Please log in to book a room");
        return;
      }

      if (!validateDates()) {
        return;
      }

      setBookingInProgress(true);

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Room Booking",
        description: `${room.name} (${totalDays} days)`,
        handler: handlePaymentSuccess,
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => setBookingInProgress(false),
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating booking:", error);
      alert(error.response?.data?.message || "Failed to initiate booking");
      setBookingInProgress(false);
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
            style={{ marginTop: "30px" }}
            alt={room.name}
          />
        </div>
        <div className="col-md-5 right">
          <div style={{ textAlign: "right" }}>
            <h3 style={{ fontWeight: "700", marginBottom: "45px" }}>
              Booking Details
            </h3>
            <hr className="hrtag" />
            <b>
              <p>
                Name:{" "}
                {JSON.parse(localStorage.getItem("currentUser"))?.name ||
                  "Guest"}
              </p>
              <p>From Date: {fromdate}</p>
              <p>To Date: {todate}</p>
              <p>Max Count: {room.maxcount}</p>
            </b>
          </div>
          <div style={{ textAlign: "right" }}>
            <h3 style={{ fontWeight: "600" }}>Amount Details</h3>
            <hr className="hrtag" />
            <b>
              <p>Total Days: {totalDays}</p>
              <p>Rent Per Day: ₹{room.rentperday}</p>
              <p>Total Amount: ₹{totalAmount}</p>
            </b>
          </div>
          <div style={{ float: "right" }}>
            <button
              className="btn btn-primary"
              onClick={bookRoom}
              disabled={bookingInProgress || loading || error || !totalAmount}
            >
              {bookingInProgress ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingScreen;
