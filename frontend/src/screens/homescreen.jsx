import React,{useState,useEffect} from 'react'
import axios from 'axios'
const Homescreen=()=>{

  const [rooms,setrooms]=useState([]);

  useEffect(()=>{
    const getroom=async()=>{
    try {
      const data=(await (axios.get("/api/rooms/getallrooms"))).data;
      setrooms(data);
    } catch (error) {
      console.log(error);
    }
  }
  getroom();
}
  ,[])
  return(
    <>
    <h1>Home Screen</h1>
    </>
  )
}

export default Homescreen;
