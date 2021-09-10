import { Col, Row, Container, Tabs, Tab } from "react-bootstrap";
import ValidatableForm from "../Components/ValidatableForm";
import { useState, useReducer } from "react";
import { EventKey } from "react-bootstrap/esm/types";
import { useHistory } from "react-router";
import { IFormFields } from "../types/FormPropsInterface";
import {
  initialLoginFormData,
  initialRegisterFormData,
  formReducer,
  formConfig,
} from "../form-utils/form-utils";
import { authTriggerRequest } from "../store/auth_slice";
import ScreenLoader from "../Components/UI/ScreenLoader";
import { useAppSelector, useAppDispatch } from "../store/typed-hooks";
import Notification from "../Components/UI/Notification";
import Head from "../Components/Head";

const AuthPage: React.FC<{
  redirect?: string;
}> = ({ redirect }) => {
  const [authType, setAuthType] = useState<EventKey>("login");
  const history = useHistory();
  const [loginFormData, loginFormDataDispatch] = useReducer(
    formReducer,
    initialLoginFormData
  );
  const {
    data: authUserInfo,
    isFetching: isLoading,
    error: requestErrorMessage,
  } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [registerFormData, registerFormDataDispatch] = useReducer(
    formReducer,
    initialRegisterFormData
  );

  //redirect if user is logged in
  if (authUserInfo) {
    if (redirect) {
      history.replace(redirect);
    } else {
      history.replace("/");
    }
  }

  const sendAuthorizationRequest = () => {
    let formEnteredData: IFormFields;
    let authRequestURL: string;
    let authRequestPayload: string;
    let rememberMe: boolean = false;
    if (authType === "login") {
      formEnteredData = loginFormData;
      authRequestURL = `${window.location.origin}/api/users/login`;
      authRequestPayload = JSON.stringify({
        email: formEnteredData.email.value,
        password: formEnteredData.password.value,
      });
      rememberMe = !!formEnteredData.remember.value;
    } else {
      formEnteredData = registerFormData;
      authRequestURL = `${window.location.origin}/api/users/`;
      authRequestPayload = JSON.stringify({
        email: formEnteredData.email.value,
        password: formEnteredData.password.value,
        name: formEnteredData.name.value,
      });
    }

    if (
      Object.entries(formEnteredData).some(
        ([, inputState]) => !inputState.isValid
      )
    ) {
      return;
    }

    dispatch(
      authTriggerRequest(
        {
          url: authRequestURL,
          config: {
            body: authRequestPayload,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        },
        {
          remember: rememberMe,
        }
      )
    );
  };

  let formHeader: JSX.Element = (
    <div className="d-flex">
      <h4 className="fs-2 fw-light me-2">
        {authType === "login" ? "Log in" : "Registration"}
      </h4>
      {requestErrorMessage && (
        <Notification isError message={requestErrorMessage} />
      )}
    </div>
  );

  return (
    <>
      <Head title="W-Shop | Authorization" />
      <Container className="fading-in">
        <Row className="justify-content-center">
          {isLoading && <ScreenLoader />}
          <Col sm={7}>
            <Tabs
              id="controlled-tab-example"
              activeKey={authType}
              onSelect={(k) => {
                if (k) {
                  setAuthType(k);
                }
              }}
              className="mb-3"
            >
              <Tab eventKey="login" title="Log In">
                <div className="p-3 align-items-center">
                  {formHeader}
                  <ValidatableForm
                    formConfig={formConfig}
                    fields={loginFormData}
                    dispatchFormAction={loginFormDataDispatch}
                    parentSubmitHandler={sendAuthorizationRequest}
                  />
                </div>
              </Tab>
              <Tab eventKey="registration" title="Registration">
                <div className="p-3 align-items-center">
                  {formHeader}
                  <ValidatableForm
                    formConfig={formConfig}
                    fields={registerFormData}
                    dispatchFormAction={registerFormDataDispatch}
                    parentSubmitHandler={sendAuthorizationRequest}
                  />
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AuthPage;
