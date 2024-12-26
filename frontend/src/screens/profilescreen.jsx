import { Tabs } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loader from "../components/Loader";
import Error from "../components/Error";
const Profilescreen = () => {
  const user=JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, []);

  const items = [
    {
      key: '1',
      label: 'Profile',
      children: <div className='imgbox'>
        <h1>My Profile</h1>
        <hr />
        <h2>Name : {user?.name}</h2>
        <h2>Email : {user?.email}</h2>
        <h2>Admin : {user?.isadmin ? "Yes" : "No"}</h2>
      </div>
    },
    {
      key: '2',
      label: 'Bookings',
      children: <Mybooking/>,
    },
  ];

  return (
    <div style={{ margin: '35px 50px 0 50px' }}>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default Profilescreen;

const Mybooking = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('currentUser')));
  const [bookings,setbookings]=useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await axios.post('/api/bookings/getbooking', { userid: user._id });
        console.log(response.data);
        setbookings(response.data)
        setLoading(false)
      } catch (error) {
        console.error(error);
        setLoading(false)
        setError(true)
        alert("Something Went Wrong");
      }

    };

    fetchBookings();
  }, []);

  return (
    <>
    <div className="row">
      <div className="col-md-8">
         {loading &&<Loader/>}
         {
          bookings && bookings.map(booking=>{
            return <div className='imgbox'>
              <h3>{booking.room}</h3>
              <p><b>Booking Id : </b>{booking._id}</p>
              <p><b>Check In : </b>{booking.fromdate}</p>
              <p><b>Check Out : </b>{booking.todate}</p>
              <p><b>Amount : </b>{booking.totalamount}</p>
              <p><b>Status : </b>{booking.status=="booked"?"Confirmed":"Cancelled"}</p>
              <button className='btn btn-danger left'>Cancel Booking</button>
            </div>
          })
         }
      </div>
    </div>
    </>
  );
};