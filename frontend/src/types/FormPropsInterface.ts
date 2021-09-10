export enum FormActions {
  SET_FIELD = "SET_FIELD",
  RESET_FORM = "RESET_FORM",
}

export interface IFormAction {
  type: FormActions;
  inputData?: {
    fieldName: string;
    value: string | boolean;
    isValid: boolean;
  };
}

export interface IFormFields {
  [name: string]: {
    isValid: boolean;
    value: string | boolean;
    validatorName: string;
  };
}
export interface IFormFieldConfig {
  inputType: string;
  labelText: string;
  mismatchText: string;
}

export interface IFormConfig {
  [inputName: string]: IFormFieldConfig;
}

export type ValidatorFunction = (
  value?: string | boolean,
  currentValues?: IFormFields
) => boolean;

export interface IFormValidators {
  [name: string]: ValidatorFunction;
}

export interface IFormProps {
  fields: IFormFields;
  formConfig: IFormConfig;
  dispatchFormAction: React.Dispatch<IFormAction>;
  parentSubmitHandler: () => void;
  validateForm?: (fields: IFormFields) => boolean;
}

export interface IInputProps {
  inputType: string;
  labelText: string;
  controlId: string;
  value: string | boolean;
  isValid: boolean;
  mismatchText: string;
  onChangeHandler: (e: React.ChangeEvent) => void;
}
