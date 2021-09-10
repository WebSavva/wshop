import Rating from "./Rating";
import { Image } from "react-bootstrap";
import userImg from "./../resources/user-img.png";

const ReviewCard: React.FC<{
  username: string;
  date: string;
  comment: string;
  rating: number;
}> = ({ username, comment, rating, date }) => {
  return (
    <div className="d-flex p-3 bg-secondary bg-opacity-25 rounded-2 shadow-md my-3">
      <div className="flex-shrink-0 user-img">
        <Image src={userImg} fluid />
      </div>
      <div className="flex-grow-1 ms-3">
        <header className="d-flex justify-content-between">
          <div>
            <h5 className="fs-6 fw-bold mb-0">{username}</h5>
            <span className="fs-9 text-secondary">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
          <Rating ratingValue={rating} text="" />
        </header>
        <p className="mt-2 fs-9">{comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
