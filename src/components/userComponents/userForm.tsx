import { useEffect, useState } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import CustomModal from "../customModal";
import ErrorModal from "../errorModal";
import { getLoginStatus } from "../store/authenticationSlice";
import { useAppDispatch } from "../store/store";
import { getFilteredUsers, getUser, selectUsers } from "../store/userSlice";
import UserFormValidation from "./userFormValidation";
import {
  FormField,
  ImageContainer,
  RemoveImageBtn,
} from "../userStyledComponents/usersFormStyledComponents";
import Loading from "../loading";
import { Navigate } from "react-router-dom";
import ImageFileInput from "../imageFileInput";
import {
  UserProfileContainer,
  UserProfilePicture,
} from "../userStyledComponents/userProfileStyling";

type Props = {
  userId: string;
  title: string;
  handleAction(
    file: File | undefined,
    name: string,
    email: string,
    password: string,
    active: boolean,
    isAdmin: boolean,
    image: string
  ): void;
};

type FormInputs = {
  name: string;
  email: string;
  password: string;
  password2: string;
  active: boolean;
  isAdmin: boolean;
  image: string;
};

type Errors = {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  password2: string | undefined;
};

const UserForm = ({ userId, title, handleAction }: Props) => {
  const dummyErrors: Errors = {
    name: undefined,
    email: undefined,
    password: undefined,
    password2: undefined,
  };
  const dummyForm: FormInputs = {
    name: "",
    email: "",
    password: "",
    password2: "",
    active: true,
    isAdmin: false,
    image: "",
  };
  const isEditForm = userId !== "0";
  const { isAdmin } = useSelector(getLoginStatus);

  const [form, setForm] = useState(dummyForm);
  const [errors, setErrors] = useState(dummyErrors);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [requestErrorStatus, setRequestErrorStatus] = useState(0);
  const [imageFile, setImageFile] = useState();
  const [viewImage, setViewImage] = useState("");
  useEffect(() => {
    if (form.image === "") return;
    setViewImage(process.env.REACT_APP_IMAGE_URL + form.image);
  }, [form.image]);

  const dispatch = useAppDispatch();

  const { getUserStatus } = useSelector(selectUsers);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(false);
  useEffect(() => {
    if (getUserStatus === "pending") setIsUserInfoLoading(true);

    return () => setIsUserInfoLoading(false);
  }, [getUserStatus]);

  const removeImage = async () => {
    setViewImage("");
    form.image = "";
  };

  useEffect(() => {
    if (isEditForm) {
      (async () => {
        const user = (await dispatch(getUser(parseInt(userId)))).payload;
        if (user.status !== undefined && user.status !== 200) {
          setRequestErrorStatus(user.status);
        } else {
          setForm({
            name: user.data.name,
            email: user.data.email,
            active: user.data.active,
            isAdmin: user.data.isAdmin,
            image: user.data.image,
            password: "",
            password2: "",
          });
        }
      })();
    }
  }, [dispatch, isEditForm, userId]);

  const setField = (field: string, value: string | boolean) => {
    setForm({
      ...form,
      [field]: value,
    });

    setErrors({
      ...errors,
      [field]: null,
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = UserFormValidation.validateFormInput(
      form,
      isEditForm ? true : false
    );
    if (
      newErrors.name ||
      newErrors.email ||
      newErrors.password ||
      newErrors.password2
    ) {
      setErrors(newErrors);
    } else if (isEditForm) {
      setShowModal(true);
    } else {
      document.body.style.cursor = "wait";
      setIsLoading(true);
      const findByEmailRequest = (
        await dispatch(
          getFilteredUsers({ page: 1, emailFilter: form.email, search: "" })
        )
      ).payload;
      document.body.style.cursor = "auto";
      setIsLoading(false);
      if (
        findByEmailRequest.status === 200 ||
        findByEmailRequest.status === undefined
      ) {
        setErrors({
          ...errors,
          email: "Email address already exists",
        });
      } else if (findByEmailRequest.status === 404) {
        handleAction(
          imageFile,
          form.name,
          form.email,
          form.password,
          form.isAdmin,
          form.active,
          form.image
        );
      } else {
        setShowErrorModal(true);
        setRequestErrorStatus(findByEmailRequest.status);
      }
    }
  };

  const handleModalOptions = async (applyChanges: boolean) => {
    setShowModal(false);
    if (applyChanges) {
      handleAction(
        imageFile,
        form.name,
        form.email,
        form.password,
        form.active,
        form.isAdmin,
        form.image
      );
    }
  };

  return requestErrorStatus !== 0 ? (
    <Navigate to={`/error/${requestErrorStatus}`} />
  ) : isUserInfoLoading ? (
    <Loading />
  ) : (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs={11} sm={7} md={6} lg={5} xl={4}>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <h1 className="text-center mt-2">{title}</h1>
            <Row className="justify-content-center mb-2">
              {viewImage !== "" && (
                <div style={{ padding: "0 12px" }}>
                  <ImageContainer>
                    <UserProfileContainer>
                      <UserProfilePicture src={viewImage} alt={"profile"} />
                    </UserProfileContainer>
                    <RemoveImageBtn onClick={() => removeImage()}>
                      Delete image
                    </RemoveImageBtn>
                  </ImageContainer>
                </div>
              )}
              <Form.Group as={Col}>
                <ImageFileInput
                  file={imageFile}
                  setFile={setImageFile}
                  parent="user"
                />
              </Form.Group>
            </Row>
            <Row className="justify-content-center mb-2">
              <Form.Group as={Col}>
                <Form.Label>Name</Form.Label>
                <FormField
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e: { target: { value: string } }) =>
                    setField("name", e.target.value)
                  }
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="justify-content-center mb-2">
              <Form.Group as={Col}>
                <Form.Label>Email address</Form.Label>
                <FormField
                  type="text"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e: { target: { value: string } }) =>
                    setField("email", e.target.value)
                  }
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="justify-content-center mb-2">
              <Form.Group as={Col}>
                <Form.Label>Password</Form.Label>
                <FormField
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e: { target: { value: string } }) =>
                    setField("password", e.target.value)
                  }
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="justify-content-center mb-2">
              <Form.Group as={Col}>
                <Form.Label>Repeat password</Form.Label>
                <FormField
                  type="password"
                  placeholder="Repeat password"
                  value={form.password2}
                  onChange={(e: { target: { value: string } }) =>
                    setField("password2", e.target.value)
                  }
                  isInvalid={!!errors.password2}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password2}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-2">
              <Col>
                {isAdmin && (
                  <Form.Check
                    type={"switch"}
                    id={"isAdminSwitch"}
                    label={"Is administrator"}
                    onChange={(e) => setField("isAdmin", e.target.checked)}
                    checked={form.isAdmin}
                  />
                )}
              </Col>
            </Row>
            <Row className="text-center">
              <Col>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Col>
            </Row>
            <CustomModal
              show={showModal}
              title="Apply changes"
              content="Make sure the information you entered is correct. Do you want to continue?"
              onConfirm={handleModalOptions}
              isLoading={isLoading}
            />
            <ErrorModal
              show={showErrorModal}
              errorStatus={requestErrorStatus}
              onConfirm={() => setShowErrorModal(false)}
              isLoading={false}
            />
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserForm;
