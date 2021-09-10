import { useAppSelector } from "../store/typed-hooks";
import Notification from "./UI/Notification";
import { Form, Button, Card } from "react-bootstrap";
import { IProductReview } from "../types/ProductInterface";
import React, { useState } from "react";
import useHttp from "../hooks/useHttp";
import ScreenLoader from "./UI/ScreenLoader";

const ProductReviewForm: React.FC<{
  onSuccessCallback: (newReviewData: IProductReview) => void;
  productId: string;
}> = ({ onSuccessCallback, productId }) => {
  const {
    isFetching: isCommentLoading,
    error: commentError,
    sendRequest: sendCommentRequest,
  } = useHttp<IProductReview>();
  const authUserInfo = useAppSelector((state) => state.auth.data);
  const [commentText, setCommentText] = useState<string>("");
  const [ratingValue, setRatingValue] = useState<string>("1");

  const isFormValid = !!commentText.length && !!ratingValue.length;
  const sumbitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (authUserInfo && isFormValid) {
      const newReviewData: IProductReview = {
        user: {
          name: authUserInfo.name,
          id: authUserInfo.id,
        },
        comment: commentText,
        rating: +ratingValue,
        createdAt: new Date().toISOString(),
      };

      sendCommentRequest(
        {
          url: `api/products/${productId}/reviews`,
          config: {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authUserInfo.token}`,
            },
            body: JSON.stringify({
              user: newReviewData.user,
              comment: newReviewData.comment,
              rating: newReviewData.rating,
            }),
            method: "POST",
          },
        },
        () => {
          onSuccessCallback(newReviewData);
          setCommentText("");
          setRatingValue("1");
        }
      );
    }
  };

  if (authUserInfo) {
    return (
      <>
        {isCommentLoading && <ScreenLoader />}
        <Card bg="light" className="p-3 mb-4">
          <Form onSubmit={sumbitHandler}>
            <Form.Group className="d-flex align-items-baseline mb-2">
              <Form.Label className="me-3 fw-light fs-8 text-capitalize">
                Your Rating :
              </Form.Label>
              <Form.Control
                as="select"
                className="d-block w-auto px-3 py-1 fs-8 text-secondary"
                value={ratingValue}
                onChange={(e) => setRatingValue(e.target.value)}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  return (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <Form.Control
              isValid={!!commentText.length}
              as="textarea"
              placeholder="Leave a comment here"
              className="mb-2"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button
              disabled={!isFormValid}
              type="submit"
              className="ms-auto d-block px-4"
              variant="dark"
            >
              Sumbit
            </Button>
          </Form>
        </Card>
        {commentError && (
          <Notification
            message={commentError}
            isError
            style="d-flex mt-2 w-100 fs-8"
          />
        )}
      </>
    );
  } else {
    return (
      <Notification
        message="To leave review authenticaton is required"
        isError
        style="d-flex"
      />
    );
  }
};

export default ProductReviewForm;
