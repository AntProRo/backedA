import React, { useContext, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../../context";
import { adminService } from "../../../service/adminService";

function KanbanDelete({item}) {
    const state = useContext(AuthContext);
    const [callback, setCallback] = state.User.callback;
    const { deleteTask } = adminService();
    const [deleteModal, setDeleteModal] = useState(false);
    const handleClose = () => {
        setDeleteModal(false);
    };

    const submit = async () => {
        const res = await deleteTask(item._id);
        setCallback(!callback);
      };

  return (
    <>
      <svg
      onClick={() => setDeleteModal(true)}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        className="bi bi-trash-fill"
        viewBox="0 0 16 16"
        color="#EF2B14"
        type="submit"
      >
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
      </svg>


      <Modal show={deleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you want to delete {item.subject}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            This task will be deleted for ever
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
            Delete {item.subject}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default KanbanDelete;
