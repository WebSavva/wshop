import { initialEditProductFormData } from "../form-utils/form-utils";
import AdminEditTemplate from "../Components/AdminEditTemplate";
import { Container, Row, Col, Image } from "react-bootstrap";
import Notification from "../Components/UI/Notification";
import useProductImage from "../hooks/useProductImage";
import { useCallback } from "react";
import adminFavIcon from "./../resources/admin-icon.png";
import Head from "../Components/Head";

const AdminEditProductPage = () => {
  const { onChangeCallback, onLoadErrorHandler, loadError, urlImage } =
    useProductImage();
  const getUpdateRequestUrl = useCallback(
    (id: string) => `api/admin/products/${id}`,
    []
  );
  const getFetchRequestUrl = useCallback(
    (id: string) => `api/products/${id}`,
    []
  );

  return (
    <>
      <Head title="Admin | Edit Product" favicon={adminFavIcon} />
      <Container>
        <Row className="justify-content-center">
          <Col sm={8}>
            <AdminEditTemplate
              dataName="user profile"
              initialFormState={initialEditProductFormData}
              notificationText="Product infor information has been updated successfully"
              getFetchRequestUrl={getFetchRequestUrl}
              getUpdateRequestUrl={getUpdateRequestUrl}
              onFormDataChangeCallback={onChangeCallback}
            />
          </Col>
          <Col sm={4} className="d-flex flex-column align-items-center mt-3">
            <Image
              alt={"Wrong"}
              src={urlImage}
              onError={onLoadErrorHandler}
              className="mb-3 top-product-img"
            />
            {loadError && <Notification message={loadError} isError />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminEditProductPage;
