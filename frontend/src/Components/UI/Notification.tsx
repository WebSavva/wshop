import React from "react";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const Notification: React.FC<{
  message: string;
  isError: boolean;
  style?: string;
}> = ({ message, isError, style }) => {
  let className = style ?? `d-inline-flex`;
  return (
    <Alert
      className={`${className}  p-2 bg-opacity-75 align-items-center ${
        isError ? "bg-danger" : "bg-success"
      }`}
    >
      <FontAwesomeIcon
        icon={isError ? faExclamationTriangle : faCheckCircle}
        className="text-white me-2 fs-8"
      />
      <span className="fs-10">{message}</span>
    </Alert>
  );
};

export default Notification;
