import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Modal,
  OverlayTrigger,
  Tooltip,
  Form,
  Button,
  Col,
  Row,
  Table,
  Pagination,
} from "react-bootstrap";
import { Formik } from "formik";
import TextAreaInput from "../TextAreaInput/TextAreaInput";

import { chatService } from "../../service/chatServices";
import { AuthContext } from "../../context";
import moment from "moment";
import { CSVLink } from "react-csv";

function DailyInfo({ item }) {
  const commentTemplate = useRef(null);
  const state = useContext(AuthContext);
  const [callback, setCallback] = useState(false);
  const [userId] = state.User.userId;
  const [commentModal, setCommentModal] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const { getDailyComment, postDailyComment } = chatService();
  const [CSVlist, setCSVlist] = useState([]);
  /* Pagination */
  const [getId, setId] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [current, setCurrent] = useState("");

  const [postsPerPage] = useState(10);

  /*   const handleChangePage = useCallback((page) => {
    setPage(page)
      },[]) */

  /*    let items = [];


  if (current > 1) {
    items.push(<Pagination.Prev key="prev" onClick={() =>setPage(page - 1)}/>);
  }

  for(let page = 1; page <= total; page++) {
    items.push(
      <Pagination.Item key={page} data-page={page} active={page === current} onClick={() =>setPage(page)}>
        {page}
      </Pagination.Item>
    )
  }

  if (current < total) {
    items.push(<Pagination.Next key="next" onClick={() => {setPage(page + 1)}}/>);
  }  */

  /* Pagination */

  const handleClose = () => {
    setCommentModal(false);
  };

  const onSubmit = async (values) => {
    const { comment } = values;

    const body = { content: comment };
    const idUser = item._id;
    const res = await postDailyComment(getId, body);
    /*      setCommentModal(false); */
    setCallback(!callback);
  };

  const getDaily = async () => {
    if (getId) {
      await getDailyComment(getId).then((res) => {
        setCommentList(res.data);

        /*    setTotal(res.data.length) */
        /*         setCurrent(page) */
        const newCSV = res.data?.map((item) => {
          return {
            comment: item.content,
            date: moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
          };
        });
        setCSVlist(newCSV);
      });
    }
  };

  // Get current posts
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = commentList.slice(indexOfFirstPost, indexOfLastPost);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(commentList.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  /* const l =Math.ceil(commentList.length / postsPerPage)

  if (current > 1) {
    pageNumbers.push(<Pagination.Prev key="prev" onClick={() =>setPage(page - 1)}/>);
  }

  for(let page = 1; page <= l; page++) {
    pageNumbers.push(
      <Pagination.Item key={page} data-page={page} active={page === current} onClick={() =>setPage(page)}>
        {page}
      </Pagination.Item>
    )
  }

  if (current < l) {
    pageNumbers.push(<Pagination.Next key="next" onClick={() => {setPage(page + 1)}}/>);
  }   */

  // Change page
  const paginate = (pageNumber) => setPage(pageNumber);

  useEffect(() => {
    setId(item._id);
    getDaily();
  }, [getId]);

  return (
    <>
      <OverlayTrigger
        overlay={
          <Tooltip id={`tooltip-bottom`}>
            <strong>Daily information</strong>.
          </Tooltip>
        }
      >
        <svg
          onClick={() => setCommentModal(true)}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="bi bi-file-earmark-spreadsheet-fill"
          viewBox="0 0 16 16"
          type="submit"
        >
          <path d="M6 12v-2h3v2H6z" />
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM3 9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2H3V9z" />
        </svg>
      </OverlayTrigger>
      <Modal show={commentModal} onHide={handleClose}>
        <div ref={commentTemplate}>
          <Formik
            initialValues={{
              comment: "",
            }}
            /*  validationSchema={newCollaboratorSchema} */
            onSubmit={(values, actions) => {
              onSubmit(values);
              actions.resetForm();
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} id="formTemplateComment">
                <Modal.Header closeButton>
                  <Modal.Title>
                    Daily observation {item.name} {item.lastName}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>At</th>
                        <th>Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPosts?.map((item, index) => {
                        return (
                          <tr key={item._id}>
                            <td>{(page - 1) * 10 + (index + 1)}</td>
                            <td>
                              {moment(item.createdAt).format("MMMM Do YYYY")}
                            </td>
                            <td>
                              {moment(item.createdAt).format("h:mm:ss a")}
                            </td>
                            <td>{item.content}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  {pageNumbers.map((number) => (
                    <div key={number} className="page-item">
                      <button type="button" onClick={() => paginate(number)}>
                        {number}
                      </button>
                    </div>
                  ))}

                  <Row className="mb-6">
                    <Col xs={12} md={12} aria-label="Comment" className="mb-4">
                      <TextAreaInput
                        label="Comment"
                        name="comment"
                        id="comment"
                        type="text"
                        placeholder="Write a new Comment"
                        value={props.values.comment}
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
          <Button type="submit" variant="primary" form="formTemplateComment">
            Create Comment
          </Button>
          <CSVLink
            data={CSVlist}
            className="btn btn-primary"
            filename={`${item.name}_${item.lastName}_${moment().format(
              "MMM Do YY"
            )}.csv`}
          >
            Export to CSV
          </CSVLink>
          ;
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DailyInfo;
