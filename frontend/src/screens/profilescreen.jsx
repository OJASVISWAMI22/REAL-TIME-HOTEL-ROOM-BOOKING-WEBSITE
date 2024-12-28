import { Tabs, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
const api = axios.create({
  baseURL: 'https://real-time-hotel-room-booking-website.onrender.com'
});

const Profilescreen = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("1");

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  const cancelbooking = async (bookingid, roomid) => {
    try {
      setLoading(true);
      const result = await api.post("/api/bookings/cancelbooking", {
        bookingid,
        roomid,
      });

      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your booking was cancelled",
        "success"
      ).then((result) => {
        window.location.href = "/profile";
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("OOPS", "Something went wrong.Room wasn't cancelled", "error");
    }
  };
  const items = [
    {
      key: "2",
      label: "Profile",
      children: (
        <div className="imgbox wer">
          <h1>My Profile</h1>
          <hr />
          <h2>Name : {user?.name}</h2>
          <h2>Email : {user?.email}</h2>
          <h2>Admin : {user?.isadmin ? "Yes" : "No"}</h2>
        </div>
      ),
    },
    {
      key: "1",
      label: "Bookings",
      children: <Mybooking onCancelBooking={cancelbooking} />,
    },
  ];
  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  return (
    <div style={{ margin: "35px 50px 0 50px" }}>
      <Tabs
        activeKey={activeKey}
        centered
        onChange={handleTabChange}
        items={items}
      />
    </div>
  );
};

const Mybooking = ({ onCancelBooking }) => {
  const [user] = useState(JSON.parse(localStorage.getItem("currentUser")));
  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.post("/api/bookings/getbooking", {
          userid: user._id,
        });
        setbookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(true);
        alert("Something Went Wrong");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="row mb-5 wer">
      <div className="col-md-12">
        {loading && <Loader />}
        {bookings &&
          bookings.map((booking) => (
            <div className="imgbox ppp" key={booking._id}>
              <h3>{booking.room}</h3>
              <hr />
              <p>
                <b>Booking Id : </b>
                {booking._id}
              </p>
              <p>
                <b>Check In : </b>
                {booking.fromdate}
              </p>
              <p>
                <b>Check Out : </b>
                {booking.todate}
              </p>
              <p>
                <b>Amount : </b>
                {booking.totalamount}
              </p>
              <p>
                <b>Status : </b>
                {booking.status === "booked" ? (
                  <Tag color="green">Confirmed</Tag>
                ) : (
                  <Tag color="red">Cancelled</Tag>
                )}
              </p>
              {booking.status == "booked" && (
                <button
                  className="btn btn-danger w"
                  onClick={() => onCancelBooking(booking._id, booking.roomid)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profilescreen;
