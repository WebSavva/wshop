import { Alert } from "react-bootstrap";

const Message: React.FC = ({ children }) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <Alert variant="danger" className="w-50 m-5 p-5 fs-5 fw-lighter">
        {children}
      </Alert>
    </div>
  );
};

export default Message;
