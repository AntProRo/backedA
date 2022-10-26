import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context";
import withAuth from "./HOC/withAuth";
import Router from "next/router";
import AddNewUserToMyList from "../components/Role/Manager/AddNewUserToMyList";

function AddUsersToMyList() {
  const state = useContext(AuthContext);
  const [isManager] = state.User.isManager;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isManager) Router.push("/");
    }, 1000);
    return () => clearTimeout(timer);
  }, [isManager]);

  return <AddNewUserToMyList />;
}

export default withAuth(AddUsersToMyList);
