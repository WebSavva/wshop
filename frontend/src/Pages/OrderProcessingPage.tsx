import { Row, Container, Col } from "react-bootstrap";
import { useRouteMatch, Redirect, Route, Switch } from "react-router";
import AuthPage from "./AuthPage";
import OrderProcessStepper from "../Components/OrderProcessStepper";
import ShippingAddressForm from "./ShippingAddressPage";
import PaymentForm from "./PaymentPage";
import OrderSummaryPage from "./OrderSummaryPage";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../store/typed-hooks";

const OrderProcessingPage = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const { path } = useRouteMatch();
  const history = useHistory();

  if (!cartItems.length) history.replace("/cart");

  return (
    <Container className="p-3">
      <Row className="justify-content-center">
        <Col sm={8}>
          <OrderProcessStepper />
          <div className="pt-5">
            <Switch>
              <Route path={`${path}/authorization`}>
                <AuthPage redirect={`/buy/shipping`} />
              </Route>
              <Route path={`${path}/shipping`}>
                <ShippingAddressForm />
              </Route>
              <Route path={`${path}/payment`}>
                <PaymentForm />
              </Route>
              <Route path={`${path}/place`}>
                <OrderSummaryPage />
              </Route>
              <Route path="*">
                <Redirect to={`${path}/authorization?redirect=/buy/shipping`} />
              </Route>
            </Switch>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderProcessingPage;
