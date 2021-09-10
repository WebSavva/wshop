import { IProduct } from "../types/ProductInterface";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { LinkContainer } from "react-router-bootstrap";

const Product: React.FC<IProduct> = ({
  name,
  id,
  price,
  reviewsNumber,
  rating,
  image,
  description,
}) => {
  return (
    <Card className="h-100 justify-content-between shadow-sm mx-4 fading-in">
      <LinkContainer to={`/products/${id}`}>
        <div className="d-flex justify-content-center px-1 py-3 cursor-pointer">
          <Card.Img variant="top" src={image} className="product-card-img" />
        </div>
      </LinkContainer>
      <LinkContainer to={`/products/${id}`}>
        <div className="cursor-pointer">
          <Card.Body className="d-flex flex-column justify-content-between bg-success bg-opacity-10 border-top px-3 py-4 border-muted">
            <Card.Title
              as="h4"
              className="product-card-title mb-2 text-dark fw-normal"
            >
              <strong>{name}</strong>
            </Card.Title>
            <Card.Text
              as="div"
              className="py-2 product-card-reviews fw-normal text-secondary"
            >
              <Rating ratingValue={rating} text={`${reviewsNumber} reviews`} />
            </Card.Text>
            <Card.Text
              as="h5"
              className="product-card-price fw-bold text-secondary py-1"
            >
              ${price}
            </Card.Text>
          </Card.Body>
        </div>
      </LinkContainer>
    </Card>
  );
};

export default Product;
