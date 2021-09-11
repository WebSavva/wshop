import ValidatableForm from "../Components/ValidatableForm";
import useHttp from "../hooks/useHttp";
import { useReducer, useEffect, useState } from "react";
import { useAppSelector } from "../store/typed-hooks";
import { IProduct } from "../types/ProductInterface";
import Notification from "../Components/UI/Notification";
import {
  formReducer,
  initialCreateProductFormData,
  formConfig,
} from "../form-utils/form-utils";
import { Container, Row, Col, Image } from "react-bootstrap";
import useProductImage from "../hooks/useProductImage";
import ScreenLoader from "../Components/UI/ScreenLoader";
import admiFavIcon from "./../resources/admin-icon.png";
import Head from "../Components/Head";

const AdminCreateProductPage = () => {
  const authUserInfo = useAppSelector((state) => state.auth.data);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    loadError: imageLoadError,
    onChangeCallback: onChangeFormCallback,
    urlImage,
    onLoadErrorHandler: onLoadImageErrorHandler,
  } = useProductImage();
  const {
    isFetching: isLoadingNewProduct,
    error: createRequestError,
    sendRequest: sendCreateProductRequest,
  } = useHttp<IProduct>();
  const [formState, dispatchFormAction] = useReducer(
    formReducer,
    initialCreateProductFormData
  );

  const onSumbitHandler = () => {
    const isFormValid = Object.values(formState).every(
      (inputState) => inputState.isValid
    );

    if (!isFormValid || !authUserInfo) return;

    let newProductData: { [name: string]: string | boolean } = {};
    for (let [propName, { value: propValue }] of Object.entries(formState)) {
      newProductData[propName] = propValue;
    }

    sendCreateProductRequest(
      {
        url: "api/admin/products/",
        config: {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authUserInfo?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProductData),
        },
      },
      () => setSuccessMessage("New product has been created !")
    );
  };

  useEffect(() => {
    onChangeFormCallback(formState);
    setSuccessMessage(null);
  }, [formState, onChangeFormCallback]);

  return (
    <>
      <Head title="Admin | Create Product" favicon={admiFavIcon} />
      <Container className='fading-in'>
        {isLoadingNewProduct && <ScreenLoader />}
        <Row>
          <Col sm={8}>
            <div className="d-flex align-items-center mb-3">
              <h4 className="text-uppercase me-3">Create New Product</h4>
              {createRequestError && (
                <Notification isError message={createRequestError} />
              )}
              {successMessage && (
                <Notification isError={false} message={successMessage} />
              )}
            </div>
            <ValidatableForm
              formConfig={formConfig}
              dispatchFormAction={dispatchFormAction}
              fields={formState}
              parentSubmitHandler={onSumbitHandler}
            />
          </Col>
          <Col sm={4} className="d-flex flex-column align-items-center mt-3">
            <Image
              alt={"Wrong source"}
              src={urlImage}
              onError={onLoadImageErrorHandler}
              className="mb-3 top-product-img"
            />
            {imageLoadError && (
              <Notification message={imageLoadError} isError />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminCreateProductPage;
