import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
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
        {loading ? (<Loader/>) : rooms.length>1 ? (
          rooms.map((room) => {
            return <div className="col-md-9 mt-4" key={room.name}>
                <Room room={room} />
              </div>
          })
         ) : (<Error/>)
      }
      </div>
    </div>
  );
};

export default Homescreen;
