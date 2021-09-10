import { useReducer, useEffect, useCallback, useState } from "react";
import {
  IFormFields,
  FormActions,
} from "../types/FormPropsInterface";
import { IRequestInfo } from "../types/Request";
import useHttp from "./useHttp";
import { formReducer } from "./../form-utils/form-utils";

function useLoadableEditForm<FetchDataT extends {}, SendDataT>({
  initialFormState,
  fetchRequestInfo,
  getSendRequestInfo,
  notification,
}: {
  initialFormState: IFormFields;
  fetchRequestInfo: IRequestInfo;
  getSendRequestInfo: (payload: {}) => IRequestInfo;
  onSuccessSendCb?: () => void;
  notification: string;
}) {
  const {
    isFetching: isFetchingFormData,
    sendRequest: fetchFormData,
    error: fetchFormDataError,
  } = useHttp<FetchDataT>();
  const [formState, dispatchFormData] = useReducer(
    formReducer,
    initialFormState
  );
  const [currentNoficication, setNotificationMessage] = useState<string | null>(
    null
  );

  const notifyOnSuccess = useCallback(
    () => setNotificationMessage(notification),
    [notification]
  );
  const resetNotification = useCallback(() => setNotificationMessage(null), []);

  const {
    isFetching: isSendingFormData,
    error: sendFormDataError,
    sendRequest: sendFormData,
  } = useHttp<SendDataT>();

  useEffect(() => {
    fetchFormData(fetchRequestInfo, (fetchedFormData) => {
      Object.entries(fetchedFormData).forEach(([fieldName, fieldValue]) => {
        if (!(fieldName in formState)) return;
        dispatchFormData({
          type: FormActions.SET_FIELD,
          inputData: {
            fieldName: fieldName,
            isValid: true,
            value: fieldValue as string | boolean,
          },
        });
      });
    });
  }, [fetchFormData, fetchRequestInfo]);

  const bindedSendFormData = useCallback(
    (data: any) => {
      sendFormData(getSendRequestInfo(data), notifyOnSuccess);
    },
    [sendFormData, notifyOnSuccess, getSendRequestInfo]
  );

  return {
    isSendingFormData,
    isFetchingFormData,
    fetchFormDataError,
    resetNotification,
    bindedSendFormData,
    formState,
    sendFormDataError,
    dispatchFormData,
    currentNoficication
  };
}

export default useLoadableEditForm;
