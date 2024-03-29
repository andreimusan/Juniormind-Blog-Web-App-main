import { NavLink } from "react-router-dom";
import User from "../../models/user";
import {
  BsEye,
  BsXCircle,
  BsPencilSquare,
  BsLightningCharge,
} from "react-icons/bs";
import { IconContainer } from "../userStyledComponents/usersTableStyledComponents";
import { IconContext } from "react-icons";
import { useState } from "react";
import UserStatusModal from "./userStatusModal";

type Props = {
  user: User;
  setUser(user: User): void;
};

const ActionsIcons = ({ user, setUser }: Props) => {
  const [showModal, setShowModal] = useState(false);

  let statusChangeButton;
  if (user.active === true) {
    statusChangeButton = (
      <NavLink to={``}>
        <IconContainer title="Deactivate">
          <BsXCircle
            onClick={() => {
              setShowModal(true);
            }}
          />
        </IconContainer>
      </NavLink>
    );
  } else {
    statusChangeButton = (
      <NavLink to={``}>
        <IconContainer title="Activate">
          <BsLightningCharge
            onClick={() => {
              setShowModal(true);
            }}
          />
        </IconContainer>
      </NavLink>
    );
  }

  return (
    <IconContext.Provider
      value={{ className: "mr-1", color: "black", size: "1.2rem" }}
    >
      <NavLink to={`/users/${user.id}`}>
        <IconContainer title="Profile">
          <BsEye />
        </IconContainer>
      </NavLink>
      <NavLink to={`/users/edit/${user.id}`}>
        <IconContainer title="Edit">
          <BsPencilSquare />
        </IconContainer>
      </NavLink>
      {statusChangeButton}
      <UserStatusModal
        user={user}
        setUser={setUser}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </IconContext.Provider>
  );
};

export default ActionsIcons;
