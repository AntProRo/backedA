/* eslint-disable react/display-name */
import React, { useContext } from "react";
import { AuthContext } from "../../../context";

const roleAccess = (WrappedComponent) => {
  return (props) => {
    const state = useContext(AuthContext);
    const [isAdmin] = state.User.isAdmin;

    if (isAdmin) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
}


export default roleAccess;
