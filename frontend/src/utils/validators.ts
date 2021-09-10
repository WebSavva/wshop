import { IFormFields, IFormValidators } from "./../types/FormPropsInterface";
import { camelCase } from "lodash";

type inputType = string | boolean | undefined;

export const validationBase: IFormValidators = {
  email: (enteredEmail: inputType) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      String(enteredEmail).toLowerCase()
    ),
  password: (enteredPassword: inputType) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
      String(enteredPassword)
    ),
  confirmPassword: (
    enteredPasswordConfirmation: inputType,
    currentValues?: IFormFields
  ) => {
    if (enteredPasswordConfirmation && currentValues) {
      let currentPassword = currentValues["password"];
      return (
        currentPassword.isValid &&
        String(enteredPasswordConfirmation) === String(currentPassword.value)
      );
    }
    return false;
  },
  name: (enteredName: inputType) => String(enteredName).length > 5,
  skipValidation: () => true,
  defaultRequired: (enteredValue: inputType) => String(enteredValue).length > 0,
  postalCode: (enteredPostalCode: inputType) =>
    /^([0-9]{5}|[a-zA-Z][a-zA-Z ]{0,49})$/.test(String(enteredPostalCode)),

  floatChecker: (numberValue: inputType) => {
    return /^[+]?([0-9]*[.])?[0-9]+$/.test(String(numberValue));
  },
  integerChecker: (numberValue: inputType) => {
    return /^\d+$/.test(String(numberValue));
  },
  urlChecker: (url: inputType) =>
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
      String(url)
    ),
};

for (let [name, validator] of Object.entries(validationBase)) {
  (validationBase as any)[camelCase("notRequired_" + name)] = (
    enteredValue: inputType,
    formState: IFormFields
  ) => {
    return !String(enteredValue).length || validator(enteredValue, formState);
  };
}
