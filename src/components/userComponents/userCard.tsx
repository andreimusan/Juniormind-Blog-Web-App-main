import { Col, Row } from "react-bootstrap";
import User from "../../models/user";
import ActionsIcons from "./actionsIcons";
import {
  CustomCol,
  GreyActionsIconsContainer,
  UserPicture,
  UserPictureContainer,
} from "../userStyledComponents/usersTableStyledComponents";
import { useState } from "react";
import AdminSign from "./isAdminSign";
import StatusIcon from "./statusIcon";
import { BsPersonCircle } from "react-icons/bs";

type Props = {
  receivedUser: User;
};

const UserCard = ({ receivedUser }: Props) => {
  const [user, setUser] = useState(receivedUser);

  return (
    <Col xs={11} className="mb-3 border border-dark rounded">
      <Row className="border-bottom">
        <CustomCol xs={3} sm={2} className="pt-2 pb-2 text-white fw-bold">
          #
        </CustomCol>
        <Col xs={9} sm={10} className="pt-2 pb-2 text-end">
          {user.id}
        </Col>
      </Row>
      <Row className="border-bottom">
        <CustomCol
          xs={3}
          sm={2}
          className="pt-2 pb-2 text-white fw-bold d-flex"
        >
          <span className="align-self-center">Picture</span>
        </CustomCol>
        <Col
          xs={9}
          sm={10}
          className="pt-2 pb-2 text-end text-break d-flex justify-content-end"
        >
          {user.image !== "" && (
            <UserPictureContainer>
              <UserPicture
                src={process.env.REACT_APP_IMAGE_URL + user.image}
                alt={"profile"}
              />
            </UserPictureContainer>
          )}
          {user.image === "" && <BsPersonCircle color="#343942" size="3rem" />}
        </Col>
      </Row>
      <Row className="border-bottom">
        <CustomCol xs={3} sm={2} className="pt-2 pb-2 text-white fw-bold">
          Name
        </CustomCol>
        <Col xs={9} sm={10} className="pt-2 pb-2 text-end text-break">
          {user.name}
        </Col>
      </Row>
      <Row className="border-bottom">
        <CustomCol xs={3} sm={2} className="pt-2 pb-2 text-white fw-bold">
          Email
        </CustomCol>
        <Col xs={9} sm={10} className="pt-2 pb-2 text-end text-break">
          {user.email}
        </Col>
      </Row>
      <Row className="border-bottom">
        <CustomCol xs={3} sm={2} className="pt-2 pb-2 text-white fw-bold">
          Admin
        </CustomCol>
        <Col xs={9} sm={10} className="pt-2 pb-2 text-end text-break">
          <AdminSign isAdmin={user.isAdmin} size="1.2rem" />
        </Col>
      </Row>
      <Row className="border-bottom">
        <CustomCol xs={3} sm={2} className="pt-2 pb-2 text-white fw-bold">
          Status
        </CustomCol>
        <Col xs={9} sm={10} className="pt-2 pb-2 text-end">
          <StatusIcon isActive={user.active} />
        </Col>
      </Row>
      <Row>
        <GreyActionsIconsContainer>
          <Col className="pt-2 pb-2 text-center mb-1">
            <ActionsIcons user={user} setUser={setUser} />
          </Col>
        </GreyActionsIconsContainer>
      </Row>
    </Col>
  );
};

export default UserCard;
