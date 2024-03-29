import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "./store/store";
import { getLoginStatus, login } from "./store/authenticationSlice";
import { Form, FormControl } from "react-bootstrap";
import {
  CancelBtn,
  LoginContainer,
  SubmitBtn,
  FormFeedback,
  BtnSpinner,
} from "../components/styles/navbar.styles";
import { useSelector } from "react-redux";
import { ShowAlert } from "./showAlert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loginError, loginStatus } = useSelector(getLoginStatus);
  const [errorMessage, setErrorMessage] = useState(loginError);

  useEffect(() => {
    setErrorMessage(loginError);
  }, [loginError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const params = new URLSearchParams({
      grant_type: "password",
      client_id: "app",
      username: email,
      password: password,
    }).toString();
    const response = await dispatch(login(params));
    if (response.meta.requestStatus === "fulfilled")
      location.key !== "default"
        ? navigate(-1)
        : navigate("/posts", { replace: true });
    if (response.meta.requestStatus === "rejected")
      response.payload === "Unexpected server error"
        ? ShowAlert(500)
        : setError(true);
  };

  const validateForm = () => {
    return email.length > 2 && password.length > 2;
  };

  return (
    <LoginContainer>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-4" controlId="email">
          <FormFeedback hide={!error}>{errorMessage}</FormFeedback>
        </Form.Group>
        <Form.Group className="mb-4" controlId="email">
          <Form.Label>Email</Form.Label>
          <FormControl
            autoFocus
            type="email"
            placeholder={"example@mail.com"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
            isInvalid={error}
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Password</Form.Label>
          <FormControl
            type="password"
            placeholder={"password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            isInvalid={error}
          />
        </Form.Group>
        <SubmitBtn type="submit" disabled={!validateForm()} variant="secondary">
          Log in
          {loginStatus === "pending" && (
            <BtnSpinner animation="border" size="sm"></BtnSpinner>
          )}
        </SubmitBtn>
        <CancelBtn variant="outline-secondary" onClick={() => navigate(-1)}>
          Cancel
        </CancelBtn>
      </Form>
    </LoginContainer>
  );
};

export default Login;
