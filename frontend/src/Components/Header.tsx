import { useEffect, useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faWeebly } from "@fortawesome/free-brands-svg-icons";
import { LinkContainer } from "react-router-bootstrap";
import { useAppSelector } from "../store/typed-hooks";
import AuthUserNav from "./AuthUserNav";
import HeaderSearchBar from "./HeaderSearchBar";

let firstTime = true;

export default function Header() {
  const cartState = useAppSelector((state) => state.cart);
  const [shakingCartClass, setShakingCartClass] = useState<string>("");

  useEffect(() => {
    let timerShaking: NodeJS.Timeout;
    if (!firstTime) {
      setShakingCartClass("shaking");
      timerShaking = setTimeout(() => setShakingCartClass(""), 700);
    }

    firstTime = false;

    return () => {
      clearTimeout(timerShaking);
    };
  }, [cartState.cartItems]);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="primary"
      className="py-3"
      variant="dark"
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center">
            <FontAwesomeIcon
              icon={faWeebly}
              className="text-success"
              size="2x"
              transform={{ rotate: 15 }}
            />
            <h1 className="ms-2 fs-3 text-success fw-lighter mb-0">Shop</h1>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <HeaderSearchBar />
          </Nav>
          <Nav>
            <LinkContainer to="/cart" exact>
              <Nav.Link>
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className={`me-2 fs-6 ${shakingCartClass}`}
                />
                <span>Your Cart</span>
              </Nav.Link>
            </LinkContainer>
            <AuthUserNav />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
