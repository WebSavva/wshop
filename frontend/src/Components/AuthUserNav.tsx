import { useAppSelector, useAppDispatch } from "../store/typed-hooks";
import { authTriggerLogout } from "../store/auth_slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, NavDropdown } from "react-bootstrap";
import { useHistory } from "react-router";

const AuthUserNav: React.FC = () => {
  const authUserInfo = useAppSelector((state) => state.auth.data);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const logOutHandler = () => {
    dispatch(authTriggerLogout());
    history.replace("/login");
  };
  let content: JSX.Element;

  if (authUserInfo) {
    content = (
      <NavDropdown
        id="nav-dropdown-dark-example"
        title={
          <>
            <FontAwesomeIcon
              icon={faUser}
              className={`me-2 fs-6 d-inline-block`}
            />
            <span>{authUserInfo.isAdmin ? "Admin" : authUserInfo.name}</span>
          </>
        }
      >
        <LinkContainer to="/user/profile" exact>
          <NavDropdown.Item>
            <span>Update Profile</span>
          </NavDropdown.Item>
        </LinkContainer>
        {authUserInfo.isAdmin && (
          <>
            <LinkContainer to="/admin/orders" exact>
              <NavDropdown.Item>
                <span>Orders</span>
              </NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/admin/products" exact>
              <NavDropdown.Item>
                <span>Products</span>
              </NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/admin/users" exact>
              <NavDropdown.Item>
                <span>Users</span>
              </NavDropdown.Item>
            </LinkContainer>
          </>
        )}
        <NavDropdown.Item onClick={logOutHandler}>Log Out</NavDropdown.Item>
      </NavDropdown>
    );
  } else {
    content = (
      <LinkContainer to="/login" exact>
        <Nav.Link className="d-flex">
          <FontAwesomeIcon
            icon={faUser}
            className={`me-2 fs-6 d-inline-block`}
          />
          <span>Sign In</span>
        </Nav.Link>
      </LinkContainer>
    );
  }

  return content;
};

export default AuthUserNav;
