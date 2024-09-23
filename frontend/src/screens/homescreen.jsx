import React, { useState, useEffect } from "react";
import { DatePicker, Space } from "antd";
import "antd/dist/reset.css";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
const { RangePicker } = DatePicker;
const Homescreen = () => {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState();
  const [fromdate,setfromdate]=useState();
  const [todate,settodate]=useState();
  useEffect(() => {
    const getroom = async () => {
      try {
        setloading(true);
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setrooms(data.rooms);
        setloading(false);
      } catch (error) {
        seterror(true);
        console.log(error);
        setloading(false);
      }
    };
    getroom();
  }, []);
  const filterbydate = (dates, dateStrings) => {
    if (dates) {
      // console.log('Formatted Selected Time: ', dateStrings);
      // console.log('Start Date:', dateStrings[0]);
      // console.log('End Date:', dateStrings[1]);
      
      // console.log('Moment Start Date:', dates[0].format('DD-MM-YYYY'));
      // console.log('Moment End Date:', dates[1].format('DD-MM-YYYY'));
      setfromdate(dates[0].format('DD-MM-YYYY'))
      settodate(dates[1].format('DD-MM-YYYY'))
    } 
  };
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterbydate} />
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : rooms.length > 1 ? (
          rooms.map((room) => {
            return (
              <div className="col-md-9 mt-4" key={room.name}>
                <Room room={room} fromdate={fromdate} todate={todate} />
              </div>
            );
          })
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
};

export default Homescreen;
