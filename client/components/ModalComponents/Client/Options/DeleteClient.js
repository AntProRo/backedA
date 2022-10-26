import { useContext, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../../../context";
import { clientService } from "../../../../service/clientService";

function DeleteClient({ item, clientStatus, techLeadStatus, managerStatus }) {
  const state = useContext(AuthContext);
  const [callback, setCallback] = state.User.callback;
  const { deleteClient,deleteTechLead,deleteManager  } = clientService();
  const [deleteModal, setDeleteModal ] = useState(false);
  const handleClose = () => {
    setDeleteModal(false);
  };

  const submit = async () => {
    let res;
    if (clientStatus) {
      res = await deleteClient(item._id);
    }
    if (techLeadStatus) {
      res = await deleteTechLead(item._id);
    }
    if (managerStatus) {
      res = await deleteManager(item._id);
    }

    setCallback(!callback);
    setDeleteModal(false)
  };

  return (
    <>
      {clientStatus ? (
        <>
          <button
            type="button"
            onClick={() => setDeleteModal(true)}
            className="btn btn-danger btn-small"
          >
            Delete Client
          </button>
        </>
      ) : techLeadStatus  || managerStatus ? (
        <>
          <td>
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fillRule="red"
                className="bi bi-trash3"
                viewBox="0 0 16 16"
                fill="red"
                type="submit"
                onClick={() => setDeleteModal(true)}
              >
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
              </svg>
            </div>
          </td>
        </>
      ) : null}

      <Modal show={deleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you want to delete {item.subject}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>This task will be deleted for ever</Modal.Body>

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

export default DeleteClient;
