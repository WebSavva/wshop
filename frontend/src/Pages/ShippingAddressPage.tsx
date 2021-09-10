import ValidatableForm from "../Components/ValidatableForm";
import { FormActions } from "../types/FormPropsInterface";
import {
  initialShipmentFormData,
  formReducer,
  formConfig,
} from "../form-utils/form-utils";
import { useReducer, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/typed-hooks";
import { useHistory } from "react-router";
import { actionCreatorAddShippingAddress } from "../store/cart_slice";
import Head from "../Components/Head";

const ShippingAddressForm = () => {
  const [shipmentFormData, dispatchShipmentFormData] = useReducer(
    formReducer,
    initialShipmentFormData
  );
  const history = useHistory();
  const shippingAddress = useAppSelector((state) => state.cart.shippingAddress);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Object.keys(shippingAddress)) {
      Object.entries(shippingAddress).forEach(([fieldName, fieldValue]) => {
        dispatchShipmentFormData({
          type: FormActions.SET_FIELD,
          inputData: {
            fieldName: fieldName,
            isValid: true,
            value: fieldValue,
          },
        });
      });
    }
  }, [shippingAddress]);

  const shippingAddressSubmitHandler = () => {
    dispatch(
      actionCreatorAddShippingAddress({
        country: shipmentFormData.country.value,
        city: shipmentFormData.city.value,
        postalCode: shipmentFormData.postalCode.value,
      })
    );
    history.push("/buy/payment");
  };

  return (
    <>
      <Head title="W-SHOP | Shipment" />
      <div className="fading-in">
        <h5>Shipment</h5>
        <ValidatableForm
          formConfig={formConfig}
          dispatchFormAction={dispatchShipmentFormData}
          fields={shipmentFormData}
          parentSubmitHandler={shippingAddressSubmitHandler}
        />
      </div>
    </>
  );
};

export default ShippingAddressForm;
