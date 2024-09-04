import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
const Homescreen = () => {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState();
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
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        {loading ? (
          <h1>loading...</h1>
        ) : error ? (
          <h1>error...</h1>
        ) : (
          rooms.map((room) => {
            return (
              <div className="col-md-9 mt-4" key={room.name}>
                <Room room={room} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Homescreen;
