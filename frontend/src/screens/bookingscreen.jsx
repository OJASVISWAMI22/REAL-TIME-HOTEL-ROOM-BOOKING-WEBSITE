import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";

const BookingScreen = () => {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const navigate = useNavigate();

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

    const bookingDetails = {
      room: {
        name: room.name,
        _id: room._id
      },
      userid: currentUser._id,
      fromdate,
      todate,
      totalamount: totalAmount,
      totaldays: totalDays,
      transactionid: 'TXN' + Math.floor(Math.random() * 1000000)
    };

    try {
      setLoading(true);
      const result = await axios.post('/api/bookings/bookroom', bookingDetails);
      setLoading(false);
      alert("Room booked successfully");
      navigate('/bookings');
    } catch (error) {
      setLoading(false);
      console.error("Error booking room:", error.response?.data?.message || error.message);
      setError(true);
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
          <img src={room.imageurls[0]} className="bigimg iii" style={{marginTop:'30px'}} alt={room.name} />
        </div>
        <div className="col-md-5 right">
          <div style={{textAlign:'right'}}>
            <h3 style={{fontWeight:'700',marginBottom:'45px'}}>Booking Details</h3>
            <hr className="hrtag" />
            <b>
              <p>Name : {JSON.parse(localStorage.getItem('currentUser'))?.name || 'Guest'}</p>
              <p>From Date : {fromdate}</p>
              <p>To Date : {todate}</p>
              <p>Max Count : {room.maxcount}</p>
            </b>
          </div>
          <div style={{textAlign:'right'}}>
            <h4 style={{fontWeight:'600'}}>Billing</h4>
            <hr className="hrtag" />
            <b>
              <p>Total Days : {totalDays}</p>
              <p>Rent Per Day : {room.rentperday}</p>
              <p>Total Amount : {totalAmount}</p>
            </b>
          </div>
          <div style={{float:'right'}}>
            <button className="btn btn-dark" onClick={bookRoom}>Pay Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingScreen;