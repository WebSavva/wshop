import { Form } from "react-bootstrap";
import { IInputProps } from "../types/FormPropsInterface";
import { useState } from "react";

const ValidatableInput: React.FC<IInputProps> = ({
  inputType,
  labelText,
  controlId,
  onChangeHandler,
  value,
  isValid,
  mismatchText,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const onFocusHandler = (e: React.FocusEvent) => {
    setIsFocused(true);
    setIsTouched(true);
  };
  const onBlurHandler = (e: React.FocusEvent) => setIsFocused(false);
  let isInvalid = !isFocused && isTouched && !isValid;

  let content: JSX.Element;
  if (inputType === "checkbox") {
    content = (
      <Form.Check
        type="checkbox"
        checked={Boolean(value)}
        className="text-capitalize"
        label={labelText}
        onChange={onChangeHandler}
      />
    );
  } else if (inputType === "textarea") {
    content = (
      <Form.Control
        as="textarea"
        rows={3}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
        value={String(value)}
        isValid={isValid}
        isInvalid={isInvalid}
      />
    );
  } else {
    content = (
      <Form.Group controlId={controlId}>
        <Form.Label className="text-capitalize">{labelText}</Form.Label>
        <Form.Control
          type={inputType}
          value={String(value)}
          isValid={isValid}
          isInvalid={isInvalid}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
        />
        <Form.Control.Feedback type="invalid">
          {mismatchText}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }
  return (
    <Form.Group className="mb-3" controlId={controlId}>
      {content}
    </Form.Group>
  );
};

export default ValidatableInput;
