import { useState} from "react";
import HashLoader from "react-spinners/HashLoader";

const Loader=()=>{

  let [loading, setLoading] = useState(true);
 
  return (
    <div style={{marginTop:'150px',marginLeft:'65vw'}}>
    <div className="sweet-loading text-center">
      
      <HashLoader
        color='#000'
        loading={loading}
        css=' '
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
    </div>
  )
}

export default Loader;