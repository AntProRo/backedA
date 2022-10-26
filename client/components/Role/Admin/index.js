import { useContext, useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Router from "next/router";
import PersonIcon from "../../Icons/PersonIcon";
import IconPersonCard from "../../Icons/IconPersonCard";
import roleAccess from "./roleAccess";
import NewCollaborator from "../../ModalComponents/NewCollaborator";
import { AuthContext } from "../../../context";
import Image from "next/image";

function Admin() {
  const state = useContext(AuthContext);
  const [itemsDashBoard, setItemsDashBoard] = state.User.itemsDashBoard;

/*   const kanbaLink = (id,userId) => {
    Router.push({
      pathname: `/KanbaBoard/${id}`,
      query: { keyword: userId },
    });
  }; */
  return (
    <>
      <NewCollaborator />
      <div className="cards ">
        {itemsDashBoard.map((item) => {
          return (
            <div className="containerUser container general_Top" key={item._id}>
              <div className="cardUser">
                <div className="slide slide1">
                  <OverlayTrigger
                    key="bottom"
                    placement="bottom"
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        <strong>Kanban Board</strong>.
                      </Tooltip>
                    }
                  >
                    <div
                      className="contentUser"
                      /* onClick={() =>
                        kanbaLink(`${item._id}&${item.name}&${item.lastName}`,item._id)
                      } */
                    >
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
                      {item.name} {item.lastName}
                    </h3>
                    <p>{item.occupation}</p>

                    <div>
                      <IconPersonCard item={item} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default roleAccess(Admin);
