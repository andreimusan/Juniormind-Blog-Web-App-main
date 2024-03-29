import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLoginStatus } from "../store/authenticationSlice";
import { selectCommentsStore } from "../store/commentSlice";
import { TextArea, CustomButton, RedirectToLoginBtn } from "./commentsStyle";

const CommentForm = ({
  handleSubmit,
  submitLabel,
  hasCancelButton = false,
  initialText = "",
  handleCancel,
  parentCommentId,
}: any) => {
  const { isLoggedIn } = useSelector(getLoginStatus);
  const commentsStore = useSelector(selectCommentsStore);
  const navigate = useNavigate();

  const [text, setText] = useState(initialText);
  const [requestIsInProgress, setRequestIsInProgress] = useState(false);
  const isTextareaDisabled = text.length === 0;

  const submit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setRequestIsInProgress(true);
    const response = await handleSubmit(text);
    if (response) {
      setRequestIsInProgress(false);
      return;
    }
    if (parentCommentId === 0) {
      setText("");
      setRequestIsInProgress(false);
    }
  };

  const showLoadingAnimation = () => {
    if (
      requestIsInProgress &&
      (commentsStore.addCommentStatus === "pending" ||
        commentsStore.updateCommentStatus === "pending")
    )
      return true;
    return false;
  };

  return (
    <div id="commentForm">
      {isLoggedIn && (
        <TextArea
          id="textArea"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
        />
      )}
      {isLoggedIn && (
        <CustomButton
          id="confirmButton"
          disabled={isTextareaDisabled}
          onClick={submit}
        >
          {submitLabel}{" "}
          {showLoadingAnimation() && (
            <Spinner id="spinner" animation="border" size="sm" />
          )}
        </CustomButton>
      )}

      {hasCancelButton && (
        <CustomButton id="cancelButton" onClick={handleCancel}>
          Cancel
        </CustomButton>
      )}
      {!isLoggedIn && (
        <RedirectToLoginBtn
          id="redirectToLoginButton"
          onClick={() => navigate("/login")}
        >
          Log in to add comments
        </RedirectToLoginBtn>
      )}
    </div>
  );
};

export default CommentForm;
