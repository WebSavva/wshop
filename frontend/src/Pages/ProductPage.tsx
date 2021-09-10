import { useParams, useHistory } from "react-router";
import {
  Container,
  Row,
  Col,
  Image,
  ListGroup,
  FormGroup,
  Form,
  Alert,
} from "react-bootstrap";
import Rating from "../Components/Rating";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/typed-hooks";
import { productTriggerRequest } from "../store/product_slice";
import Spinner from "../Components/UI/Spinner";
import Message from "../Components/UI/Message";
import { actionCreatorAddItem } from "../store/cart_slice";
import ReviewCard from "../Components/ReviewCard";
import { IProductReview } from "../types/ProductInterface";
import ProductReviewForm from "../Components/ProductReviewForm";
import Head from "../Components/Head";

const ProductPage: React.FC = () => {
  const { id: requestedId } = useParams<{ id: string }>();
  const [productReviews, setProductReviews] = useState<IProductReview[]>([]);
  const [productRating, setProductRating] = useState<number>(0);
  const [reviewsNumber, setReviewsNumber] = useState<number>(0);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const {
    isFetching,
    error,
    data: requestedProductData,
  } = useAppSelector((state) => state.product);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    dispatch(
      productTriggerRequest({
        url: `${window.location.origin}/api/products/${requestedId}`,
        config: {},
      })
    );
  }, [dispatch, requestedId]);

  useEffect(() => {
    if (requestedProductData) {
      setProductReviews(requestedProductData.reviews);
      setProductRating(requestedProductData.rating);
      setReviewsNumber(requestedProductData.reviewsNumber);
    }
  }, [requestedProductData]);

  let content: JSX.Element;
  let documentTitle: string = "W-SHOP";
  if (error) {
    content = (
      <Message>Such product does not exist or something went wrong</Message>
    );
    documentTitle = "Oops, error happened";
  } else if (isFetching) {
    content = <Spinner size={150} />;
    documentTitle = "Loading...";
  } else if (requestedProductData) {
    const addCartItemHandler = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      dispatch(
        actionCreatorAddItem({
          id: requestedProductData.id,
          name: requestedProductData.name,
          image: requestedProductData.image,
          stockInCount: requestedProductData.stockInCount,
          price: requestedProductData.price,
          quantity: selectedQuantity,
        })
      );
    };

    const addReviewHandler = (newReviewData: IProductReview) => {
      const newReviewsNumber = reviewsNumber + 1;
      const newProductRating = +(
        (productReviews.reduce((ac, review) => ac + review.rating, 0) +
          newReviewData.rating) /
        newReviewsNumber
      ).toFixed(1);
      setProductRating(newProductRating);
      setReviewsNumber(newReviewsNumber);
      setProductReviews((prevReviews) => [newReviewData, ...prevReviews]);
    };
    documentTitle = requestedProductData.name;
    content = (
      <Row className="py-3">
        <Col lg={6} key="product-photo" className="mb-5">
          <Image
            src={requestedProductData.image}
            alt="Product Image"
            className="product-page-img"
            fluid
          />
        </Col>
        <Col lg={3} key="main-product-info">
          <ListGroup variant="flush">
            <ListGroup.Item className="text-secondary">
              <h4 className="fs-4 fw-light">{requestedProductData.name}</h4>
            </ListGroup.Item>
            <ListGroup.Item className="text-secondary">
              <Rating
                text={`${reviewsNumber} reviews`}
                ratingValue={productRating}
              />
            </ListGroup.Item>
            <ListGroup.Item className="text-secondary">
              <p className="fs-5 d-inline-block my-1">
                <span>Price:</span>
                <span className="ms-2 fw-bold">
                  ${requestedProductData.price}
                </span>
              </p>
            </ListGroup.Item>
            <ListGroup.Item className="text-secondary">
              <p>{requestedProductData.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col lg={3} className="px-sm-5" key="product-action-box">
          <Form onSubmit={addCartItemHandler}>
            <ListGroup>
              <ListGroup.Item className="d-flex justify-content-between text-secondary">
                <span>Price:</span>
                <span className="fw-bold">${requestedProductData.price}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between text-secondary">
                <span>Status:</span>
                <span className="fw-bold">
                  {requestedProductData.stockInCount > 0
                    ? "In Stock"
                    : "Not Available"}
                </span>
              </ListGroup.Item>
              {requestedProductData.stockInCount > 0 && (
                <ListGroup.Item>
                  <FormGroup className="text-secondary d-flex justify-content-between align-items-baseline">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      max={requestedProductData.stockInCount}
                      min={1}
                      className="fs-10 d-inline-block w-auto p-1"
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(+e.target.value)}
                    />
                  </FormGroup>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <button
                  type="submit"
                  className="btn btn-dark text-success d-block w-100"
                  disabled={requestedProductData.stockInCount === 0}
                >
                  Add to Cart
                </button>
              </ListGroup.Item>
            </ListGroup>
          </Form>
        </Col>
        <Col lg={5} key="product-reviews" className="mt-5">
          <h4 className="text-uppercase">Reviews</h4>
          <ProductReviewForm
            productId={requestedProductData.id}
            onSuccessCallback={addReviewHandler}
          />
          {productReviews.length ? (
            productReviews.map((reviewData) => (
              <ReviewCard
                username={reviewData.user?.name || "User"}
                key={reviewData.createdAt}
                rating={reviewData.rating}
                date={reviewData.createdAt}
                comment={reviewData.comment}
              />
            ))
          ) : (
            <Alert className="bg-secondary bg-opacity-75">
              No reviews so far...
            </Alert>
          )}
        </Col>
      </Row>
    );
  } else {
    content = <Message>Something unknown happened</Message>;
  }

  return (
    <>
      <Head title={documentTitle} />
      <Container>
        <div>
          <button
            className="btn-dark btn text-white text-opacity-75"
            onClick={() => history.goBack()}
          >
            Go back
          </button>
        </div>
        {content}
      </Container>
    </>
  );
};

export default ProductPage;
