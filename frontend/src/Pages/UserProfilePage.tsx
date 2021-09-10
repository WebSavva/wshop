import { Col, Row, Container } from "react-bootstrap";
import { useEffect, useReducer } from "react";
import { useAppSelector, useAppDispatch } from "../store/typed-hooks";
import ScreenLoader from "../Components/UI/ScreenLoader";
import { FormActions } from "../types/FormPropsInterface";
import {
  initialRegisterFormData,
  formConfig,
  formReducer,
} from "../form-utils/form-utils";
import ValidatableForm from "../Components/ValidatableForm";
import { authTriggerRequest } from "../store/auth_slice";
import OrdersTable from "../Components/OrdersTable";
import Head from "../Components/Head";

const UserProfilePage: React.FC = () => {
  const { data: authUserInfo, isFetching: isLoading } = useAppSelector(
    (state) => state.auth
  );

  const dispatch = useAppDispatch();

  const [updateFormData, dispatchUpdateFormData] = useReducer(
    formReducer,
    initialRegisterFormData
  );

  const sendUpdateRequest = () => {
    if (authUserInfo) {
      if (
        Object.values(updateFormData).some((inputState) => !inputState.isValid)
      )
        return;

      dispatch(
        authTriggerRequest({
          url: `${window.location.origin}/api/users/profile`,
          config: {
            method: "PUT",
            body: JSON.stringify({
              email: updateFormData.email.value,
              name: updateFormData.name.value,
              password: updateFormData.password.value,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authUserInfo.token}`,
            },
          },
        })
      );
    }
  };

  useEffect(() => {
    if (authUserInfo) {
      Object.entries(authUserInfo).forEach(([fieldName, fieldValue]) => {
        if (!(fieldName in updateFormData)) return;
        dispatchUpdateFormData({
          type: FormActions.SET_FIELD,
          inputData: {
            fieldName: fieldName,
            isValid: true,
            value: fieldValue,
          },
        });
      });
    }
  }, [authUserInfo]);

  return (
    <>
      <Head title={`W-SHOP | ${authUserInfo?.name}`} />
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h4 className="text-uppercase">My profile</h4>
            {isLoading && <ScreenLoader />}
            <ValidatableForm
              dispatchFormAction={dispatchUpdateFormData}
              formConfig={formConfig}
              fields={updateFormData}
              parentSubmitHandler={sendUpdateRequest}
            />
          </Col>
          <Col md={8} className="ps-4">
            <h4 className="text-uppercase">My orders</h4>
            <OrdersTable />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserProfilePage;
