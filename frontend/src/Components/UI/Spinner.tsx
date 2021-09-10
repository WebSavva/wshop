import { Spinner as BootstrapSpinner } from "react-bootstrap";

const Spinner: React.FC<{
  size: number | string;
  parentCentered?: boolean;
}> = ({ size, parentCentered }) => {
  return (
    <BootstrapSpinner
      animation="border"
      variant="dark"
      className="border-5 text-opacity-75"
      style={{
        width: size + "px",
        height: size + "px",
        ...(!parentCentered && {
          margin: "auto",
          display: "block",
          marginTop: "50px",
        }),
      }}
    />
  );
};

Spinner.defaultProps = {
  size: 100,
};

export default Spinner;
