import { useEffect } from "react";
import useHttp from "../hooks/useHttp";
import { IOrder } from "../types/Order";
import Message from "./UI/Message";
import { useAppSelector } from "../store/typed-hooks";
import { Table, Button } from "react-bootstrap";
import Spinner from "./UI/Spinner";
import { LinkContainer } from "react-router-bootstrap";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrdersTable = () => {
  const {
    isFetching: isLoading,
    sendRequest,
    error,
    fetchedData: ordersData,
  } = useHttp<IOrder[]>();
  const authUserInfo = useAppSelector((state) => state.auth.data);

  useEffect(() => {
    if (authUserInfo) {
      sendRequest({
        url: "api/orders/",
        config: {
          headers: {
            Authorization: `Bearer ${authUserInfo.token}`,
          },
        },
      });
    }
  }, [sendRequest, authUserInfo]);

  if (error) {
    return <Message>{error}</Message>;
  } else if (isLoading) {
    return <Spinner size={150} />;
  } else if (ordersData?.length) {
    return (
      <Table responsive bordered striped hover>
        <thead>
          <tr className="text-uppercase">
            <th>order id</th>
            <th>date</th>
            <th>total</th>
            <th>paid</th>
            <th>delivered</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ordersData.map((orderData) => (
            <tr>
              <td>{orderData.id}</td>
              <td>{new Date(orderData.createdAt).toLocaleDateString()}</td>
              <td>${orderData.totalPrice.toFixed(2)}</td>
              <td>
                {orderData.isPaid && orderData.paidAt ? (
                  new Date(orderData.paidAt).toLocaleDateString()
                ) : (
                  <FontAwesomeIcon
                    className="text-danger d-block mx-auto"
                    icon={faTimesCircle}
                  />
                )}
              </td>
              <td>
                {orderData.isDelivered && orderData.deliveredAt ? (
                  new Date(orderData.createdAt).toLocaleDateString()
                ) : (
                  <FontAwesomeIcon
                    className="text-danger d-block mx-auto"
                    icon={faTimesCircle}
                  />
                )}
              </td>
              <td>
                <LinkContainer to={`/orders/${orderData.id}`}>
                  <Button className="text-uppercase w-100 bg-white text-dark">
                    Details
                  </Button>
                </LinkContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  } else {
    return <h5 className="mt-4 lead">No orders made yeat ...</h5>;
  }
};

export default OrdersTable;
