import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import "antd/dist/reset.css";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import moment from "moment";
import { HiQuestionMarkCircle } from "react-icons/hi2";

const { RangePicker } = DatePicker;

const api = axios.create({
  baseURL: 'https://real-time-hotel-room-booking-website.onrender.com'
});


const Homescreen = () => {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState();
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicateroom, setduplicateroom] = useState([]);
  const [searchkey, setsearchkey] = useState("");
  const [type, settype] = useState("All");
  useEffect(() => {
    const getroom = async () => {
      try {
        setloading(true);
        const data = (await api.get("/api/rooms/getallrooms")).data;
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
      var available = true;
      if (room.currentbooking && room.currentbooking.length > 0) {
        for (const booking of room.currentbooking) {
          if (
            moment(dates[0].format("DD-MM-YYYY")).isBetween(
              booking.fromdate,
              booking.todate
            ) ||
            moment(dates[1].format("DD-MM-YYYY")).isBetween(
              booking.fromdate,
              booking.todate
            ) ||
            moment(dates[0].format("DD-MM-YYYY")) ===
              moment(booking.fromdate) ||
            moment(dates[0].format("DD-MM-YYYY")) === moment(booking.todate) ||
            moment(dates[1].format("DD-MM-YYYY")) ===
              moment(booking.fromdate) ||
            moment(dates[1].format("DD-MM-YYYY")) === moment(booking.todate)
          ) {
            available = false;
            break;
          }
        }
      }
      if (available) {
        temproom.push(room);
      }
    }
    setrooms(temproom);
  };
  const filterbysearch = () => {
    const temprooms = duplicateroom.filter((room) =>
      room.name.toLowerCase().includes(searchkey.toLowerCase())
    );
    setrooms(temprooms);
  };
  const filterbytype = (e) => {
    settype(e);
    if (e !== "All") {
      const temprooms = duplicateroom.filter((room) => room.type == e);
      setrooms(temprooms);
    } else {
      setrooms(duplicateroom);
    }
  };
  return (
    <>
      <div>
        <HiQuestionMarkCircle
          className="question"
          onClick={() => {
            window.location.href = "/help";
          }}
        />
      </div>
      <div className="container">
        <div className="row mt-3 imgbox ">
          <div className="col-md-4">
            <RangePicker
              className="won"
              format="DD-MM-YYYY"
              onChange={filterbydate}
              disabledDate={(current) => {
                return current && current < moment().startOf("day");
              }}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search Rooms"
              value={searchkey}
              onChange={(e) => {
                setsearchkey(e.target.value);
              }}
              onKeyUp={filterbysearch}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-control"
              value={type}
              onChange={(e) => {
                filterbytype(e.target.value);
              }}
            >
              <option value="All">All</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Standard">Standard</option>
              <option value="Suite">Suite</option>
            </select>
          </div>
        </div>
        <div className="row justify-content-center mt-3">
          {loading ? (
            <Loader />
          ) : (
            rooms.map((room) => {
              return (
                <div className="col-md-8 mt-4" key={room._id}>
                  <Room room={room} fromdate={fromdate} todate={todate} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Homescreen;
