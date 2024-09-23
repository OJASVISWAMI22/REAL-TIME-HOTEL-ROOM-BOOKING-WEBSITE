import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
const BookingScreen = () => {
  const { roomid ,fromdate,todate} = useParams();
  const fromMoment = moment(fromdate, 'DD-MM-YYYY');
  const toMoment = moment(todate, 'DD-MM-YYYY');
  const duration = moment.duration(toMoment.diff(fromMoment));
  const totalDays = duration.asDays();
  const totaldays=totalDays+1;
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
      {loading ? (<Loader/>) :room ? (
        <div>
          <div className="row mt-5 book left">
            <div className="col-md-5">
              <h3>{room.name}</h3>
              <img src={room.imageurls[0]} className="bigimg iii" style={{marginTop:'30px'}}/>
            </div>
            <div className="col-md-5 right">
              <div style={{textAlign:'right'}}>
              <h3 style={{fontWeight:'700',marginBottom:'45px'}}>Booking Details</h3>
              <hr className="hrtag"></hr>
              <b>
              <p>Name : </p>
              <p>From Date : {fromdate}</p>
              <p>To Date : {todate}</p>
              <p>Max Count : {room.maxcount}</p>
              </b>
              </div>
              <div style={{textAlign:'right'}}>
                <h4 style={{fontWeight:'600'}}>Billing</h4>
                <hr className="hrtag" />
                <b>
                  <p>Total Days : {totaldays}</p>
                  <p>Rent Per Day : {room.rentperday}</p>
                  <p>Total Amount : {room.rentperday*totaldays}</p>
                </b>
              </div>
              <div style={{float:'right'}}>
                <button className="btn btn-danger">Pay Now</button>
              </div>
            </div>
          </div>
        </div>
      ):error ? (
         <Error/>
    ):(<h1>Nothing to show</h1>)
       }</div>
  )
};
export default BookingScreen;
