import React, { useContext, useEffect, useState } from "react";
import roleAccess from "./roleAccess";
import Link from "next/link";
import { AuthContext } from "../../../context";
import moment from "moment";

function Collaborator() {
  const state = useContext(AuthContext);
  const [itemsDashBoard, setItemsDashBoard] = state.User.itemsDashBoard;
  /* useEffect(() => {
    setActivities((prev) =>
      prev.filter((fruit) => fruit.observable === "public")
    );
  }, []); */
  return (
    <>
      <div className="dahsBoardActivity">
        {itemsDashBoard.map((act) => {
          return (
            <div key={act._id}>
              {act.observable === "public" ? (
                <div className="co-register100">
                  <div
                    className={`card ${
                      act.importanceLevel === "low"
                        ? "bg-primary text-white"
                        : act.importanceLevel === "medium"
                        ? "bg-warning text-dark"
                        : act.importanceLevel === "high"
                        ? "bg-danger text-white"
                        : "bg-dark text-white"
                    }`}
                  >
                    <h5 className="card-header">
                      Priority: {act.importanceLevel}
                    </h5>
                    <div className="card-body">
                      <h5 className="card-title">{act.subject}</h5>
                      <p className="card-text">{act.description}</p>
                    </div>
                    <ul className="list-group list-group-flush">
                      <button type="button" className="btn btn-light btn-sm">
                        Date to complete {moment(act?.dateToComplete).format("MMM Do YY")}
                      </button>
                    </ul>
                  </div>
                </div>
              ) : (
                <h1 className="text-center">Nice!... You don not have pending</h1>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default roleAccess(Collaborator);
