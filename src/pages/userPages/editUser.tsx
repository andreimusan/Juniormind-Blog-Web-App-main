import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../../components/userComponents/userForm";
import { useAppDispatch } from "../../components/store/store";
import { updateUser } from "../../components/store/userSlice";
import {
  getLoginStatus,
  updateUserInfo,
} from "../../components/store/authenticationSlice";
import UserFactory from "../../components/userComponents/userFactory";
import { useSelector } from "react-redux";
import ErrorModal from "../../components/errorModal";

const EditUser = () => {
  const navigate = useNavigate();
  const userId = useParams().id;
  const dispatch = useAppDispatch();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorStatus, setErrorStatus] = useState(0);
  const loggedInUserId = useSelector(getLoginStatus).userId;

  if (!userId) throw Error("invalid id");

  const handleEditUser = async (
    file: File | undefined,
    name: string,
    email: string,
    password: string | undefined,
    active: boolean,
    isAdmin: boolean,
    image: string
  ) => {
    document.body.style.cursor = "wait";
    const updatedUser = UserFactory.create(
      name,
      email,
      password,
      parseInt(userId, 10),
      active,
      isAdmin,
      image
    );

    const response = (await dispatch(updateUser({ user: updatedUser, file })))
      .payload;
    document.body.style.cursor = "auto";
    if (response.status !== undefined && response.status !== 200) {
      setShowErrorModal(true);
      setErrorStatus(response.status);
    } else {
      if (loggedInUserId === parseInt(userId, 10))
        dispatch(
          updateUserInfo({
            username: updatedUser.name,
            userImage: response.data.image,
          })
        );
      navigate(`/users/${updatedUser.id}`);
    }
  };

  return (
    <div>
      <UserForm
        userId={userId}
        title="Edit user"
        handleAction={handleEditUser}
      ></UserForm>
      <ErrorModal
        show={showErrorModal}
        errorStatus={errorStatus}
        onConfirm={() => setShowErrorModal(false)}
        isLoading={false}
      />
    </div>
  );
};

export default EditUser;
