import { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
const Room = ({ room ,fromdate,todate}) => {
  const [show, setShow] = useState(false);
 
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="row imgbox">
      <div className="col-md-4">
        <img src={room.imageurls[0]} className="smallimg" />
      </div>
      <div className="col-md-7 text-left content">
        <h4>{room.name}</h4>
        <b>
          <p>Capacity : {room.maxcount}</p>
          <p>Contact Us :{room.phoneno}</p>
          <p>Rent Per Day :{room.rentperday}</p>
        </b>
        <div style={{ float: "right" }}>
          {
            (fromdate && todate) &&(
              <Link to={`/book/${room._id}/${fromdate}/${todate}`}>
            <Button className="btn btn-dark btn">Book Now</Button>
          </Link>
            )
          }
          <button className="btn btn-dark btn" onClick={handleShow}>
            About
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel fade data-bs-theme="dark">
            {room.imageurls.map((url) => {
              return (
                <Carousel.Item key={url}>
                  <img className="d-block w-100 bigimg" src={url} />
                </Carousel.Item>
              );
            })}
          </Carousel>
          <b>{room.description}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Room;
