import Spinner from "./Spinner";
import ReactDOM from "react-dom";

const ScreenLoader = () => {
  return ReactDOM.createPortal(
    <div className="fixed-top w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center">
      <Spinner parentCentered size={150} />
    </div>,
    document.getElementById("screen-blocker")!
  );
};

export default ScreenLoader;
