import { Card, ListGroup } from "react-bootstrap";

const OrderSummaryCard: React.FC<{
  summaryData: {
    [fieldName: string]: number;
  };
  footerContent: JSX.Element | null;
}> = ({ summaryData, footerContent }) => {
  const orderSummaryItems: JSX.Element[] = Object.entries(summaryData).map(
    ([fieldName, fieldValue]) => {
      return (
        <ListGroup.Item className="text-secondary align-items-center d-flex  py-3">
          <span className="w-50 text-capitalize">{fieldName} :</span>
          <span className="fs-8 fw-bold">${fieldValue.toFixed(2)}</span>
        </ListGroup.Item>
      );
    }
  );
  return (
    <div>
      <Card className="text-secondary">
        <Card.Header className="py-3">
          <h5 className="fs-4 fw-bold text-uppercase">Order Summary</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <ListGroup variant="flush" className="p-0">
            {orderSummaryItems}
          </ListGroup>
        </Card.Body>
        {footerContent && <Card.Footer>{footerContent}</Card.Footer>}
      </Card>
    </div>
  );
};

export default OrderSummaryCard;
