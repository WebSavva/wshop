import { initialEditUserFormData } from "../form-utils/form-utils";
import AdminEditTemplate from "../Components/AdminEditTemplate";
import { Container, Row, Col } from "react-bootstrap";
import adminFavIcon from "./../resources/admin-icon.png";
import Head from "../Components/Head";

const AdminEditUserPage = () => {
  return (
    <>
      <Head title="Admin | Edit User" favicon={adminFavIcon} />
      <Container>
        <Row className="justify-content-center">
          <Col sm={6}>
            <AdminEditTemplate
              dataName="user profile"
              initialFormState={initialEditUserFormData}
              notificationText="User profile information has been updated successfully"
              getFetchRequestUrl={(id: string) => `api/admin/users/${id}`}
              getUpdateRequestUrl={(id: string) => `api/admin/users/${id}`}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminEditUserPage;
