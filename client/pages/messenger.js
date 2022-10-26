import React, { useContext, useEffect, useRef, useState } from "react";
import Loading from "../components/Loading";
import LoadMore from "../components/LoadMore";
import { AuthContext } from "../context";
let socket;
import io from "socket.io-client";
import axios from "axios";
import { chatService } from "../service/chatServices";
import { set } from "lodash";
socket = io();

function Messenger() {
  const state = useContext(AuthContext);
  const [itemsDashBoard, setItemsDashBoard] = state.User.itemsDashBoard;
  const [userId] = state.User.userId;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divRef = useRef(null);
  const { getChats, postComments } = chatService();
  const [chatListUser, setChatListUser] = useState([]);
  const [userInfoLogged, setUserInfoLogged] = useState({});
  const [imageUserSelected, setImageUserSelected] = useState("");

  /* Selected ChatRoom */
  const [currentSelectChat, setCurrentSelectChat] = useState("");
  const [name, setName] = useState("");

  /* Notification */
  const [notifications, setNotifications] = state.User.notifications;
  const [idUserNotification, setIdUser] = useState("");

  const getAllChats = async () => {
    try {
      await getChats().then((res) => {
        setChatListUser(res.data?.chatRoom);
        setUserInfoLogged(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const socketInitializer = async () => {
    await axios("/api/socket");
    
    const receiveMessage = (message) => {
      divRef.current?.scrollIntoView({ behavior: "smooth" });
      setMessages([message, ...messages]);
    };

    const receiveNotification = (message) => {
      setNotifications([message, ...notifications]);
    };

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("update-input", receiveMessage);
    socket.on("newNotification", receiveNotification);
    return () => {
      socket.off("update-input", socketInitializer);
    };
  };

  const getChatRoom = ({ item }) => {
    chatListUser.find((obj) => {
      if (obj._id === item._id) {
        setMessages(item.comments.reverse());
        setName(item.guestUserB.name + item.guestUserB.lastName);
      }
      return obj._id === item._id;
    });

    /*  setCurrentSelectChat(FindIDRoom._id); */
  };

  const handleSubmit = async (e) => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });

    e.preventDefault();
    const newMessage = {
      message: message,
      sendBy: userId,
      chatRoom: currentSelectChat,
    };
    setMessages([newMessage, ...messages]);
    socket.emit(
      "update-input",
      newMessage.message,
      currentSelectChat,
      newMessage.sendBy
    );
    const result = await postComments(newMessage);
    setMessage("");

    const newNotification = {
      fromName: userInfoLogged.name + " " + userInfoLogged.lastName,
      typeNotification: "message",
    };

    socket.emit(
      "newNotification",
      newNotification.fromName,
      newNotification.typeNotification,
      newMessage.message,
      idUserNotification,
      newMessage.sendBy
    );
    /*   setNotifications([newMessage, ...notifications]); */
  };

  useEffect(() => {
    getAllChats();
    socketInitializer();
    if (divRef?.current !== null) {
      divRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
    return () => {
      socket.off("update-input", socketInitializer);
    };
  }, [messages, userId, currentSelectChat, idUserNotification]);
  return (
    <>
      <div className="card">
        <div className="row g-0">
          <div className="col-12 col-lg-5 col-xl-3 border-end">
{/*             <div className="px-4 d-none d-md-block">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <input
                    type="text"
                    className="form-control my-3"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div> */}

            {chatListUser?.map((item) => {
              return (
                <div
                  onClick={() => {
                    getAllChats(),
                      getChatRoom({ item }),
                      setCurrentSelectChat(item._id),
                      socket.emit("joinRoom", item._id);
                    userId === item?.guestUserA?._id
                      ? (setImageUserSelected(item?.guestUserB?.userImage?.url),
                        setIdUser(item?.guestUserB?._id))
                      : (setImageUserSelected(item?.guestUserA?.userImage?.url),
                        setIdUser(item?.guestUserA?._id));
                  }}
                  type="submit"
                  className="p-2 border-bottom"
                  key={item._id}
                >
                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-row">
                      {item?.guestUserB?._id !== userId ? (
                        <>
                          <img
                            src={
                              item?.guestUserB?.userImage?.url
                                ? item?.guestUserB?.userImage?.url
                                : "https://res.cloudinary.com/antoapex19/image/upload/v1662361498/A-Project/avatar_gebnpv.webp"
                            }
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            alt="Sharon Lessman"
                            width="60"
                            height="50"
                          />
                        </>
                      ) : (
                        <>
                          <img
                            src={
                              item?.guestUserA?.userImage?.url
                                ? item?.guestUserA?.userImage?.url
                                : "https://res.cloudinary.com/antoapex19/image/upload/v1662361498/A-Project/avatar_gebnpv.webp"
                            }
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            alt="Sharon Lessman"
                            width="60"
                            height="50"
                          />
                        </>
                      )}

                      <div className="pt-1">
                        <p className="fw-bold mb-0">
                          {item?.guestUserB?._id !== userId ? (
                            <>
                              {item?.guestUserB?.name}{" "}
                              {item?.guestUserB?.lastName}
                            </>
                          ) : (
                            <>
                              {item?.guestUserA?.name}{" "}
                              {item?.guestUserA?.lastName}
                            </>
                          )}
                        </p>
                        <p className="small text-muted">
                          {/*  Hello, Are you there? */}
                        </p>
                      </div>
                    </div>
                 {/*    <div className="pt-1">
                      <p className="small text-muted mb-1">Just now</p>
                      <span className="badge bg-danger float-end">1</span>
                    </div> */}
                  </div>
                </div>
              );
            })}

            <hr className=" d-block d-lg-none mt-1 mb-0" />
          </div>
          <div className="col-12 col-lg-7 col-xl-9">
            <div className="py-2 px-4 border-bottom d-none d-lg-block">
              <div className="d-flex align-items-center py-1">
                <div className="position-relative">
                  <img
                    src={
                      userInfoLogged.userImage?.url
                        ? userInfoLogged.userImage?.url
                        : "https://res.cloudinary.com/antoapex19/image/upload/v1662361498/A-Project/avatar_gebnpv.webp"
                    }
                    className="rounded-circle mr-1"
                    alt="Sharon Lessman"
                    width="40"
                    height="40"
                  />
                </div>
                <div className="flex-grow-1 pl-3">
                  <strong>
                    {userInfoLogged.name} {userInfoLogged.lastName}
                  </strong>
                  {/* <div className="text-muted small">
                    <em>Typing...</em>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="position-relative">
              <div className="chat-messages p-4 chatRoom">
                {messages.length === 0 ? (
                  <div className="text-center">
                    <h1>!!! Select a user to start talking.</h1>
                  </div>
                ) : (
                  <>
                    {messages
                      .map((item, index) => (
                        <li
                          className="d-flex justify-content-between mb-4"
                          key={index}
                        >
                          {item.sendBy !== userId ? (
                            <>
                              {" "}
                              <img
                                src={
                                  imageUserSelected
                                    ? imageUserSelected
                                    : "https://res.cloudinary.com/antoapex19/image/upload/v1662361498/A-Project/avatar_gebnpv.webp"
                                }
                                alt="avatar"
                                className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                                width="60"
                              />{" "}
                            </>
                          ) : null}

                          <div
                            className={`card ${
                              item.sendBy === userId
                                ? "w-100 bg-primary text-white"
                                : ""
                            }`}
                          >
                            <div className="card-header d-flex justify-content-between p-3">
                              <p className="fw-bold mb-0">
                                {/*       {item.from} */}
                                {item.sendBy === userId ? "Me" : name}
                              </p>
                              {/* <p className="text-muted small mb-0">
                                <i className="far fa-clock"></i> 10 mins ago
                              </p> */}
                            </div>
                            <div
                              className="card-body"
                              /* ref={divRef} */ ref={
                                messages[0]?.message === item?.message
                                  ? divRef
                                  : null
                              }
                            >
                              <p className="mb-0">{item.message}</p>
                            </div>
                          </div>
                          {item.sendBy === userId ? (
                            <>
                              {" "}
                              <img
                                src={
                                  userInfoLogged.userImage?.url
                                    ? userInfoLogged.userImage?.url
                                    : "https://res.cloudinary.com/antoapex19/image/upload/v1662361498/A-Project/avatar_gebnpv.webp"
                                }
                                alt="avatar"
                                className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                                width="60"
                              />{" "}
                            </>
                          ) : null}
                        </li>
                      ))
                      .reverse()}
                  </>
                )}
              </div>
            </div>

            <div className="flex-grow-0 py-3 px-4 border-top">
              <div className="input-group">
                <input
                  ref={divRef}
                  type="text"
                  className="form-control"
                  placeholder="Type your message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
