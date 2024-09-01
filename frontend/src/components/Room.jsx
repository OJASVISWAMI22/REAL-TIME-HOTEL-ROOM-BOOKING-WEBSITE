import { useState } from "react";
import {Modal,Button} from 'react-bootstrap'
const Room=({room})=>{
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return(
    <div className="row imgbox">
      <div className="col-md-4">
        <img src={room.imageurls[0]} className="smallimg" />
      </div>
      <div className="col-md-7 text-left content">
        <h4>{room.name}</h4>
        <b><p>Capacity : {room.maxcount}</p>
        <p>Contact Us :{room.phoneno}</p>
        <p>Rent Per Day :{room.rentperday}</p></b>
        <div style={{float:'right'}}>
          <button className="btn btn-dark" onClick={handleShow}>About</button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{room.description}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    
  )
}
export default Room;
