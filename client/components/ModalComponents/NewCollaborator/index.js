import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Modal,
  OverlayTrigger,
  Tooltip,
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import Back from "../../../public/fondo2.jpg";
import Image from "next/image";
import { Formik } from "formik";
import Select from "react-select";
import { newCollaboratorSchema } from "../validationSchema/newCollaborator";
import CustomInput from "../../InputCustom/index";
import { adminService } from "../../../service/adminService";
import { AuthContext } from "../../../context";
import Loading from "../../Loading/index";
import { clientService } from "../../../service/clientService";
import ReactDatePicker from "react-datepicker";

const accountOptions = [
  { label: "Yes", value: "public" },
  { label: "No", value: "private" },
];
const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "Collaborator", value: "Collaborator" },
];

function NewCollaboratorButton() {
  const { registerNewUser, uploadFile, deleteFile } = adminService();
  const { getClientList, getManager, getTechLead } = clientService();
  const updateTemplate = useRef(null);
  const state = useContext(AuthContext);
  const [callback, setCallback] = state.User.callback;
  const [isAdmin] = state.User.isAdmin;
  /* iMAGES */
  const [loading, setLoading] = useState(false);
  const [imagesUrl, setImagesUrl] = useState("");
  const [imagesId, setImagesId] = useState("");
  /* iMAGES */

  const [newCollaboratorModal, setNewCollaboratorModal] = useState(false);
  const [accountStatus, setAccountStatus] = useState({
    label: "No",
    value: "private",
  });

  const [role, setRole] = useState({
    label: "Collaborator",
    value: "Collaborator",
  });

  const [enableManagerTechLeadHTML, setEnableManagerTechLeadHTML] =
    useState(false);
  const [hired, setHired] = useState(new Date());
  const [birthDay, setBirthDay] = useState(new Date());
  const [clientList, setClientList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [techLeadList, setTeachLeadsList] = useState([]);

  const [clientStatus, setClientStatus] = useState({
    label: "N/A",
    value: "",
  });
  const [managerStatus, setManagerStatus] = useState({
    label: "N/A",
    value: "",
  });
  const [techLeadStatus, setTechLeadStatus] = useState({
    label: "N/A",
    value: "",
  });

  const handleClose = () => {
    setNewCollaboratorModal(false);
    setClientStatus({ label: "N/A", value: "" });
  };
  const onSubmit = async (values) => {
    const { email, lastName, name, occupation } = values;

    const body = {
      email: email,
      lastName: lastName,
      name: name,
      occupation: occupation,
      status: accountStatus.value,
      role: role.value,
      userImage: {
        public_id: imagesId,
        url: imagesUrl,
      },
      currentManager:managerStatus.value,
      currentTechLead:techLeadStatus.value,
      currentClient:clientStatus.value,
      birthDay:birthDay,
      hired:hired,
    };
    const res = await registerNewUser(body);
    setNewCollaboratorModal(false);
    setCallback(!callback);
  };

  const styleUpload = {
    display: imagesUrl ? "block" : "none",
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];

      if (!file) return alert("file not exist");

      if (file.size > 1024 * 1024) return alert("File not exist");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("File format is incorrect");
      setLoading(true);
      let formData = new FormData();
      formData.append("file", file);
      const res = await uploadFile(formData);

      setLoading(false);
      setImagesUrl(res.data.url);
      setImagesId(res.data.public_id);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  const handleDestroy = async () => {
    try {
      setLoading(true);
      const res = await deleteFile({ public_id: imagesId });
      setLoading(false);
      setImagesUrl("");
      setImagesId("");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  const handleList = async () => {
    let res = await getClientList();

    setClientList(
      res?.data?.result?.map((item) => ({
        label: item.name,
        value: item._id,
      }))
    );
    setEnableManagerTechLeadHTML(true);
  };
  const handleManagerAndTechLead = async () => {
    if (clientStatus.label != "N/A") {
      let resManager = await getManager(clientStatus.value);
      let resTechLead = await getTechLead(clientStatus.value);

      setManagerList(
        resManager?.data?.map((item) => ({
          label: item.clientManagerName + ' '+item.clientManagerLastName,
          value: item._id,
        }))
      ); 
      setTeachLeadsList(
        resTechLead?.data?.map((item) => ({
          label: item.projectTechLeadName + ' '+item.projectTechLeadLastName,
          value: item._id,
        }))
      )
    }
  };

  useEffect(() => {
    handleList();
    if (enableManagerTechLeadHTML) {
      handleManagerAndTechLead();
    }
  }, [enableManagerTechLeadHTML,clientStatus]);
  return (
    <>
      <div
        onClick={() => setNewCollaboratorModal(true)}
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

      <Modal show={newCollaboratorModal} onHide={handleClose}>
        <div ref={updateTemplate}>
          <Formik
            /* enableReinitialize */
            initialValues={{
              name: "",
              lastName: "",
              email: "",
              occupation: "",
            }}
            validationSchema={newCollaboratorSchema}
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} id="formTemplate">
                <Modal.Header closeButton>
                  <Modal.Title>Create a new user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="imageTitle">Select a image: </div>

                  <div className="upload">
                    <input
                      type="file"
                      name="file"
                      id="file_up"
                      onChange={handleUpload}
                    ></input>

                    {loading ? (
                      <div id="file_Loader">
                        {" "}
                        <Loading />{" "}
                      </div>
                    ) : (
                      <div id="file_img" style={styleUpload}>
                        <Image
                          /*   style={{marginLeft:'10rem'}} */
                          src={imagesUrl ? imagesUrl : Back}
                          width={500}
                          height={400}
                          alt="Pro_Image"
                        />

                        <span id="file_img_delete" onClick={handleDestroy}>
                          X
                        </span>
                      </div>
                    )}
                  </div>

                  <Row className="mb-6">
                    <Col xs={12} lg={12} className="mb-4">
                      <label
                        htmlFor="blockAccountDropDown"
                        className="form-label"
                      >
                        This account will be private or public?
                      </label>
                      <Select
                        id="blockAccountDropDown"
                        name="blockAccountDropDown"
                        options={accountOptions}
                        isSearchable={false}
                        getOptionLabel={(option) => option.label || ""}
                        getOptionValue={(option) => option.value || ""}
                        value={accountStatus}
                        onChange={(selected) => setAccountStatus(selected)}
                      />
                    </Col>
                    {isAdmin && (
                      <Col xs={12} lg={12} className="mb-4">
                        <label
                          htmlFor="roleAccountDropDown"
                          className="form-label"
                        >
                          Choose the User role
                        </label>
                        <Select
                          id="roleAccountDropDown"
                          name="roleAccountDropDown"
                          options={roleOptions}
                          isSearchable={false}
                          getOptionLabel={(option) => option.label || ""}
                          getOptionValue={(option) => option.value || ""}
                          value={role}
                          onChange={(selected) => setRole(selected)}
                        />
                      </Col>
                    )}

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

                    <Col xs={12} md={12} aria-label="lastName" className="mb-4">
                      <CustomInput
                        label="Last Name"
                        name="lastName"
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={props.values.lastName}
                        required
                      />
                    </Col>

                    <Col xs={12} md={12} aria-label="email" className="mb-4">
                      <CustomInput
                        label="Email"
                        name="email"
                        id="email"
                        type="text"
                        placeholder="Email"
                        value={props.values.email}
                        required
                      />
                    </Col>

                    <Col
                      xs={12}
                      md={12}
                      aria-label="occupation"
                      className="mb-4"
                    >
                      <CustomInput
                        label="Occupation"
                        name="occupation"
                        id="occupation"
                        type="text"
                        placeholder="Occupation"
                        value={props.values.occupation}
                        required
                      />
                    </Col>

                    <Col xs={12} md={12} aria-label="birthDay" className="mb-4">
                      <span>Birth Day</span>
                      <ReactDatePicker
                        selected={birthDay}
                        onChange={(date) => setBirthDay(date)}
                      />
                    </Col>

                    <Col xs={12} md={12} aria-label="hired" className="mb-4">
                      <span>Hired</span>
                      <ReactDatePicker
                        selected={hired}
                        onChange={(date) => setHired(date)}
                      />
                    </Col>

                    <Col xs={12} lg={12} className="mb-4">
                      <label htmlFor="client" className="form-label">
                        Current Project
                      </label>
                      <Select
                        id="client"
                        name="client"
                        options={clientList}
                        isSearchable={true}
                        getOptionLabel={(option) => option.label || ""}
                        getOptionValue={(option) => option.value || ""}
                        value={clientStatus}
                        onChange={(selected) => setClientStatus(selected)}
                      />
                    </Col>



                    {clientStatus.label != "N/A" ? (
                      <>
                        <Col xs={12} lg={12} className="mb-4">
                          <label htmlFor="manager" className="form-label">
                            Current Manager
                          </label>
                          <Select
                            id="manager"
                            name="manager"
                            options={managerList}
                            isSearchable={true}
                            getOptionLabel={(option) => option.label || ""}
                            getOptionValue={(option) => option.value || ""}
                            value={managerStatus}
                            onChange={(selected) =>  setManagerStatus(selected)}
                          />
                        </Col>

                        <Col xs={12} lg={12} className="mb-4">
                          <label htmlFor="techLead" className="form-label">
                            Current Tech Lead
                          </label>
                          <Select
                            id="techLead"
                            name="techLead"
                            options={techLeadList}
                            isSearchable={true}
                            getOptionLabel={(option) => option.label || ""}
                            getOptionValue={(option) => option.value || ""}
                            value={techLeadStatus}
                            onChange={(selected) =>  setTechLeadStatus(selected)}
                          />
                        </Col>

                      </>
                    ) : null}
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
            Create user
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NewCollaboratorButton;
