import {
  formReducer,
  formConfig,
  initialAdminCreateUserFormData,
} from "../form-utils/form-utils";
import { useReducer } from "react";
import { useHistory } from "react-router";
import useHttp from "../hooks/useHttp";
import ScreenLoader from "../Components/UI/ScreenLoader";
import Notification from "../Components/UI/Notification";
import ValidatableForm from "../Components/ValidatableForm";
import { Container, Row, Col } from "react-bootstrap";
import { useAppSelector } from "../store/typed-hooks";
import adminFavIcon from "./../resources/admin-icon.png";
import Head from "../Components/Head";

const AdminCreateUserPage = () => {
  const authUserInfo = useAppSelector((state) => state.auth.data);
  const history = useHistory();
  const [formState, dispatchFormAction] = useReducer(
    formReducer,
    initialAdminCreateUserFormData
  );
  const {
    isFetching,
    error,
    sendRequest: sendCreateRequest,
  } = useHttp<boolean>();

  const onSubmitHandler = () => {
    if (Object.values(formState).every((fieldState) => fieldState.isValid)) {
      const newUserData: { [name: string]: any } = {};
      Object.entries(formState).forEach(
        ([fieldName, fieldState]) => (newUserData[fieldName] = fieldState.value)
      );
      sendCreateRequest(
        {
          url: `api/admin/users`,
          config: {
            method: "POST",
            body: JSON.stringify(newUserData),
            headers: {
              Authorization: `Bearer ${authUserInfo?.token}`,
              "Content-Type": "application/json",
            },
          },
        },
        () => history.replace("/admin/users")
      );
    }
  };
  return (
    <>
      <Head title="Admin | Create User" favicon={adminFavIcon} />
      <Container className='fading-in'>
        <Row className="justify-content-center">
          {isFetching && <ScreenLoader />}
          <Col sm={6}>
            <div className="d-flex align-items-center">
              <h5 className="me-3 text-uppercase">New User</h5>
              {error && <Notification message={error} isError />}
            </div>
            <ValidatableForm
              fields={formState}
              formConfig={formConfig}
              parentSubmitHandler={onSubmitHandler}
              dispatchFormAction={dispatchFormAction}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminCreateUserPage;
