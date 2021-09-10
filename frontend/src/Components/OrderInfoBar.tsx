import { ListGroup } from "react-bootstrap";
import Notification from "./UI/Notification";

const OrderInfoBar: React.FC<{
  notification?: {
    isError: boolean;
    text: string;
  };
  headerText: string;
  fields?: Array<{
    fieldName: string;
    fieldValue: string | JSX.Element;
  }>;
}> = ({ headerText, fields, notification, children }) => {
  return (
    <ListGroup.Item key={headerText} className="text-secondary mb-2">
      <h6 className="text-uppercase mb-3 fs-4">{headerText}</h6>
      {fields &&
        fields.map((fieldData) => (
          <p>
            <span className="me-2 text-capitalize">
              {fieldData.fieldName} :
            </span>
            <span>{fieldData.fieldValue}</span>
          </p>
        ))}
      {children}
      {notification && (
        <Notification
          message={notification.text}
          isError={notification.isError}
        />
      )}
    </ListGroup.Item>
  );
};

export default OrderInfoBar;
