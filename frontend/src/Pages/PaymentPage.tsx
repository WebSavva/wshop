import { Form, Button } from "react-bootstrap";
import { faPaypal, faStripeS } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router";
import { useAppDispatch } from "../store/typed-hooks";
import { cartActions } from "../store/cart_slice";
import { MethodPaymentType } from "../types/ReduxStates";
import { FormEvent, MouseEventHandler } from "react";
import Head from "../Components/Head";

const PaymentForm = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const onClickRadioHandler: MouseEventHandler<HTMLInputElement> = (e) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      dispatch(cartActions.setPaymentMethod(target.value as MethodPaymentType));
    }
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    history.push("/buy/place");
  };

  return (
    <>
      <Head title="W-SHOP | Pay" />
      <div className="d-flex flex-column align-items-center fading-in">
        <h3 className="mb-5 fw-light">Choose payment method</h3>
        <Form className="fs-5" onSubmit={submitHandler}>
          <Form.Group>
            <Form.Check
              className="mb-4"
              type="radio"
              defaultChecked
              onClick={onClickRadioHandler}
              value="paypal"
              label={
                <div className="d-flex align-items-center">
                  <span className="me-2">Paypal</span>
                  <FontAwesomeIcon icon={faPaypal} className="fs-2" />
                </div>
              }
              name="payment"
              id="paypal"
            />
            <Form.Check
              type="radio"
              onClick={onClickRadioHandler}
              disabled={true}
              label={
                <div className="d-flex align-items-center">
                  <span className="me-2">Stripe</span>
                  <FontAwesomeIcon icon={faStripeS} className="fs-3" />
                </div>
              }
              value="stripe"
              name="payment"
              id="stripe"
            />
          </Form.Group>
          <Button type="submit" variant="dark" className="w-100 mt-5 fs-6">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

export default PaymentForm;
