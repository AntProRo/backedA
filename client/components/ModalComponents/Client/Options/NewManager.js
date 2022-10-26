import { useContext, useRef } from "react";
import { Modal, Form, Button, Col, Row } from "react-bootstrap";
import { Formik } from "formik";
import { AuthContext } from "../../../../context";
import CustomInput from "../../../InputCustom";
import { clientService } from "../../../../service/clientService";

function NewManager({ show, onHide, item }) {
  const { newManager } = clientService();
  const state = useContext(AuthContext);
  const [callback, setCallback] = state.User.callback;

  const managerClient = useRef(null);

  const handleClose = () => {
    onHide();
  };

  const onSubmit = async (values) => {
    const { name, lastName, email } = values;

    const body = {
      clientManagerName: name,
      clientManagerLastName: lastName,
      email: email,
      client: item,
    };
    const res = await newManager(body);
    setCallback(!callback);
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <div ref={managerClient}>
          <Formik
            /* enableReinitialize */
            initialValues={{
              name: "",
              lastName: "",
              email: "",
            }}
            /*  validationSchema={newCollaboratorSchema} */
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} id="formManager">
                <Modal.Header className="client text-light">
                  <Modal.Title>Add a new manager</Modal.Title>
                </Modal.Header>
                <Modal.Body className="client text-light">
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

                  <Row className="mb-6">
                    <Col xs={12} md={12} aria-label="LastName" className="mb-4">
                      <CustomInput
                        label="lastName"
                        name="lastName"
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={props.values.lastName}
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="mb-6">
                    <Col xs={12} md={12} aria-label="Email" className="mb-4">
                      <CustomInput
                        label="email"
                        name="email"
                        id="email"
                        type="text"
                        placeholder="Email"
                        value={props.values.email}
                        required
                      />
                    </Col>
                  </Row>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </div>
        <Modal.Footer className="client">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button type="submit" variant="primary" form="formManager">
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NewManager;
