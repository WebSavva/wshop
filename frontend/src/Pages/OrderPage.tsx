import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { useParams } from "react-router";
import { useState, useCallback } from "react";
import OrderInfoBar from "../Components/OrderInfoBar";
import OrderSummaryCard from "../Components/OrderSummaryCard";
import useHttp from "../hooks/useHttp";
import { IOrder } from "../types/Order";
import Spinner from "./../Components/UI/ScreenLoader";
import { useEffect } from "react";
import { useAppSelector } from "../store/typed-hooks";
import OrderItemCard from "../Components/OrderItemCard";
import usePaypalPayment from "../hooks/usePaypalPayment";
import { PayPalButton } from "react-paypal-button-v2";
import ScreenLoader from "./../Components/UI/ScreenLoader";
import Message from "../Components/UI/Message";
import Notification from "../Components/UI/Notification";

const OrderPage = () => {
  const { id: orderId } = useParams<{ id?: string }>();
  const authUserInfo = useAppSelector((state) => state.auth.data);
  const {
    isFetching: isOrderLoading,
    fetchedData: orderData,
    error: orderFetchError,
    sendRequest: fetchOrder,
  } = useHttp<IOrder>();
  const [isOrderPaid, setIsOrderPaid] = useState<boolean | null>(null);
  const [isOrderDelivered, setIsOrderDelivered] = useState<boolean | null>(
    null
  );
  const isSDKReady = usePaypalPayment(isOrderPaid);
  const setPaymentStatus = useCallback(
    (paymentStatus: boolean) => setIsOrderPaid(paymentStatus),
    []
  );
  const setDeliveryStatus = useCallback(
    (paymentStatus: boolean) => setIsOrderDelivered(paymentStatus),
    []
  );

  const {
    isFetching: isOrderPaying,
    error: paymentError,
    sendRequest: sendPayRequest,
  } = useHttp<boolean>();
  const {
    isFetching: isOrderDelivering,
    error: deliveryError,
    sendRequest: sendDeliveryRequest,
  } = useHttp<boolean>();

  const confirmOrderPayment = (paymentResult: Object) => {
    if (authUserInfo && orderId) {
      sendPayRequest(
        {
          url: `api/orders/${orderId}/pay`,
          config: {
            method: "POST",
            body: JSON.stringify(paymentResult),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authUserInfo.token}`,
            },
          },
        },
        setPaymentStatus
      );
    }
  };

  const confirmOrderDelivery = () => {
    if (authUserInfo && orderId && authUserInfo.isAdmin) {
      sendDeliveryRequest(
        {
          url: `api/admin/orders/${orderId}/deliver`,
          config: {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${authUserInfo.token}`,
            },
          },
        },
        setDeliveryStatus
      );
    }
  };

  useEffect(() => {
    if (!orderData) {
      fetchOrder(
        {
          url: `api/orders/${orderId}`,
          config: {
            headers: {
              Authorization: `Bearer ${authUserInfo?.token}`,
            },
          },
        },
        (orderData) => {
          setPaymentStatus(orderData.isPaid);
          setDeliveryStatus(orderData.isDelivered);
        }
      );
    }
  }, [
    orderId,
    fetchOrder,
    authUserInfo,
    setPaymentStatus,
    setDeliveryStatus,
    orderData,
  ]);

  let orderContent: JSX.Element | null = null;
  if (isOrderLoading) {
    orderContent = <Spinner />;
  } else if (orderData && authUserInfo) {
    const summaryData = {
      items:
        orderData.totalPrice - orderData.taxPrice - orderData.shippingPrice,
      shipment: orderData.shippingPrice,
      tax: orderData.taxPrice,
      total: orderData.totalPrice,
    };

    const paidNotification = {
      isError: !isOrderPaid,
      text: `Your order has ${!isOrderPaid ? "not" : ""} been paid`,
    };

    const deliveryNotification = {
      isError: !isOrderDelivered,
      text: `Your order has ${!isOrderDelivered ? "not" : ""} been delivered`,
    };

    let cardFooterContent: JSX.Element | null;
    if (isSDKReady && !isOrderPaid && isOrderPaid !== null) {
      cardFooterContent = (
        <PayPalButton
          onSuccess={confirmOrderPayment}
          amount={+orderData.totalPrice.toFixed(2)}
        />
      );
    } else {
      cardFooterContent = null;
    }

    orderContent = (
      <>
        <h3 className="fw-light fs-4 text-uppercase">
          Order Id {orderData.id}
        </h3>
        {(isOrderPaying || isOrderDelivering) && <ScreenLoader />}
        <Row className="p-xl-4">
          <Col xl={8} className="px-xl-5">
            <ListGroup variant="flush">
              <OrderInfoBar
                headerText="details"
                fields={[
                  {
                    fieldName: "address",
                    fieldValue: Object.values(orderData.shippingAddress).join(
                      ", "
                    ),
                  },
                  {
                    fieldName: "email address",
                    fieldValue: (
                      <a href={`mailto:${orderData?.user?.email ?? "#"}`}>
                        {orderData?.user?.email ?? "-"}
                      </a>
                    ),
                  },
                  {
                    fieldName: "user name",
                    fieldValue: orderData?.user?.name ?? "-",
                  },
                  {
                    fieldName: "created at",
                    fieldValue: new Date(orderData.createdAt).toLocaleString(),
                  },
                ]}
                notification={deliveryNotification}
              />
              <OrderInfoBar
                headerText="payment"
                fields={[
                  {
                    fieldName: "method",
                    fieldValue: orderData.paymentMethod.toUpperCase(),
                  },
                ]}
                notification={paidNotification}
              />
              <OrderInfoBar headerText="Order items">
                <ListGroup variant="flush">
                  {orderData.orderItems.map((itemData) => (
                    <OrderItemCard itemData={itemData} />
                  ))}
                </ListGroup>
              </OrderInfoBar>
            </ListGroup>
          </Col>
          <Col xl={4}>
            <OrderSummaryCard
              summaryData={summaryData}
              footerContent={cardFooterContent}
            />
            {authUserInfo.isAdmin && !isOrderDelivered && (
              <Button
                className="d-block w-100 py-2 mx-auto mt-3"
                variant="dark"
                onClick={confirmOrderDelivery}
              >
                Confirm Delivery
              </Button>
            )}
            {paymentError && (
              <div className="d-flex mt-3 justify-content-center">
                <Notification
                  isError
                  message={paymentError + "Contact our support service."}
                />
              </div>
            )}
            {deliveryError && (
              <div className="d-flex mt-3 justify-content-center">
                <Notification
                  isError
                  message={deliveryError + ". Contact our support service."}
                />
              </div>
            )}
          </Col>
        </Row>
      </>
    );
  } else if (orderFetchError) {
    orderContent = <Message>{orderFetchError}</Message>;
  }

  return <Container>{orderContent}</Container>;
};

export default OrderPage;
