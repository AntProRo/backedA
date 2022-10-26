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
import Image from "next/image";
import { Formik } from "formik";
import Select from "react-select";
import { AuthContext } from "../../../context";
import { newCollaboratorSchema } from "../validationSchema/newCollaborator";
import CustomInput from "../../InputCustom/index";
import { adminService } from "../../../service/adminService";
import Back from "../../../public/fondo2.jpg";
import Loading from "../../Loading";
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

function UpdateUser({ item }) {
  const updateTemplate = useRef(null);
  const state = useContext(AuthContext);
  const { updateUser, uploadFile, deleteFile } = adminService();
  const { getClientList, getManager, getTechLead } = clientService();
  const [updateCollaboratorModal, setUpdateCollaboratorModal] = useState(false);

  const [callback, setCallback] = state.User.callback;
  const [isAdmin] = state.User.isAdmin;
  const [id, setId] = useState("");

  /* iMAGES */
  const [loading, setLoading] = useState(false);
  const [imagesUrl, setImagesUrl] = useState(item?.userImage?.url);
  const [imagesId, setImagesId] = useState("");
  /* iMAGES */
  const [enableManagerTechLeadHTML, setEnableManagerTechLeadHTML] =
    useState(false);
  const [hired, setHired] = useState(new Date());
  const [birthDay, setBirthDay] = useState(new Date());
  const [clientList, setClientList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [techLeadList, setTeachLeadsList] = useState([]);

  const [accountStatus, setAccountStatus] = useState({
    label: "No",
    value: "private",
  });

  const [role, setRole] = useState({
    label: "Collaborator",
    value: "Collaborator",
  });

  const [clientStatusUpdate, setClientStatusUpdate] = useState({
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
    setUpdateCollaboratorModal(false);
    /*     setClientStatusUpdate({ label: "N/A", value: "" }); */
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
      currentManager: managerStatus.value,
      currentTechLead: techLeadStatus.value,
      currentClient: clientStatusUpdate.value,
      birthDay: birthDay,
      hired: hired,
    };
    const res = await updateUser(id, body);
    setUpdateCollaboratorModal(false);
    setCallback(!callback);
  };

  useEffect(() => {
    if (item.role === "Admin") setRole({ label: "Admin", value: "Admin" });
    if (item.role === "Manager")
      setRole({ label: "Manager", value: "Manager" });
    if (item.role === "Collaborator")
      setRole({ label: "Collaborator", value: "Collaborator" });
    setId(item._id);
    if (item.status === "public") {
      setAccountStatus({ label: "Yes", value: "public" });
    }
  }, []);

  /* IMAGE */
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
  /* IMAGE */

  const handleList = async ({ item }) => {
    try {
      await getClientList().then(async (response) => {
        const setClientListToDropDown = response?.data?.result.find(
          (o) => o._id === item?.currentClient
        );
        setClientStatusUpdate({
          label: setClientListToDropDown?.name,
          value: item?.currentClient,
        });

        setClientList(
          response?.data?.result?.map((item) => ({
            label: item?.name,
            value: item?._id,
          }))
        );
      });

      /*  setClientStatusUpdate({ label: setClientListToDropDown, value: item?.currentClient });  */

      setEnableManagerTechLeadHTML(true);
    } catch (err) {
      console.log(err);
    }
  };
  const handleManagerAndTechLead = async (item) => {
    /* if (clientStatus.label != "N/A") {
       let resManager = await getManager(clientStatus.value).then((response)=> {
        console.log(response)
        const setManagerListToDropDown = response?.data?.find((o) => o._id === item?.currentManager)
        setManagerStatus({ label: setManagerListToDropDown.name, value: item?.currentManager }) 
       });
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
      );


    }  */
  };

  useEffect(
    () => {
      handleList({ item });

      /*     if (enableManagerTechLeadHTML) {
      handleManagerAndTechLead();
    } */
    },
    [
      /* enableManagerTechLeadHTML */
    ]
  );

  const newData = async (get) => {
    if (get) {
      await getManager(get).then(async (response) => {
        const setClientListToDropDown = response?.data?.find(
          (o) => o._id === item?.currentManager
        );
        setManagerStatus({
          label: setClientListToDropDown?.clientManagerName || "N/A",
          value: item?.currentManager || "",
        });

        setManagerList(
          response?.data?.map((item) => ({
            label: item.clientManagerName + " " + item.clientManagerLastName || "N/A",
            value: item._id || "",
          }))
        );
      });

      await getTechLead(get).then(async (response) => {
        const setTechLeadListToDropDown = response?.data?.find(
          (o) => o._id === item?.currentTechLead
        );
        setTechLeadStatus({
          label:
            setTechLeadListToDropDown?.projectTechLeadName +
            " " +
            setTechLeadListToDropDown?.projectTechLeadLastName || "N/A",
          value: item?.currentTechLead  || "",
        });

        setTeachLeadsList(
          response?.data?.map((item) => ({
            label:
              item?.projectTechLeadName + " " + item.projectTechLeadLastName || "N/A",
            value: item?._id || "",
          }))
        );
      });
    }
  };

  useEffect(() => {
    if (clientStatusUpdate != item?.currentClient) {
      newData(clientStatusUpdate.value);
    } else {
      newData(item?.currentClient);
    }
  }, [clientStatusUpdate]);

  return (
    <>
      <OverlayTrigger
        overlay={
          <Tooltip id={`tooltip-bottom`}>
            <strong>Update information of {item.name}</strong>.
          </Tooltip>
        }
      >
        <svg
          onClick={() => setUpdateCollaboratorModal(true)}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="bi bi-pencil-square"
          viewBox="0 0 16 16"
          type="submit"
        >
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
          <path
            fillRule="evenodd"
            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
          />
        </svg>
      </OverlayTrigger>
      <Modal show={updateCollaboratorModal} onHide={handleClose}>
        <div ref={updateTemplate}>
          <Formik
            enableReinitialize
            initialValues={{
              name: item.name,
              lastName: item.lastName,
              email: item.email,
              occupation: item.occupation,
            }}
            /* validationSchema={newCollaboratorSchema} */
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} id="formTemplateUpdateUser">
                <Modal.Header closeButton>
                  <Modal.Title>
                    Update info of {item.name} {item.lastName}
                  </Modal.Title>
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
                        This account will be public?
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
                        Current Client
                      </label>
                      <Select
                        id="client"
                        name="client"
                        options={clientList}
                        isSearchable={true}
                        getOptionLabel={(option) => option.label || "N/A"}
                        getOptionValue={(option) => option.value || ""}
                        value={clientStatusUpdate}
                        onChange={(selected) => setClientStatusUpdate(selected)}
                      />
                    </Col>

                    {clientStatusUpdate.label != "N/A" ? (
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
                            getOptionLabel={(option) => option.label || "N/A"}
                            getOptionValue={(option) => option.value || ""}
                            value={managerStatus}
                            onChange={(selected) => setManagerStatus(selected)}
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
                            getOptionLabel={(option) => option.label || "N/A"}
                            getOptionValue={(option) => option.value || ""}
                            value={techLeadStatus}
                            onChange={(selected) => setTechLeadStatus(selected)}
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
          <Button type="submit" variant="primary" form="formTemplateUpdateUser">
            Update user
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateUser;
