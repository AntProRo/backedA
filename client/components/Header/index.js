import React, { useContext, useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Image,
  NavDropdown,
  Button,
} from "react-bootstrap";
import Link from "next/link";
import Router from "next/router";
import { loginService } from "../../service/loginService";
import withAuth from "../../pages/HOC/withAuth";
import { AuthContext } from "../../context";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
let socket;
import io from "socket.io-client";
import axios from "axios";
socket = io();

function Index() {
  const [sizeBel, setSizeBell] = useState(50);
  const { getLogOut } = loginService();
  const state = useContext(AuthContext);
  const [isManager] = state.User.isManager;
  const [enableSideBar, setEnableSideBar] = state.User.enableSideBar;
  const [userId] = state.User.userId;
  const [notifications, setNotifications] = state.User.notifications;
  const logoutUser = async () => {
    await getLogOut()
      .then(function (e) {
        Router.push("/");
      })
      .catch(function (e) {
        console.log("error");
      });
  };

  const showNotifications = () => {
    if (enableSideBar) setEnableSideBar(false);
    if (!enableSideBar) setEnableSideBar(true);
  };
  const style = {
    marginTop:'8px',
  }

  const home = () => {
    Router.push("/DashboardSession");
  };

  const handleClick = (e) => {
    e.preventDefault();
    Router.push("/InfoClient");
  };



  const sentToMessenger = () => {
    Router.push("/messenger");
  };

  const sentToFindUsers = () => {
    Router.push("/addUsersToMyList");
  };

  /* New notification */
  const socketInitializerNotification = async () => {
    await axios("/api/notifications");

    const receiveNotification = (message) => {
      setNotifications([message, ...notifications]);
    };

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("newNotification", receiveNotification);

    return () => {
      socket.off("newNotification", socketInitializerNotification);
    };
  };

  useEffect(() => {
    socket.emit("joinRoomNotification", userId);
    socketInitializerNotification();
    setSizeBell(notifications.length);
    return () => {
      socket.off("newNotification", socketInitializerNotification);
    };
  }, [notifications, userId]);
  return (
    <>
      <Navbar className="borderHeader" expand="lg" variant="light" sticky="top">
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Navbar.Brand href="/">
                <Image
                  src="/logoClip.png"
                  alt=" A-Project"
                  className="MagNet ubuntu"
                />
                A-Project
              </Navbar.Brand>

              <Nav.Link href="/DashboardSession" onClick={home} className="fontNavBar ">
                Home
              </Nav.Link>
              {isManager && (
                <>
                <br/>
                <br/>
                  <span
                    type="submit"
                    onClick={handleClick}
                    className="fontNavBar"
                    style={style}
                  >
                    Clients
                  </span>
                  {/*  <Nav.Link href="/InfoClient" className="fontNavBar ">
                    Clients
                  </Nav.Link> */}
                </>
              )}

              <NavDropdown
                title="Actions"
                id="collapsable-nav-dropdown"
                className="fontNavBar "
              >
              {/*   <NavDropdown.Item href="#action/3.3" className="fontNavBar ">
                  Settings
                </NavDropdown.Item> */}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutUser} className="fontNavBar ">
                  Log out
                </NavDropdown.Item>
              </NavDropdown>

              <div className=" bell-icon" onClick={showNotifications}>
                <span type="submit">{sizeBel}</span>

                <Nav.Link>
                  <OverlayTrigger
                    key="bottom"
                    placement="bottom"
                    overlay={
                      <Tooltip id="tooltip-bottom">
                        <strong>Notifications</strong>
                      </Tooltip>
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-bell-fill"
                      viewBox="0 0 16 16"
                      onClick={showNotifications}
                    >
                      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                    </svg>
                  </OverlayTrigger>
                </Nav.Link>
              </div>
              {isManager ? (
                <>
                  {/* find Users */}
                  <div className="chat-icon" onClick={sentToFindUsers}>
                    <Nav.Link>
                      <OverlayTrigger
                        key="bottom"
                        placement="bottom"
                        overlay={
                          <Tooltip id="tooltip-bottom">
                            <strong>Find and add more collaborators</strong>
                          </Tooltip>
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="currentColor"
                          className="bi bi-person-plus-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                          <path
                            fillRule="evenodd"
                            d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                          />
                        </svg>
                      </OverlayTrigger>
                    </Nav.Link>
                  </div>

                  <div className="chatIconSeparator" onClick={sentToMessenger}>
                    <Nav.Link>
                      <OverlayTrigger
                        key="bottom"
                        placement="bottom"
                        overlay={
                          <Tooltip id="tooltip-bottom">
                            <strong>Talk with your collaborators</strong>
                          </Tooltip>
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="currentColor"
                          className="bi bi-chat-dots"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                          <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                        </svg>
                      </OverlayTrigger>
                    </Nav.Link>
                  </div>
                </>
              ) : (
                <>
                  <div className=" chat-icon" onClick={sentToMessenger}>
                    <Nav.Link>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        className="bi bi-chat-dots"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                      </svg>
                    </Nav.Link>
                  </div>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default withAuth(Index);
