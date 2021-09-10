import { useAppSelector } from "../store/typed-hooks";
import { Row, Col, Button, ListGroup, Alert } from "react-bootstrap";
import OrderInfoBar from "../Components/OrderInfoBar";
import OrderItemCard from "../Components/OrderItemCard";
import OrderSummaryCard from "../Components/OrderSummaryCard";
import { capitalize } from "lodash";
import { IOrder, IOrderItem } from "./../types/Order";
import useHttp from "../hooks/useHttp";
import ScreenLoader from "../Components/UI/ScreenLoader";
import Notification from "../Components/UI/Notification";
import { useHistory } from "react-router";
import Head from "../Components/Head";
import { useAppDispatch } from "../store/typed-hooks";
import { actionCreatorEmptyOutCart } from "../store/cart_slice";

const OrderSummaryPage = () => {
  const { cartItems, shippingAddress, paymentMethod } = useAppSelector(
    (state) => state.cart
  );
  const dispatch = useAppDispatch();
  const history = useHistory();
  const authUserInfo = useAppSelector((state) => state.auth.data);
  const complaints: string[] = [];
  const {
    isFetching: isOrderLoading,
    error: orderRequestError,
    sendRequest: saveOrderRequest,
  } = useHttp<IOrder>();

  if (!authUserInfo) {
    complaints.push("You have not been authenticated");
  }

  let formattedShippingAddress: string;
  if (Object.keys(shippingAddress).length) {
    formattedShippingAddress = Object.values(shippingAddress).join(", ");
  } else {
    formattedShippingAddress = "-";
    complaints.push("No shipping address is provided");
  }

  //BUILDING UP ORDER ITEMS
  const orderItems = cartItems.map((itemData) => (
    <OrderItemCard
      itemData={{
        image: itemData.image,
        name: itemData.name,
        price: itemData.price,
        product: itemData.id,
        qty: itemData.quantity,
      }}
    />
  ));

  //FILLING UP SUMMARY DATA
  const summaryData = cartItems.reduce(
    (accSummary, itemData) => {
      const crudeSum = itemData.price * itemData.quantity;
      return {
        ...accSummary,
        items: accSummary.items + crudeSum,
        tax: accSummary.tax + crudeSum * 0.2,
        total: accSummary.total + 1.2 * crudeSum,
      };
    },
    {
      items: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    }
  );

  let isPlaceOrderAllowed: boolean = complaints.length === 0;

  const placeOrderHandler = () => {
    if (isPlaceOrderAllowed && authUserInfo) {
      const transformedOrderItems = cartItems.map((itemData) => ({
        image: itemData.image,
        product: itemData.id,
        name: itemData.name,
        qty: itemData.quantity,
        price: itemData.price,
      })) as IOrderItem[];
      const requestOrderData = {
        shippingAddress,
        user: authUserInfo.id,
        shippingPrice: summaryData.shipping,
        paymentMethod: paymentMethod,
        taxPrice: summaryData.tax,
        totalPrice: summaryData.total,
        orderItems: transformedOrderItems,
      };
      saveOrderRequest(
        {
          url: "api/orders/",
          config: {
            body: JSON.stringify(requestOrderData),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authUserInfo.token}`,
            },
          },
        },
        (newOrder) => {
          dispatch(actionCreatorEmptyOutCart());
          history.replace(`/orders/${newOrder.id}`);
        }
      );
    }
  };

  const sumbitBtn = (
    <Button
      variant="dark"
      className="text-uppercase w-100"
      disabled={!isPlaceOrderAllowed}
      onClick={placeOrderHandler}
    >
      Place Order
    </Button>
  );

  return (
    <>
      <Head title="W-SHOP | Order Summary" />
      <Row className="fading-in">
        {isOrderLoading && <ScreenLoader />}
        <Col xl={8}>
          <ListGroup variant="flush">
            {authUserInfo && (
              <OrderInfoBar
                headerText="customer"
                fields={[
                  {
                    fieldName: "email address",
                    fieldValue: authUserInfo.email,
                  },
                  {
                    fieldName: "user name",
                    fieldValue: authUserInfo.name,
                  },
                ]}
              />
            )}
            <OrderInfoBar
              headerText="Shipping"
              fields={[
                {
                  fieldName: "address",
                  fieldValue: formattedShippingAddress,
                },
              ]}
            />
            <OrderInfoBar
              headerText="Payment"
              fields={[
                {
                  fieldName: "method",
                  fieldValue: capitalize(paymentMethod),
                },
              ]}
            />
            <OrderInfoBar headerText="Order Items">
              <ListGroup variant="flush">{orderItems}</ListGroup>
            </OrderInfoBar>
          </ListGroup>
        </Col>
        <Col xl={4}>
          <OrderSummaryCard
            summaryData={summaryData}
            footerContent={sumbitBtn}
          />
          {!isPlaceOrderAllowed && (
            <Alert variant="danger" className="mt-3 fs-10">
              <p>You cannot place your order due to the following reasons:</p>
              <ul>
                {complaints.map((complaintText) => (
                  <li key={complaintText}>{complaintText}</li>
                ))}
              </ul>
            </Alert>
          )}
          {orderRequestError && (
            <div className="mt-2">
              <Notification isError message={orderRequestError} />
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

export default OrderSummaryPage;
