import { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AuthContext } from "../../../context/index.js";
import { commonService } from "../../../service/HttpNoTokenRequired/commonService.js";

const initialState = {
  email: "",
};

function RestorePassWordButton() {
  const state = useContext(AuthContext);
  const { restorePassword } = commonService();
  const [showAlert, setShowAlert] = state.User.alert;

  const [newPasswordModalShow, setNewPasswordModalShow] = useState(false);
  const handleClose = () => {
    setNewPasswordModalShow(false);
  };
  const [email, setEmail] = useState(initialState);
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setEmail({ ...email, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await restorePassword(email);
    if (res.status !== 200) {
      setShowAlert({
        status: true,
        message: "User and Password incorrect",
        type: "ERROR",
        duration: 3000,
        position: "top-right",
      });
    } else {
      setShowAlert({
        status: true,
        message: "Hello again",
        type: "SUCCESS",
        duration: 10000,
        position: "top-right",
      });
    }
  };
  return (
    <>
      <p
        onClick={() => setNewPasswordModalShow(true)}
        type="button"
        className="bold"
      >
        or Restore your password
      </p>
      <Modal show={newPasswordModalShow} onHide={handleClose}>
        <form method="POST" onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Type your Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Email</Form.Label>
            <Form.Control
              onChange={handleChangeInput}
              name="email"
              className="form-control "
              type="email"
              placeholder="Email address"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary" onClick={handleClose}>
              Restore my password
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default RestorePassWordButton;
