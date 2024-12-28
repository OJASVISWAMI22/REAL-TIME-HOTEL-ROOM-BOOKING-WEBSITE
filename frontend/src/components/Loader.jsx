import { useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const Loader = () => {
  let [loading, setLoading] = useState(true);

  return (
    <div style={{ marginTop: "150px", marginLeft: "0vw" }}>
      <div className="sweet-loading text-center">
        <ScaleLoader color="#80deea" height={70} speedMultiplier={1.5} />
      </div>
    </div>
  );
};

export default Loader;
