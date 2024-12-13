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
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicateroom, setduplicateroom] = useState([]);
  useEffect(() => {
    const getroom = async () => {
      try {
        setloading(true);
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setrooms(data.rooms);
        setduplicateroom(data.rooms);
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

      setfromdate(dates[0].format("DD-MM-YYYY"));
      settodate(dates[1].format("DD-MM-YYYY"));
    
    var temproom = [];
    for (const room of duplicateroom) {
      var available = false;
      if (room.currentbooking.length > 0) {
        for (const booking of room.currentbooking) {
          if (
            !moment(
              moment(dates[0].format("DD-MM-YYYY")).isBetween(
                booking.fromdate,
                booking.todate
              )
            ) &&
            !moment(
              moment(dates[1].format("DD-MM-YYYY")).isBetween(
                booking.fromdate,
                booking.todate
              )
            )
          ) {
            if (
              moment(dates[0].format("DD-MM-YYYY")) !== booking.fromdate &&
              moment(dates[0].format("DD-MM-YYYY")) !== booking.todate &&
              moment(dates[1].format("DD-MM-YYYY")) !== booking.fromdate &&
              moment(dates[1].format("DD-MM-YYYY")) !== booking.todate
            ) {
              available = true;
            }
          }
        }
      }
      if (available == true || room.currentbooking.length == 0) {
        temproom.push(room);
      }
      setrooms(temproom);
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
          <Error message={"Something Went Wrong"} />
        )}
      </div>
    </div>
  );
};

export default Homescreen;
