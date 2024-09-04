import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const BookingScreen = () => {
  const { roomid } = useParams();
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [room, setroom] = useState();

  useEffect(() => {
    const getroombyid = async () => {
      try {
        setloading(true);
        const data = (
          await axios.post("/api/rooms/getroombyid", { roomid: roomid })
        ).data;
        setroom(data.room);
        setloading(false);
      } catch (error) {
        seterror(true);
        setloading(false);
      }
    };
    getroombyid();
  }, []);

  return (
    <div className="imgbox bs">
      {loading ? (
        <h1>loading...</h1>
      ) : error ? (
        <h1>error...</h1>
      ) :room ? (
        <div>
          <div className="row mt-5 book left">
            <div className="col-md-5">
              <h3>{room.name}</h3>
              <img src={room.imageurls[0]} className="bigimg" style={{marginTop:'30px'}}/>
            </div>
            <div className="col-md-5 right">
              <div style={{textAlign:'right'}}>
              <h3 style={{fontWeight:'700',marginBottom:'45px'}}>Booking Details</h3>
              <hr className="hrtag"></hr>
              <b>
              <p>Name : </p>
              <p>From Date :</p>
              <p>To Date :</p>
              <p>Max Count : {room.maxcount}</p>
              </b>
              </div>
              <div style={{textAlign:'right'}}>
                <h4 style={{fontWeight:'600'}}>Billing</h4>
                <hr className="hrtag" />
                <b>
                  <p>Total Days : </p>
                  <p>Rent Per Day :{room.rentperday}</p>
                  <p>Total Amount :</p>
                </b>
              </div>
              <div style={{float:'right'}}>
                <button className="btn btn-danger">Pay Now</button>
              </div>
            </div>
          </div>
        </div>
      ): (
      <h1>No room data found.</h1>  // Display a message if room data is missing
    )}
     </div>
  )
};
export default BookingScreen;
