import { useState } from "react";
import { Col } from "react-bootstrap";
import User from "../../models/user";
import ActionsIcons from "./actionsIcons";
import AdminSign from "./isAdminSign";
import StatusIcon from "./statusIcon";
import {
  CustomTRow,
  CustomTCol,
  UserPicture,
  UserPictureContainer,
} from "../userStyledComponents/usersTableStyledComponents";
import { BsPersonCircle } from "react-icons/bs";

type Props = {
  receivedUser: User;
};

const UserRow = ({ receivedUser }: Props) => {
  const [user, setUser] = useState(receivedUser);

  return (
    <CustomTRow className="border-bottom pt-2 pb-2 text-center">
      <Col xs={1}>{user.id}</Col>
      <CustomTCol xs={1}>
        {user.image !== "" && (
          <UserPictureContainer>
            <UserPicture
              src={process.env.REACT_APP_IMAGE_URL + user.image}
              alt={"profile"}
            />
          </UserPictureContainer>
        )}
        {user.image === "" && <BsPersonCircle color="#343942" size="3rem" />}
      </CustomTCol>
      <Col xs={2} className="text-break">
        {user.name}
      </Col>
      <Col xs={3} className="text-break">
        {user.email}
      </Col>
      <Col xs={1}>
        <AdminSign isAdmin={user.isAdmin} size="1.2rem" />
      </Col>
      <Col xs={2}>
        <StatusIcon isActive={user.active} />
      </Col>
      <Col xs={2}>
        <ActionsIcons user={user} setUser={setUser} />
      </Col>
    </CustomTRow>
  );
};

export default UserRow;
