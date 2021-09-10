import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { IFormProps, FormActions } from "../types/FormPropsInterface";
import ValidatableInput from "./ValidatableInput";
import { validationBase as validators } from "../utils/validators";

const ValidatableForm: React.FC<IFormProps> = ({
  fields,
  formConfig,
  dispatchFormAction,
  parentSubmitHandler,
  validateForm,
}) => {
  let isFormValid = validateForm
    ? validateForm(fields)
    : Object.entries(fields).every(([, inputState]) => inputState.isValid);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    parentSubmitHandler();
  };

  const inputGroups: JSX.Element[] = Object.entries(fields).map(
    ([fieldName, inputState]) => {
      const inputConfig = formConfig[fieldName];
      const onChangeHandler = (e: React.ChangeEvent): void => {
        const target = e.target as HTMLInputElement;
        let enteredValue: string | boolean = "";
        if (target.type === "checkbox") {
          enteredValue = target.checked;
        } else {
          enteredValue = target.value;
        }
        dispatchFormAction({
          type: FormActions.SET_FIELD,
          inputData: {
            fieldName: fieldName,
            value: enteredValue,
            isValid: validators[inputState.validatorName](enteredValue, fields),
          },
        });
      };

      return (
        <ValidatableInput
          key={fieldName}
          value={inputState.value}
          isValid={inputState.isValid}
          onChangeHandler={onChangeHandler}
          inputType={inputConfig.inputType}
          controlId={fieldName}
          labelText={inputConfig.labelText}
          mismatchText={inputConfig.mismatchText}
        />
      );
    }
  );
  return (
    <Form className="pt-3" onSubmit={onSubmitHandler}>
      {inputGroups}
      <Row>
        <Col sm="auto">
          <Button
            variant="dark"
            className="fs-8 px-4"
            type="submit"
            disabled={!isFormValid}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ValidatableForm;
