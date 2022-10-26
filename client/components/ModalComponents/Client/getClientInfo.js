import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Modal,
  OverlayTrigger,
  Tooltip,
  Form,
  Button,
  Table,
} from "react-bootstrap";

import { Formik } from "formik";

import NewManager from "./Options/NewManager";
import NewTechLead from "./Options/NewTechLead";
import { AuthContext } from "../../../context";
import { clientService } from "../../../service/clientService";

import DeleteClient from "./Options/DeleteClient";

function ClientInfo({ show, onHide, item }) {
  const state = useContext(AuthContext);
  const [callback, setCallback] = state.User.callback;
  const clientTemplate = useRef(null);
  const [modalManager, setModalManager] = useState(false);
  const [modalTeachLead, setModalTechLead] = useState(false);

  const [listManager, setListManager] = useState([]);
  const [listTechLead, setListTechLead] = useState([]);

  const { getManager, getTechLead } = clientService();

  const handleClose = () => {
    onHide();
    setListManager([]);
    setListTechLead([]);
  };

  const getDataTM = async () => {
    const resManager = await getManager(item);
    setListManager(resManager?.data);

    const resTechLead = await getTechLead(item);
    setListTechLead(resTechLead?.data);
  };

  useEffect(() => {
    if (item) {
      getDataTM();
    }
  }, [callback, item]);

  return (
    <>
      <Modal show={show} onHide={handleClose} fullscreen>
        <div ref={clientTemplate}>
          <Formik
          /* enableReinitialize */
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} id="formTemplate">
                <Modal.Header closeButton>
                  <Modal.Title>List of Managers and TechLeads</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="card-text text-center">
                    <h2>Managers: </h2>
                  </div>
                  <Table
                    responsive="xl"
                    striped
                    bordered
                    hover /*variant="dark" */
                  >
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listManager?.map((item) => {
                        return (
                          <tr key={item._id}>
                            <td>{item.clientManagerName}</td>
                            <td>{item.clientManagerLastName}</td>
                            <td>{item.email}</td>
                            <DeleteClient item={item} managerStatus={true} />
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  <div className="card-text text-center">
                    <h2>TechLeads: </h2>
                  </div>
                  <Table
                    responsive="xl"
                    striped
                    bordered
                    hover /* variant="dark" */
                  >
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Occupation</th>
                        <th>Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listTechLead?.map((item) => {
                        return (
                          <tr key={item._id}>
                            <td>{item.projectTechLeadName}</td>
                            <td>{item.projectTechLeadLastName}</td>
                            <td>{item.email}</td>
                            <td>{item.occupation}</td>

                            <DeleteClient item={item} techLeadStatus={true} />
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button variant="primary" onClick={() => setModalManager(true)}>
            Add a new Manager
          </Button>

          <Button variant="primary" onClick={() => setModalTechLead(true)}>
            Add a new TechLead
          </Button>
        </Modal.Footer>

        <NewManager
          show={modalManager}
          onHide={() => {
            setModalManager(false);
          }}
          item={item}
        />
        <NewTechLead
          show={modalTeachLead}
          onHide={() => {
            setModalTechLead(false);
          }}
          item={item}
        />
      </Modal>
    </>
  );
}

export default ClientInfo;
