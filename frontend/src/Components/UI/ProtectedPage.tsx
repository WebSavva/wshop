import { useAppSelector } from "../../store/typed-hooks";
import { useHistory } from "react-router";
import React, { ReactElement } from "react";

const ProtectedPage: React.FC<{
  children: ReactElement<any, any>;
  onlyAdmin?: boolean;
}> = ({ children, onlyAdmin }) => {
  const authUserInfo = useAppSelector((state) => state.auth.data);
  const history = useHistory();
  if (!authUserInfo || (onlyAdmin && !authUserInfo.isAdmin)) {
    history.replace("/login");
  }

  return children;
};

export default ProtectedPage;
