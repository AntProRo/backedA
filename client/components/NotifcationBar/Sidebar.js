import { useContext, useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Image,
  NavDropdown,
  Button,
  Card,
  Toast,
} from "react-bootstrap";
import { AuthContext } from "../../context";

function Sidebar() {
  const state = useContext(AuthContext);
  const [enableSideBar, setEnableSideBar] = state.User.enableSideBar;
  const [notifications, setNotifications] = state.User.notifications;
  const showNotifications = () => {
    if (enableSideBar) setEnableSideBar(false);
    if (!enableSideBar) setEnableSideBar(true);
  };

  return (
    <nav className={enableSideBar ? "sidebar displayBar" : "sidebar"}>
      <div className="nav__container">
        <br /> <br />
        <br />
        <Button className="btn-danger" onClick={showNotifications}>
          Close SideBar
        </Button>
        <br /> <br />
        {notifications.map((item, index) => (
          <>
            <Toast key={index}>
              <Toast.Header closeButton={false}>
                <strong className="me-auto">
                  new Notification from {item.fromName}
                </strong>
                {/*  <small>11 mins ago</small> */}
              </Toast.Header>
              {item.typeNotification === "message" ? (
                <>
                  {" "}
                  <Toast.Body>{item.message}</Toast.Body>
                </>
              ) : null}
            </Toast>
            <br />
        
          </>
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;
