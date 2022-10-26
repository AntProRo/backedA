import React, { useContext, useRef, useState } from "react";
import { Modal, Form, Button, Col, Row } from "react-bootstrap";

import { Formik } from "formik";

import { newCollaboratorSchema } from "../validationSchema/newCollaborator";
import CustomInput from "../../InputCustom/index";
import { clientService } from "../../../service/clientService";
import { AuthContext } from "../../../context";

function NewClientButton() {
  const { newClient } = clientService();
  const updateTemplate = useRef(null);
  const state = useContext(AuthContext);
  const [callback, setCallback] = state.User.callback;

  const [newClientModal, setNewClientModal] = useState(false);

  const handleClose = () => {
    setNewClientModal(false);
  };
  const onSubmit = async (values) => {
    const { name } = values;

    const body = {
      name: name,
    };
    const res = await newClient(body);
    setNewClientModal(false);
    setCallback(!callback);
  };

  return (
    <>
      <div
        onClick={() => setNewClientModal(true)}
        className="container general_Top"
      >
        <div className="open_icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.31 28.83">
            <path
              className="plus_sign"
              d="M20.74,20.83V9.59H27.2V20.83h11v6.28h-11v11.3H20.74V27.11H9.85V20.83h10.9Z"
              transform="translate(-9.85 -9.59)"
            />
          </svg>
        </div>
      </div>

      <Modal show={newClientModal} onHide={handleClose}>
        <div ref={updateTemplate}>
          <Formik
            /* enableReinitialize */
            initialValues={{
              name: "",
            }}
            /* validationSchema={newCollaboratorSchema} */
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} id="formTemplate">
                <Modal.Header closeButton>
                  <Modal.Title>Create a new client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row className="mb-6">
                    <Col xs={12} md={12} aria-label="Name" className="mb-4">
                      <CustomInput
                        label="Name"
                        name="name"
                        id="name"
                        type="text"
                        placeholder="Name"
                        value={props.values.name}
                        required
                      />
                    </Col>
                  </Row>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" form="formTemplate">
            Create Client
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NewClientButton;
