import {
  IFormFields,
  FormActions,
  IFormAction,
  IFormValidators,
  IFormConfig,
} from "../types/FormPropsInterface";
import { generateInitialFormData } from "./initialFormDataGenerator";

export const initialUserFormData = generateInitialFormData([
  ["email", "", false, "email"],
  ["password", "", false, "password"],
]);

export const initialLoginFormData = generateInitialFormData([
  ["email", "", false, "email"],
  ["password", "", false, "password"],
  ["remember", true, true, "skipValidation"],
]);

export const initialRegisterFormData = generateInitialFormData([
  ["email", "", false, "email"],
  ["name", "", false, "name"],
  ["password", "", false, "password"],
  ["confirmPassword", "", false, "confirmPassword"]
]);

export const initial = generateInitialFormData([
  ["email", "", false, "email"],
  ["name", "", false, "name"],
  ["password", "", false, "password"],
  ["confirmPassword", "", false, "confirmPassword"]
]);

export const initialShipmentFormData = generateInitialFormData([
  ["country", "", false, "defaultRequired"],
  ["city", "", false, "defaultRequired"],
  ["postalCode", "", false, "postalCode"],
])

export const initialEditUserFormData = generateInitialFormData([
  ["email", "", true, "notRequiredEmail"],
  ["name", "", true, "skipValidation"],
  ["password", "", true, "notRequiredPassword"],
  ["isAdmin", false, true, "skipValidation"]
]);
export const initialAdminCreateUserFormData = generateInitialFormData([
  ["email", "", false, "email"],
  ["name", "", false, "name"],
  ["password", "", false, "password"],
  ["isAdmin", false, false, "skipValidation"]
]);

export const initialEditProductFormData = generateInitialFormData([
  ["name", "", true, "skipValidation"],
  ["brand", "", true, "skipValidation"],
  ["category", "", true, "skipValidation"],
  ["image", "", true, "notRequiredUrlChecker"],
  ["price", "", true, "notRequiredFloatChecker"],
  ["stockInCount", "", true, "notRequiredIntegerChecker"],
  ["description", "", true, "skipValidation"],
]);

export const initialCreateProductFormData = generateInitialFormData([
  ["name", "", false, "defaultRequired"],
  ["brand", "", false, "defaultRequired"],
  ["category", "", false, "defaultRequired"],
  ["image", "", false, "urlChecker"],
  ["price", "", false, "floatChecker"],
  ["stockInCount", "", false, "integerChecker"],
  ["description", "", false, "defaultRequired"],
]);

export const formReducer = (state: IFormFields, action: IFormAction) => {
  switch (action.type) {
    case FormActions.SET_FIELD:
      return {
        ...state,
        ...(action.inputData && {
          [action.inputData.fieldName]: {
            ...state[action.inputData.fieldName],
            value: action.inputData.value,
            isValid: action.inputData.isValid,
          },
        }),
      } as IFormFields;
      break;
    case FormActions.RESET_FORM:
      return {
        ...initialLoginFormData,
      } as IFormFields;
      break;
    default:
      return {
        ...state,
      } as IFormFields;
  }
};

export const formConfig: IFormConfig = {
  email: {
    inputType: "email",
    mismatchText: "Email address is invalid",
    labelText: "Email Address",
  },
  password: {
    inputType: "password",
    mismatchText:
      "Password should contain at least 8 symbols and include uppercase and lowercase characters, numbers and special symbols",
    labelText: "Password",
  },
  remember: {
    inputType: "checkbox",
    mismatchText: "",
    labelText: "Remember me",
  },
  isAdmin: {
    inputType: "checkbox",
    mismatchText: "",
    labelText: "Admin Status",
  },
  name: {
    inputType: "text",
    mismatchText: "Name should contain at least 5 characters",
    labelText: "Name",
  },
  confirmPassword: {
    inputType: "password",
    mismatchText: "Passwords do not match",
    labelText: "Confirm your password",
  },
  country: {
    inputType: "text",
    mismatchText: "This field is required",
    labelText: "Enter country",
  },
  city: {
    inputType: "text",
    mismatchText: "This field is required",
    labelText: "Enter city",
  },
  postalCode: {
    inputType: "text",
    mismatchText: "Postal code should contain 5 numbers",
    labelText: "Enter  postal code",
  },
  category: {
    inputType: "text",
    mismatchText: "This field is required",
    labelText: "Product category",
  },
  brand: {
    inputType: "text",
    mismatchText: "This field is required",
    labelText: "Product brand",
  },
  stockInCount: {
    inputType: "text",
    mismatchText: "Invalid value",
    labelText: "Number of available items",
  },
  price: {
    inputType: "text",
    mismatchText: "Invalid value",
    labelText: "Product price, $",
  },
  image: {
    inputType: "text",
    mismatchText: "Invalid URL address",
    labelText: "Product image",
  },
  description: {
    inputType: "textarea",
    mismatchText: "This field is required",
    labelText: "Description",
  },
};
