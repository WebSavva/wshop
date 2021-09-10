import { useAppSelector } from "../store/typed-hooks";
import { useMemo, useEffect } from "react";
import { formConfig } from "../form-utils/form-utils";
import ValidatableForm from "../Components/ValidatableForm";
import useLoadableEditForm from "../hooks/useLoadableForm";
import { IUserInfo } from "../types/AuthInterface";
import { IRequestInfo } from "../types/Request";
import { IFormFields } from "../types/FormPropsInterface";
import { useParams } from "react-router";
import { IProduct } from "../types/ProductInterface";
import Notification from "./UI/Notification";
import Spinner from "./UI/Spinner";
import ScreenLoader from "./UI/ScreenLoader";
import Message from "./UI/Message";

function AdminEditTemplate<T extends IUserInfo | IProduct>({
  initialFormState,
  notificationText,
  getFetchRequestUrl,
  getUpdateRequestUrl,
  dataName,
  onFormDataChangeCallback,
}: {
  initialFormState: IFormFields;
  notificationText: string;
  getFetchRequestUrl: (id: string) => string;
  getUpdateRequestUrl: (id: string) => string;
  dataName: string;
  onFormDataChangeCallback?: (newFormData: IFormFields) => void;
}) {
  const authUserInfo = useAppSelector((state) => state.auth.data);
  const { id: requestedId } = useParams<{
    id: string;
  }>();

  const fetchRequestInfo: IRequestInfo = useMemo(
    () => ({
      url: getFetchRequestUrl(requestedId),
      config: {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authUserInfo?.token}`,
        },
      },
    }),
    [authUserInfo, requestedId, getFetchRequestUrl]
  );

  const {
    isFetchingFormData,
    isSendingFormData,
    bindedSendFormData,
    formState,
    sendFormDataError,
    resetNotification,
    fetchFormDataError,
    dispatchFormData,
    currentNoficication,
  } = useLoadableEditForm<T, T>({
    initialFormState: initialFormState,
    fetchRequestInfo,
    notification: notificationText,
    getSendRequestInfo: (payload) => ({
      url: getUpdateRequestUrl(requestedId),
      config: {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUserInfo?.token}`,
        },
      },
    }),
  });

  useEffect(() => resetNotification(), [formState, resetNotification]);
  useEffect(
    () => onFormDataChangeCallback && onFormDataChangeCallback(formState),
    [formState, onFormDataChangeCallback]
  );
  const validateForm = () => {
    let isAllEmptyFields: boolean = Object.entries(formState).every(
      ([, fieldState]) => {
        if (typeof fieldState.value === "boolean") {
          return false;
        } else {
          return !fieldState.value.length;
        }
      }
    );
    return (
      !isAllEmptyFields &&
      Object.values(formState).every((fieldState) => fieldState.isValid)
    );
  };

  const onSubmitHandler = () => {
    const newUserData: {
      [name: string]: boolean | string;
    } = {};
    for (let [fieldName, fieldState] of Object.entries(formState)) {
      if (typeof fieldState.value === "string" && !fieldState.value.length)
        continue;
      newUserData[fieldName] = fieldState.value;
    }
    bindedSendFormData(newUserData);
  };

  let content: JSX.Element | null = null;
  if (isFetchingFormData) {
    content = <Spinner size={150} />;
  } else if (isSendingFormData) {
    content = <ScreenLoader />;
  } else if (sendFormDataError) {
    content = <Message>{sendFormDataError}</Message>;
  } else if (fetchFormDataError) {
    content = <Message>{fetchFormDataError}</Message>;
  } else {
    content = (
      <>
        <div className="d-flex">
          <h5 className="fs-5 me-3 text-uppercase">{dataName}</h5>
          {currentNoficication && (
            <Notification message={currentNoficication} isError={false} />
          )}
        </div>
        <ValidatableForm
          fields={formState}
          formConfig={formConfig}
          dispatchFormAction={dispatchFormData}
          validateForm={validateForm}
          parentSubmitHandler={onSubmitHandler}
        />
      </>
    );
  }

  return content;
}

export default AdminEditTemplate;
