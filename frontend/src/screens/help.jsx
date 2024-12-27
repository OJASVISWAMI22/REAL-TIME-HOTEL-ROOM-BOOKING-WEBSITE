const Help = () => {
  return (
    <div className="card imgbox ccc" style={{ width: "30rem" }}>
      <h1 className="text-center p-3">User Guide</h1>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <b>Step 1: Select Dates</b>
          <p>
            Choose your check-in and check-out dates from the calendar at the
            top of the homepage
          </p>
        </li>
        <li className="list-group-item">
          <b>Step 2: Browse Rooms</b>
          <p>
            Use the filter options to select your preferred room type (Deluxe,
            Standard, etc.)
          </p>
        </li>
        <li className="list-group-item">
          <b>Step 3: View Room Details</b>
          <p>
            Click on 'View Details' to see room amenities, photos, and complete
            information
          </p>
        </li>
        <li className="list-group-item">
          <b>Step 4: Book & Pay</b>
          <p>
            Click 'Book Now', review your selection, and proceed to payment to
            confirm your reservation
          </p>
        </li>
      </ul>
      <button
        className="btn btn-dark qwer "
        onClick={() => {
          window.location.href = "/home";
        }}
      >
        Continue to Site ...
      </button>
    </div>
  );
};

export default Help;
