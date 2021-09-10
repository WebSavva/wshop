import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

export interface IRating {
  ratingValue: number;
  text: string;
}

const Rating: React.FC<IRating> = ({ ratingValue, text }) => {
  let ratingStars: Array<JSX.Element> = [];

  let fullStarsNumber: number = Math.floor(ratingValue),
    halfStarsNumber: 0 | 1 = Math.round(ratingValue - fullStarsNumber) as 0 | 1;

  ratingStars = ratingStars.concat(
    Array.from({ length: fullStarsNumber }, (el, i) => (
      <FontAwesomeIcon icon={faStar}/>
    ))
  );

  ratingStars = ratingStars.concat(
    Array.from({ length: halfStarsNumber }, (el, i) => (
      <FontAwesomeIcon icon={faStarHalfAlt}/>
    ))
  );

  //filling up with half-full stars
  for (let i = ratingStars.length; i < 5; i++) {
    ratingStars.push(<FontAwesomeIcon icon={farStar} />);
  }

  return (
    <div className="d-flex align-items-baseline">
      <div className="d-flex text-warning">{ratingStars}</div>
      <span className="ms-2">{text}</span>
    </div>
  );
};

export default Rating;
