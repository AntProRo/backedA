import Router from "next/router";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { Form, Row } from "react-bootstrap";
import verifyAuth from "./HOC/verifyAuth.jsx";
import { commonService } from "../service/HttpNoTokenRequired/commonService";

function Register() {
  const { registerNewAccount } = commonService();
  const initialState = {
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    lastName: "",
    occupation: "",
  };
  const [register, setRegister] = useState(initialState);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await registerNewAccount(register);
    const message = JSON.stringify(res.data.msg);

    if (res.status !== 200) {
      Swal.fire({
        title: "Error!",
        text: `${message}`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else {
      Swal.fire({
        title: "Good!",
        icon: "success",
        timer: 1500,
      });
      Router.reload(window.location.pathname);
    }
  };

  return (
    <div className="limiter">
      <div className="container-register100">
        <div className="wrap-register100">
          <form
            className="register100-form "
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="card">
              <div className="card-header bg-primary text-white text-center">
                Register
              </div>
              <div className="card-body">
                <Row className="mb-4">
                  <Form.Group className="mb-4">
                    <Form.Label>Email: </Form.Label>
                    <Form.Control
                      onChange={handleChangeInput}
                      name="email"
                      type="email"
                      placeholder=" Type your email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Name: </Form.Label>
                    <Form.Control
                      onChange={handleChangeInput}
                      name="name"
                      type="text"
                      placeholder=" What is your name?"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Last Name: </Form.Label>
                    <Form.Control
                      onChange={handleChangeInput}
                      name="lastName"
                      type="text"
                      placeholder="Also write your lastName"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Occupation: </Form.Label>
                    <Form.Control
                      onChange={handleChangeInput}
                      name="occupation"
                      type="text"
                      placeholder="What is your Occupation?"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4 ">
                    <Form.Label>Password: </Form.Label>
                    <Form.Control
                      onChange={handleChangeInput}
                      name="password"
                      type="password"
                      placeholder="Create a new password"
                      autoComplete="on"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4 ">
                    <Form.Label>Password Again: </Form.Label>
                    <Form.Control
                      onChange={handleChangeInput}
                      name="repeatPassword"
                      type="password"
                      placeholder="Write the password again"
                      autoComplete="on"
                    />
                  </Form.Group>

                  <button type="submit" className="btn btn-primary btn-block  ">
                    Register
                  </button>
                  <div className="text-center p-t-46 ">
                    <Link href="/">
                      <a className="txt2">or Login</a>
                    </Link>
                  </div>
                </Row>
              </div>
            </div>
          </form>
          <div className="register100-more" />
        </div>
      </div>
    </div>
  );
}

export default verifyAuth(Register);
