import {
  ListGroupItem,
  FormControl,
  Image,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { IShortenedProduct } from "../types/ProductInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { LinkContainer } from "react-router-bootstrap";
import {
  actionCreatorRemoveItem,
  actionCreatorAddItem,
} from "../store/cart_slice";
import { useAppDispatch } from "../store/typed-hooks";

const CartItem: React.FC<IShortenedProduct> = (props) => {
  const dispatch = useAppDispatch();
  const changeProductQuantity = (e: React.ChangeEvent) => {
    e.preventDefault();
    dispatch(
      actionCreatorAddItem({
        ...props,
        quantity: +(e.target as HTMLSelectElement).value,
      })
    );
  };

  const removeProductFromCart = () => {
    dispatch(actionCreatorRemoveItem(props.id));
  };
  const wordsMatch = props.name.match(/\w+/gi);
  let shortenedName: string;
  if (!wordsMatch || (wordsMatch && wordsMatch.length <= 2)) {
    shortenedName = props.name;
  } else {
    shortenedName = wordsMatch.slice(0, 2).join(" ");
  }
  return (
    <ListGroupItem key={props.id} className="py-4">
      <Row className="align-items-center flex-wrap">
        <LinkContainer to={`/products/${props.id}`} className="cursor-pointer">
          <Col xs={3} sm="1">
            <Image src={props.image} className="cart-item-img" fluid />
          </Col>
        </LinkContainer>
        <LinkContainer to={`/products/${props.id}`} className="cursor-pointer">
          <Col className="ms-sm-4">
            <p className="fs-6 text-secondary fw-light">{shortenedName}</p>
          </Col>
        </LinkContainer>

        <Col>
          <p className="fs-6 text-secondary">${props.price}</p>
        </Col>
        <Col xs="3" className="ms-auto ms-sm-1 me-2">
          <FormControl
            type="number"
            max={props.stockInCount}
            min={1}
            className="fs-8 w-auto"
            value={props.quantity}
            onChange={changeProductQuantity}
          />
        </Col>
        <Col
          xs="2"
          className="d-flex justify-content-start justify-content-sm-center align-items-center"
        >
          <Button
            onClick={removeProductFromCart}
            variant="outline-danger"
            className="d-flex justify-content-center py-sm-2 py-1 px-1 px-sm-3"
          >
            <FontAwesomeIcon icon={faTrash} className="fs-10" />
          </Button>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export default CartItem;
