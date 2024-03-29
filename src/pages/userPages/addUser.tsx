import { useNavigate } from "react-router-dom";
import UserForm from "../../components/userComponents/userForm";
import { addUser } from "../../components/store/userSlice";
import { useAppDispatch } from "../../components/store/store";
import { useState } from "react";
import ErrorModal from "../../components/errorModal";

const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorStatus, setErrorStatus] = useState(0);

  const handleAddNewUser = async (
    file: File | undefined,
    name: string,
    email: string,
    password: string,
    isAdmin: boolean
  ) => {
    document.body.style.cursor = "wait";
    const addedUser = (
      await dispatch(
        addUser({ user: { name, email, password, isAdmin }, file })
      )
    ).payload;
    document.body.style.cursor = "auto";
    if (addedUser.status !== undefined && addedUser.status !== 201) {
      setShowErrorModal(true);
      setErrorStatus(addedUser.status);
    } else {
      navigate(`/users/${addedUser.data.id}`);
    }
  };

  return (
    <div>
      <UserForm
        userId={"0"}
        title="Add new user"
        handleAction={handleAddNewUser}
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

export default AddUser;
