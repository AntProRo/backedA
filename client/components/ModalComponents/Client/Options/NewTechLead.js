import { useContext, useRef } from "react";
import { Modal, Form, Button, Col, Row } from "react-bootstrap";
import { Formik } from "formik";
import { clientService } from "../../../../service/clientService";
import { AuthContext } from "../../../../context";
import CustomInput from "../../../InputCustom";

function NewTechLead({ show, onHide, item }) {
  const techLeadClient = useRef(null);

  const { newTechLead } = clientService();
  const state = useContext(AuthContext);
  const [callback, setCallback] = state.User.callback;

  const handleClose = () => {
    onHide();
  };

  const onSubmit = async (values) => {
    const { name, lastName, email, occupation } = values;

    const body = {
      projectTechLeadName: name,
      projectTechLeadLastName: lastName,
      email: email,
      occupation: occupation,
      client: item,
    };
    const res = await newTechLead(body);
    setCallback(!callback);
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <div ref={techLeadClient}>
          <Formik
            /* enableReinitialize */
            initialValues={{
              name: "",
              lastName: "",
              email: "",
              occupation: "",
            }}
            /*  validationSchema={newCollaboratorSchema} */
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} id="formTechLead">
                <Modal.Header className="client text-light">
                  <Modal.Title>Add a new TechLead</Modal.Title>
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

                  <Row className="mb-6">
                    <Col
                      xs={12}
                      md={12}
                      aria-label="Occupation"
                      className="mb-4"
                    >
                      <CustomInput
                        label="occupation"
                        name="occupation"
                        id="occupation"
                        type="text"
                        placeholder="Occupation"
                        value={props.values.occupation}
                        required
                      />
                    </Col>
                  </Row>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </div>
        <Modal.Footer  className="client">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button variant="primary" type="submit" form="formTechLead">
            Add a new TechLead
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NewTechLead;
