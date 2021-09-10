import httpSliceGenerator from "./http-generator";
import { IUserInfo } from "../types/AuthInterface";
import { IUserAuthState, httpReducer } from "../types/ReduxStates";
import { AppDispatch } from "./store";

const logoutReducer: httpReducer<IUserAuthState, IUserInfo> = (state) => {
  state.error = null;
  state.data = null;
  state.isFetching = false;
};

const authSlice = httpSliceGenerator<IUserAuthState, IUserInfo>({
  sliceName: "authentication",
  sliceInitialState: {
    data: (() => {
      const rawSavedUserInfo = localStorage.getItem("user-info");
      return rawSavedUserInfo
        ? (JSON.parse(rawSavedUserInfo) as IUserInfo)
        : null;
    })(),
    isFetching: false,
    error: null,
  },
  additionalReducers: {
    logOut: logoutReducer,
  },
  fetchHandler: (userInfo, additionalArgs) => {
    if (
      !!additionalArgs &&
      "remember" in additionalArgs &&
      !additionalArgs.remember
    ) {
      return;
    }

    localStorage.setItem("user-info", JSON.stringify(userInfo));
  },
});
export const authReducer = authSlice.slice.reducer;
export const authTriggerRequest = authSlice.actionCreator;
export const authTriggerLogin = (userInfo: IUserInfo) => {
  return (dispatch: AppDispatch): void => {
    dispatch(authSlice.slice.actions.succesfullFetch(userInfo));
  };
};
export const authTriggerLogout = () => {
  return (dispatch: AppDispatch): void => {
    dispatch(authSlice.slice.actions.logOut());
  };
};
