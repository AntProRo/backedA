import { useEffect, useState } from "react";
import Image from "next/image";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { adminService } from "../../../service/adminService";
import IconPersonCard from "../../Icons/IconPersonCard";
import LoadMore from "../../LoadMore";
import roleAccess from "./roleAccess";
import PersonIcon from "../../Icons/PersonIcon";

import { Modal, Button } from "react-bootstrap";

function AddNewUserToMyList() {
  const { getAllUserNotAdded, addNewUserToMyList } = adminService();

  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsDashBoard, setItemsDashBoard] = useState([]);
  const [addUserModal, setAddUserModal] = useState(false);
  const [item, setItem] = useState({});
  const [callback, setCallback] = useState(false);

  const getAllUser = async () => {
    const res = await getAllUserNotAdded("Manager", sort, search, page);
    setItemsDashBoard(res.data.users);
  };

  const submit = async () => {
    const res = await addNewUserToMyList(item._id);
   
    setCallback(!callback);
    handleClose();
  };

  const handleClose = () => {
    setAddUserModal(false);
  };

  useEffect(() => {
    getAllUser();
  }, [search, item,callback]);


  return (
    <>
      <div className="content-wrap">
        <div className="cardSearch container">
          <div className="card-body">
            <div className="input-group">
              <input
                size="100"
                type="text"
                className="form-control"
                placeholder="Find and Add more user"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <br />
        <br />
        <br />
        <div className="cards ">
          {itemsDashBoard.map((item) => {
            return (
              <div
                className="containerUser container general_Top"
                key={item._id}
              >
                <div className="cardUser">
                  <div className="slide slide1">
                    <OverlayTrigger
                      key="bottom"
                      placement="bottom"
                      overlay={
                        <Tooltip id={`tooltip-bottom`}>
                          <strong>
                            {item.name} {item.lastName}
                          </strong>
                          .
                        </Tooltip>
                      }
                    >
                      <div className="contentUser">
                        <div className="icon">
                          {item?.userImage?.url ? (
                            <Image
                              src={item?.userImage?.url}
                              width={300}
                              height={200}
                            />
                          ) : (
                            <PersonIcon />
                          )}
                        </div>
                      </div>
                    </OverlayTrigger>
                  </div>

                  <div className="slide slide2">
                    <div className="contentUser">
                      <h3>
                        {" "}
                        {item.name} {item.lastName}{" "}
                      </h3>

                      <p>{item.occupation}</p>

                      <div>
                        <OverlayTrigger
                          overlay={
                            <Tooltip id={`tooltip-bottom`}>
                              <strong>Add this user to my list</strong>.
                            </Tooltip>
                          }
                        >
                          <svg
                            onClick={() => {
                              setAddUserModal(true), setItem(item);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="36"
                            height="36"
                            fill="currentColor"
                            className="bi bi-file-plus"
                            viewBox="0 0 16 16"
                            type="submit"
                          >
                            <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z" />
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
                          </svg>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <LoadMore />
      </div>

      <Modal show={addUserModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure?, Do you want to add this user {item.name}{" "}
            {item.lastName}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This user has a {item.status} profile</p>
          <p>Occupation: {item.occupation}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={() => {
              submit();
            }}
          >
            Yes, Add {item.name} to my list
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default roleAccess(AddNewUserToMyList);
