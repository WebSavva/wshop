import { IFormFields } from "../types/FormPropsInterface";

type fieldsConfig = Array<
  [
    inputName: string,
    initialValue: string | boolean,
    defaultValid: boolean,
    validator: string
  ]
>;
export function generateInitialFormData(config: fieldsConfig): IFormFields {
  const initialFormData: IFormFields = {};
  for (let [inputName, value, isValid, validatorName] of config) {
    initialFormData[inputName] = {
      value,
      isValid,
      validatorName,
    };
  }

  return initialFormData;
}
