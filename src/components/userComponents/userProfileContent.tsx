import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Navigate, NavLink } from "react-router-dom";
import {
  ColouredProfileHead,
  NameText,
  CustomButton,
  UserProfilePicture,
  UserProfileContainer,
} from "../../components/userStyledComponents/userProfileStyling";
import UseWindowDimensions from "../../components/window/useWindowDimensions";
import UserFactory from "../../components/userComponents/userFactory";
import { useAppDispatch } from "../../components/store/store";
import { getUser } from "../../components/store/userSlice";
import { BsPersonCircle } from "react-icons/bs";
import UserStatusModal from "../../components/userComponents/userStatusModal";
import AdminSign from "../../components/userComponents/isAdminSign";
import Loading from "../loading";

type Props = {
  userId: string;
};
const UserProfileContent = ({ userId }: Props) => {
  const [user, setUser] = useState(UserFactory.createDefault());
  const [errorStatus, setErrorStatus] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const response = (await dispatch(getUser(parseInt(userId, 10)))).payload;
      if (response.status !== undefined && response.status !== 200) {
        setErrorStatus(response.status);
      }
      setUser(response.data);
    })();
  }, [dispatch, userId]);

  const { width } = UseWindowDimensions();
  const centerClass = width <= 767 ? "text-center" : "";

  let statusCol;
  let statusChangeButton;

  if (user.active === true) {
    statusCol = <Col className="fs-4 text-success">Active</Col>;
    statusChangeButton = (
      <CustomButton
        className="me-3"
        onClick={() => setShowModal(true)}
        variant="danger"
      >
        Deactivate
      </CustomButton>
    );
  } else {
    statusCol = <Col className="fs-4 text-danger">Inactive</Col>;
    statusChangeButton = (
      <CustomButton
        className="me-3"
        onClick={() => setShowModal(true)}
        variant="success"
      >
        Activate
      </CustomButton>
    );
  }

  return errorStatus !== 0 ? (
    <Navigate to={`/error/${errorStatus}`} />
  ) : user.id !== parseInt(userId, 10) ? (
    <Loading />
  ) : (
    <Container fluid>
      <Row className="mt-4 justify-content-center">
        <Col className="border border-dark rounded" xs={11} lg={10}>
          <ColouredProfileHead className="justify-content-end pb-2">
            <Col className="text-end mt-2">
              {statusChangeButton}
              <NavLink to={`/users/edit/${user.id}`}>
                <CustomButton variant="light">Edit</CustomButton>
              </NavLink>
            </Col>
          </ColouredProfileHead>
          <Row className="justify-content-center pt-2 pb-2">
            <Col
              className="text-center align-self-center"
              xs={12}
              sm={4}
              md={2}
            >
              {user.image !== "" && (
                <UserProfileContainer>
                  <UserProfilePicture
                    src={process.env.REACT_APP_IMAGE_URL + user.image}
                    alt={"profile"}
                  />
                </UserProfileContainer>
              )}
              {user.image === "" && (
                <BsPersonCircle color="#343942" size="4.5rem"></BsPersonCircle>
              )}
            </Col>
            <Col className={`${centerClass}`} xs={12} md={6} lg={5}>
              <Row>
                <Col className="fs-4 text-break">
                  <NameText>{user.name}</NameText>
                </Col>
              </Row>
              <Row>
                <Col className="text-break mb-1">{user.email}</Col>
              </Row>
              <Row>
                <Col>
                  Admin <AdminSign isAdmin={user.isAdmin} size="0.8rem" />
                </Col>
              </Row>
            </Col>
            <Col className={centerClass} xs={12} md={4} lg={5}>
              <Row>{statusCol}</Row>
              <Row className="mb-1">
                <Col>
                  Joined {new Date(user.dateCreated).toLocaleDateString()}
                </Col>
              </Row>
              <Row>
                <Col>
                  Edited {new Date(user.dateModified).toLocaleDateString()}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <UserStatusModal
        user={user}
        setUser={setUser}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </Container>
  );
};

export default UserProfileContent;
