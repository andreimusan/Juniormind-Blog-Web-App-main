import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPost } from "../store/postSlice";
import { useAppDispatch } from "../store/store";
import CustomModal from "../customModal";
import {
  PostContainer,
  PostTitleEditable,
  PostContentEditable,
  PostBtn,
  PostHeader,
} from "../styles/components.styles";
import { useSelector } from "react-redux";
import { getLoginStatus } from "../store/authenticationSlice";
import ErrorModal from "../errorModal";
import ImageFileInput from "../imageFileInput";

const AddPost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorStatus, setErrorStatus] = useState(0);
  const [show, setShow] = useState(false);
  const [file, setFile] = useState();

  const modalTitle = "SAVE";
  const modalContent = "Do you want to save the changes?";

  const [isLoading, setIsLoading] = useState(false);

  const { userId } = useSelector(getLoginStatus);
  const handleChanges = useCallback(
    async (applyChanges: boolean) => {
      if (applyChanges) {
        document.body.style.cursor = "wait";
        setIsLoading(true);
        const response = await dispatch(
          addPost({
            post: { title, content, author: userId },
            file
          })
        );

        setShow(false);
        if (response.meta.requestStatus === "fulfilled")
          navigate(`/posts/${response.payload.data.id}`);
        if (response.meta.requestStatus === "rejected") {
          setShowErrorModal(true);
          setErrorStatus(response.payload.status);
        }
        document.body.style.cursor = "auto";
        setIsLoading(false);
      } else {
        setShow(false);
      }
    },
    [content, dispatch, file, navigate, title, userId]
  );

  return (
    <PostContainer>
      <ImageFileInput
        file={file}
        setFile={setFile}
        parent="post"
      />
      <PostHeader>
        <PostTitleEditable
          autoFocus
          placeholder={"Add title here..."}
          onChange={(event) => setTitle(event.target.value)}
        ></PostTitleEditable>
        <PostBtn
          variant="secondary"
          disabled={!title || !content}
          onClick={() => setShow(true)}
        >
          Save
        </PostBtn>
        <PostBtn variant="outline-danger" onClick={() => navigate(-1)}>
          Cancel
        </PostBtn>
      </PostHeader>
      <PostContentEditable
        placeholder={"Add content here..."}
        onChange={(event) => setContent(event.target.value)}
      ></PostContentEditable>
      <CustomModal
        show={show}
        title={modalTitle}
        content={modalContent}
        onConfirm={handleChanges}
        isLoading={isLoading}
      />
      <ErrorModal
        show={showErrorModal}
        errorStatus={errorStatus}
        onConfirm={() => setShowErrorModal(false)}
        isLoading={false}
      />
    </PostContainer>
  );
};

export default AddPost;
