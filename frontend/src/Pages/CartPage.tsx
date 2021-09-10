import {
  Col,
  Row,
  Container,
  Card,
  ListGroup,
  ListGroupItem,
  Alert,
  Button,
} from "react-bootstrap";
import { useAppSelector } from "../store/typed-hooks";
import CartItem from "../Components/CartItem";
import { useHistory } from "react-router";
import Head from "../Components/Head";

const CartPage = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const history = useHistory();

  let isCheckoutDisabled: boolean = !cartItems.length;

  const onCheckoutProceedHandler = () => {
    if (!isCheckoutDisabled) history.push("/buy");
  };

  let cartContent: JSX.Element | JSX.Element[] | null = null;
  let totalAmount = 0,
    averagePrice = 0,
    totalSum = 0;
  if (cartItems.length > 0) {
    let cartListItems = cartItems.map((productData) => {
      totalAmount += productData.quantity;
      averagePrice += productData.price;
      totalSum += productData.quantity * productData.price;

      return <CartItem key={productData.id} {...productData} />;
    });
    cartContent = <ListGroup variant="flush">{cartListItems}</ListGroup>;
    averagePrice = +(averagePrice / cartItems.length).toFixed(2);
  } else {
    cartContent = (
      <Alert className="py-5 bg-opacity-75 bg-danger fw-bold">
        Your shopping cart is empty.{" "}
        <span onClick={() => history.goBack()} className="cursor-pointer">
          <u>Go back</u>
        </span>
      </Alert>
    );
  }
  return (
    <>
      <Head title="W-Shop | Cart" />
      <Container className="fading-in">
        <Row>
          <Col key="left-cart" md={8} className="px-lg-5">
            <h5 className="fs-4 text-uppercase mb-3 fw-light">Shopping Cart</h5>
            <div className="">{cartContent}</div>
          </Col>
          <Col key="right-cart" md={4}>
            <Card>
              <Card.Header>
                <Card.Title>
                  <h5 className="pt-2 fw-bold">Summary</h5>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroupItem className=" mb-2">
                    <span className="me-2 fw-light">Total amount:</span>
                    <span className="text-dark text-opacity-75 fw-bold">
                      {totalAmount}
                    </span>
                  </ListGroupItem>
                  <ListGroupItem className="">
                    <span className="me-2 fw-light">Average Price:</span>
                    <span className="text-dark text-opacity-75 fw-bold">
                      ${averagePrice}
                    </span>
                  </ListGroupItem>
                </ListGroup>
              </Card.Body>
              <Card.Footer className="py-3 d-flex align-items-center justify-content-between flex-wrap">
                <div className="d-flex align-items-baseline ">
                  <h5 className="pt-2 fw-light me-3">Total:</h5>
                  <h5 className=" fw-bold">${totalSum.toFixed(2)}</h5>
                </div>
                <Button
                  variant="dark"
                  className="fs-11 mt-2 mt-sm-0 mx-auto mx-sm-0"
                  disabled={isCheckoutDisabled}
                  onClick={onCheckoutProceedHandler}
                >
                  Proceed To Checkout
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CartPage;
