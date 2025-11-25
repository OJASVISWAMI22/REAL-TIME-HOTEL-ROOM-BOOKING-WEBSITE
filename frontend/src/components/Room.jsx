import { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
const Room = ({ room, fromdate, todate }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="room-card">
      <img src={room.imageurls[0]} className="room-card-img" />

      <div className="room-card-body">
        <h4 className="room-card-title">{room.name}</h4>

        <p>
          <b>Capacity:</b> {room.maxcount}
        </p>
        <p>
          <b>Price:</b> ₹{room.rentperday}
        </p>

        <div className="room-card-buttons">
          {fromdate && todate && (
            <Link to={`/book/${room._id}/${fromdate}/${todate}`}>
              <Button className="btn btn-dark">Book Now</Button>
            </Link>
          )}
          <button className="btn btn-dark" onClick={handleShow}>
            More
          </button>
        </div>
      </div>
      <Modal className="aww" show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel fade data-bs-theme="dark ">
            {room.imageurls.map((url) => {
              return (
                <Carousel.Item key={url}>
                  <img className="d-block w-100 bigimg" src={url} />
                </Carousel.Item>
              );
            })}
          </Carousel>
          <b>
            <div className="room-info">
              <p>
                <b>Rating:</b> {room.rating || "5 ★"}
              </p>
              <p>
                <b>Capacity:</b> {room.maxcount} people
              </p>
              <p>
                <b>Contact:</b> {room.phoneno}
              </p>
            </div>
          </b>
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
