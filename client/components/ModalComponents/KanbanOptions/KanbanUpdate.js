import { useContext, useRef, useState } from "react";
import {
  Modal,
  OverlayTrigger,
  Tooltip,
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import { Formik } from "formik";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import CustomInput from "../../InputCustom";
import { adminService } from "../../../service/adminService";
import { AuthContext } from "../../../context";
import Image from "next/image";
import Back from "../../../public/fondo2.jpg";
import Loading from "../../Loading";
import TextAreaInput from "../../TextAreaInput/TextAreaInput";

const importanceLevel = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];
const observable = [
  { label: "Private", value: "private" },
  { label: "Public", value: "public" },
];

function KanbanUpdate({ item }) {
  const createTemplate = useRef(null);
  const [updateTaskModal, setUpdateTaskModal] = useState(false);
  const { updateTask, uploadFile, deleteFile } = adminService();

  const state = useContext(AuthContext);
  const [callback, setCallback] = state.User.callback;

  const [importanceStatus, setImportanceStatus] = useState({
    label:
      item.importanceLevel === "low"
        ? "Low"
        : item.importanceLevel === "medium"
        ? "Medium"
        : item.importanceLevel === "high"
        ? "High"
        : "",
    value:
      item.importanceLevel === "low"
        ? "low"
        : item.importanceLevel === "medium"
        ? "medium"
        : item.importanceLevel === "high"
        ? "high"
        : "",
  });

  const [observableStatus, setObservableStatus] = useState({
    label:
      item.observable === "private"
        ? "Private"
        : item.observable === "public"
        ? "Public"
        : "",
    value:
      item.observable === "private"
        ? "private"
        : item.observable === "public"
        ? "public"
        : "",
  });

  /* Date */
  const [startDate, setStartDate] = useState(new Date(item.dateToComplete));
  /* iMAGES */
  const [loading, setLoading] = useState(false);
  const [imagesUrl, setImagesUrl] = useState(item?.evidenceImage?.url);
  const [imagesId, setImagesId] = useState("");
  /* iMAGES */

  const handleClose = () => {
    setUpdateTaskModal(false);
    if (imagesId) handleDestroy();
  };
  /* IMAGE */
  const styleUpload = {
    display: imagesUrl ? "block" : "none",
  };

  const onSubmit = async (values) => {
    const { subject, description } = values;
    let idTask = item._id;
    const body = {
      subject: subject,
      description: description,
      importanceLevel: importanceStatus.value,
      observable: observableStatus.value,
      dateToComplete: startDate,
      evidenceImage: {
        public_id: imagesId,
        url: imagesUrl,
      },
    };
    const res = await updateTask(idTask, body);
    setUpdateTaskModal(false);
    setCallback(!callback);
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

  return (
    <>
      <svg
        onClick={() => setUpdateTaskModal(true)}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        className="bi bi-pencil-square"
        viewBox="0 0 16 16"
        type="submit"
        color="#E6B614"
      >
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
        <path
          fillRule="evenodd"
          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
        />
      </svg>
      <Modal show={updateTaskModal} onHide={handleClose}>
        <div ref={createTemplate}>
          <Formik
            enableReinitialize
            initialValues={{
              subject: item.subject,
              description: item.description,
            }}
            /*       validationSchema={newTaskSchema} */
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} id="formKanban">
                <Modal.Header closeButton>
                  <Modal.Title>Create a new task</Modal.Title>
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
                      <label htmlFor="importanceLevel" className="form-label">
                        Importance level of this task
                      </label>
                      <Select
                        id="importanceLevel"
                        name="importanceLevel"
                        options={importanceLevel}
                        isSearchable={false}
                        getOptionLabel={(option) => option.label || ""}
                        getOptionValue={(option) => option.value || ""}
                        value={importanceStatus}
                        onChange={(selected) => setImportanceStatus(selected)}
                      />
                    </Col>

                    <Col xs={12} lg={12} className="mb-4">
                      <label
                        htmlFor="roleAccountDropDown"
                        className="form-label"
                      >
                        Will be This task only to me or both (collaborator and
                        me)?
                      </label>
                      <Select
                        id="roleAccountDropDown"
                        name="roleAccountDropDown"
                        options={observable}
                        isSearchable={false}
                        getOptionLabel={(option) => option.label || ""}
                        getOptionValue={(option) => option.value || ""}
                        value={observableStatus}
                        onChange={(selected) => setObservableStatus(selected)}
                      />
                    </Col>

                    <Col xs={12} md={12} aria-label="Name" className="mb-4">
                      <CustomInput
                        label="Title"
                        name="subject"
                        id="subject"
                        type="text"
                        placeholder="Title"
                        value={props.values.subject}
                        required
                      />
                    </Col>

                    <Col xs={12} md={12} aria-label="lastName" className="mb-4">
                      <TextAreaInput
                        label="Description"
                        name="description"
                        id="description"
                        type="text"
                        placeholder="Description"
                        value={props.values.description}
                        required
                      />
                    </Col>

                    <Col xs={12} md={12} aria-label="lastName" className="mb-4">
                      <span>Date to Complete</span>
                      <ReactDatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
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
          <Button type="submit" variant="primary" form="formKanban">
            Update task
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default KanbanUpdate;
