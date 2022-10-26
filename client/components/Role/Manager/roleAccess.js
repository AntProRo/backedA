/* eslint-disable react/display-name */
import React, { useContext } from "react";
import { AuthContext } from "../../../context";

const roleAccess = (WrappedComponent) => {
  return (props) => {
    const state = useContext(AuthContext);
    const [isManager] = state.User.isManager;

    if (isManager) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
}

export default roleAccess;
