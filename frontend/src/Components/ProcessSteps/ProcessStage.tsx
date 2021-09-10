import { Link } from "react-router-dom";

const ProcessStage: React.FC<{
  stageName: string;
  isActive: boolean;
  isStart: boolean;
  stepLink: string;
}> = ({ stageName, isActive, isStart, stepLink }) => {
  return (
    <>
      {!isStart && (
        <div className={`steps__line ${isActive ? "active" : ""}`}></div>
      )}
      <Link to={stepLink}>
        <div className="steps__stage-box">
          <div className={`steps__circle ${isActive ? "active" : ""}`}></div>
          <h6 className={`steps__header ${isActive ? "active" : ""}`}>
            {stageName}
          </h6>
        </div>
      </Link>
    </>
  );
};

export default ProcessStage;
