const Landing = () => {
  return (
    <div className="land">
      <div className="rrrr">
        <h1 className="von">Travel Nest</h1>
        <img className="hh" src="favicon.png" alt="" />
      </div>
      <h3>" Where Luxury Meets Leisure, Every Stay Becomes a Story ... "</h3>
      <button
        className="btn btn-primary laka"
        onClick={() => {
          window.location.href = "/home";
        }}
      >
        Continue to site ...
      </button>
    </div>
  );
};
export default Landing;
