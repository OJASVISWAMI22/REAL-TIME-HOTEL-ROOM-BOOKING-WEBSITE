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

  const filterbydate = (dates) => {
    // Check if dates are valid and convert to moment objects if they aren't
    if (!dates || dates.length !== 2) {
      setrooms(duplicateroom);
      return;
    }

    // Ensure we're working with moment objects
    const startDate = moment(dates[0]);
    const endDate = moment(dates[1]);

    // Set fromdate and todate using moment's format method
    setfromdate(startDate.format("DD-MM-YYYY"));
    settodate(endDate.format("DD-MM-YYYY"));
    
    var temproom = [];
    for (const room of duplicateroom) {
      var available = false;
      if (room.currentbooking.length > 0) {
        for (const booking of room.currentbooking) {
          // Parse booking dates as moment objects
          const bookingFromDate = moment(booking.fromdate, "DD-MM-YYYY");
          const bookingToDate = moment(booking.todate, "DD-MM-YYYY");

          // Check if the selected dates overlap with existing bookings
          const isOverlapping = 
            startDate.isBetween(bookingFromDate, bookingToDate, null, '[]') ||
            endDate.isBetween(bookingFromDate, bookingToDate, null, '[]') ||
            bookingFromDate.isBetween(startDate, endDate, null, '[]');

          if (!isOverlapping) {
            available = true;
          } else {
            available = false;
            break;
          }
        }
      } else {
        available = true;
      }

      if (available) {
        temproom.push(room);
      }
    }
    
    setrooms(temproom);
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
        ) : rooms.length > 0 ? (
          rooms.map((room) => {
            return (
              <div className="col-md-9 mt-4" key={room.name}>
                <Room room={room} fromdate={fromdate} todate={todate} />
              </div>
            );
          })
        ) : (
          <Error message={"No Rooms Available"} />
        )}
      </div>
    </div>
  );
};

export default Homescreen;