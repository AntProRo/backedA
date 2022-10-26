import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import Image from "next/image";
import KanbanDelete from "../../../ModalComponents/KanbanOptions/KanbanDelete";
import KanbanUpdate from "../../../ModalComponents/KanbanOptions/KanbanUpdate";
import { adminService } from "../../../../service/adminService";
import moment from "moment";

function TaskCard({ item, index, collaborator, column }) {
  const [levelDateImportance,setLevelDateImportance] = useState('')
  const { updateTask } = adminService();
  /* Date */
  const [momentAct,setMoment] = useState('')
  const updateTaskSelected = async (item, column) => {
    let statusDone = "";
    if (column === "To do") {
      statusDone = "todo";
    }
    if (column === "In Progress") {
      statusDone = "inProgress";
    }
    if (column === "Review") {
      statusDone = "review";
    }
    if (column === "Completed") {
      statusDone = "completed";
    }
    const body = {
      statusDone: statusDone,
    };
    await updateTask(item._id, body);
  };
  useEffect(() => {
    updateTaskSelected(item, column);
    setLevelDateImportance(moment(item?.dateToComplete).format("MMM Do YY"))
    setMoment(moment(item?.createdAt).format("MMM Do YY"))
  }, []);
  return (
    <Draggable key={item.id} draggableId={item._id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            className="card"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              marginBottom: "1rem",
              ...provided.draggableProps.style,
            }}
            /* style={{
              userSelect: "none",
              padding: 16,
              margin: "0 0 8px 0",
              minHeight: "50px",
              backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
              color: "white",
              borderRadius: "4px",
             
            }} */
          >
            <div className="card-body p-2">
              <div className="float-start">
                {collaborator?.userImage?.url ? (
                  <Image
                    className="rounded-circle"
                    src={collaborator?.userImage?.url}
                    width={50}
                    height={50}
                  />
                ) : (
                  <Image
                    className="rounded-circle"
                    src="https://res.cloudinary.com/antoapex19/image/upload/v1662361498/A-Project/avatar_gebnpv.webp"
                    width={50}
                    height={50}
                  />
                )}
              </div>
              <div className="float-start">{item.subject}</div><br/>
              <small><b>Created on </b>{momentAct}</small>
              &nbsp;
              <div className="float-end">
                <KanbanUpdate item={item}/> <KanbanDelete item={item} />
              </div>
              <br />
              <br />
              <p>{item.description}</p>
            </div>
            <div className="card-footer ">
              <button className={`btn btn-sm float-end ${item.importanceLevel === "low" ? "btn-primary" : item.importanceLevel === "medium" ? "btn-warning" : item.importanceLevel === "high" ? "btn-danger" : "" }`}  /* className={`btn btn-primary btn-sm float-end`} */ >
                Date to Complete: {levelDateImportance}{" "}
              </button>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
}

TaskCard.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
};

export default memo(TaskCard);
