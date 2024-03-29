import { useState } from "react";
import User from "../../models/user";
import CustomModal from "../customModal";
import ErrorModal from "../errorModal";
import { useAppDispatch } from "../store/store";
import { deleteUser, updateUser } from "../store/userSlice";
import UserDeactivationCheckboxes from "./userDeactivationCheckboxes";
import UserFactory from "./userFactory";

type Props = {
  user: User;
  setUser(user: User): void;
  showModal: boolean;
  setShowModal(option: boolean): void;
};
type DeactivationInfo = {
  id: number;
  deletePosts: boolean;
  deleteComments: boolean;
};

const UserStatusModal = ({ user, setUser, showModal, setShowModal }: Props) => {
  const dispatch = useAppDispatch();
  let deletePosts = false;
  let deleteComments = false;
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorStatus, setErrorStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function setDeletePostsOption(option: boolean) {
    deletePosts = option;
  }

  function setDeleteCommentsOption(option: boolean) {
    deleteComments = option;
  }

  const handleUserDeactivation = async () => {
    const id = user.id;
    const di = { id, deletePosts, deleteComments } as DeactivationInfo;
    document.body.style.cursor = "wait";
    setIsLoading(true);
    const deactivatedUser = (await dispatch(deleteUser(di))).payload;
    document.body.style.cursor = "auto";
    setIsLoading(false);
    if (
      deactivatedUser.status !== undefined &&
      deactivatedUser.status !== 200
    ) {
      setShowErrorModal(true);
      setErrorStatus(deactivatedUser.status);
    } else {
      setUser(deactivatedUser.data);
    }
    setShowModal(false);
  };

  const handleUserActivation = async () => {
    const updatedUser = UserFactory.create(
      user.name,
      user.email,
      user.password,
      user.id,
      true,
      user.isAdmin,
      user.image
    );
    document.body.style.cursor = "wait";
    setIsLoading(true);
    const response = (
      await dispatch(updateUser({ user: updatedUser, file: undefined }))
    ).payload;
    document.body.style.cursor = "auto";
    setIsLoading(false);
    if (response.status !== undefined && response.status !== 200) {
      setShowErrorModal(true);
      setErrorStatus(response.status);
    } else {
      setUser(response.data);
    }
    setShowModal(false);
  };

  const handleUserStatusChange = async (applyChanges: boolean) => {
    if (applyChanges) await action();
    else setShowModal(false);
  };

  let title;
  let content;
  let action: Function;
  if (user.active === true) {
    title = "Deactivate User";
    content = (
      <div>
        <span>
          Are you sure you want to deactivate this user? You can also delete
          its:
        </span>
        <UserDeactivationCheckboxes
          setDeletePostsOption={setDeletePostsOption}
          setDeleteCommentsOption={setDeleteCommentsOption}
        ></UserDeactivationCheckboxes>
      </div>
    );
    action = handleUserDeactivation;
  } else {
    title = "Activate User";
    content = "Are you sure you want to activate this user?";
    action = handleUserActivation;
  }

  return (
    <div>
      <CustomModal
        show={showModal}
        title={title}
        content={content}
        onConfirm={handleUserStatusChange}
        isLoading={isLoading}
      />
      <ErrorModal
        show={showErrorModal}
        errorStatus={errorStatus}
        onConfirm={() => setShowErrorModal(false)}
        isLoading={false}
      />
    </div>
  );
};

export default UserStatusModal;
