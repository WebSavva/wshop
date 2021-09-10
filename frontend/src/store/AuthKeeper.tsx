import { ReactElement } from "react";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./typed-hooks";
import { authTriggerLogin, authTriggerLogout } from "./auth_slice";
import { IUserInfo, ITokenPayload } from "../types/AuthInterface";

let firstTime = true;

const AuthKeeper: React.FC = (props) => {
  const authUserInfo = useAppSelector((state) => state.auth.data);
  const dispatch = useAppDispatch();

  const getParsedTokenPayload = useCallback((savedUserInfo: IUserInfo) => {
    const tokenPayload = JSON.parse(
      atob(savedUserInfo.token.split(".")[1])
    ) as ITokenPayload;

    return {
      tokenPayload,
      savedUserInfo,
    };
  }, []);
  const scheduleExpirationTokenTimer = useCallback(
    (expTimestamp: number) => {
      return setTimeout(() => {
        dispatch(authTriggerLogout());
        localStorage.removeItem("user-info");
      }, expTimestamp * 1e3 - Date.now());
    },
    [dispatch]
  );

  useEffect(() => {
    let tokenExpirationTimer: NodeJS.Timeout;
    let savedRawUserInfo = localStorage.getItem("user-info");
    if (savedRawUserInfo && firstTime) {
      const { tokenPayload, savedUserInfo } = getParsedTokenPayload(
        JSON.parse(savedRawUserInfo) as IUserInfo
      );

      dispatch(authTriggerLogin(savedUserInfo));
      tokenExpirationTimer = scheduleExpirationTokenTimer(tokenPayload.exp);
    } else if (!firstTime) {
      if (authUserInfo) {
        const { tokenPayload } = getParsedTokenPayload(authUserInfo);
        tokenExpirationTimer = scheduleExpirationTokenTimer(tokenPayload.exp);
      } else {
        localStorage.removeItem("user-info");
      }
    }

    firstTime = false;

    return () => {
      clearTimeout(tokenExpirationTimer);
    };
  }, [
    authUserInfo,
    dispatch,
    getParsedTokenPayload,
    scheduleExpirationTokenTimer,
  ]);

  return props.children as ReactElement<any, any>;
};

export default AuthKeeper;
