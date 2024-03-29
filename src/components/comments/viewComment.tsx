import { useCallback, useEffect, useState } from "react";
import Comment from "../../models/comment";
import CustomModal from "../customModal";
import { getReplies, selectCommentsStore } from "../store/commentSlice";
import CommentForm from "./commentForm";
import {
  CommentContainer,
  ReplyContainer,
  CommentDataContainer,
  CommentTextContainer,
  Text,
  Author,
  CommentDate,
  ActionButton,
  ShowMoreButton,
  RepliesErrorText,
  ShowMoreRepliesButton,
} from "./commentsStyle";
import { useAppDispatch } from "../store/store";
import { useSelector } from "react-redux";
import { getLoginStatus } from "../store/authenticationSlice";
import { Spinner } from "react-bootstrap";

const ViewComment = (props: {
  comment: Comment;
  currentComment: { id: number; type: string };
  setCurrentComment: (arg0: { id: number; type: string }) => void;
  deleteComment: (id: number, parentID?: number) => Promise<boolean>;
  updateComment: (text: string, id: number) => any;
  addComment: (text: string, siblingID: number, parentID: number) => any;
  isSearchRequest: boolean;
}) => {
  const {
    comment,
    currentComment,
    setCurrentComment,
    deleteComment,
    updateComment,
    addComment,
    isSearchRequest,
  } = props;

  enum showRepliesState {
    no,
    pending,
    yes,
    error,
  }

  const { isLoggedIn, userId, isAdmin, username } = useSelector(getLoginStatus);

  const [showModal, setShowModal] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [showReplies, setShowReplies] = useState(showRepliesState.no);
  const [showRepliesButtonWasPressed, setShowRepliesButtonWasPressed] =
    useState(false);
  const [makeRequest, setmakeRequest] = useState(false);
  const parentID = comment.parentID ? comment.parentID : comment.id;
  const commentsStore = useSelector(selectCommentsStore);
  const defaultPreviousPageLastReplyIndex = -1;
  const defaultLimit = 5;

  useEffect(() => {
    if (!showRepliesButtonWasPressed) return;
    if (commentsStore.getRepliesStatus === "fulfilled") {
      setShowRepliesButtonWasPressed(false);
      setShowReplies(showRepliesState.yes);
    }

    if (commentsStore.getRepliesStatus === "pending" && !comment.replies) {
      setShowReplies(showRepliesState.pending);
      return;
    }

    if (commentsStore.getRepliesStatus === "failed" && !comment.replies) {
      if (showReplies === showRepliesState.pending)
        setShowRepliesButtonWasPressed(false);
      setShowReplies(showRepliesState.error);
    }
  }, [
    comment.replies,
    commentsStore.getRepliesStatus,
    showReplies,
    showRepliesButtonWasPressed,
    showRepliesState.error,
    showRepliesState.pending,
    showRepliesState.yes,
  ]);

  const dispatch = useAppDispatch();

  const getRepliesRequest = useCallback(() => {
    dispatch(
      getReplies({
        parentID: parentID,
        previousPageLastReplyIndex:
          comment.replies && comment.replies.length > 0
            ? comment.replies[comment.replies.length - 1].id
            : defaultPreviousPageLastReplyIndex,
        limit: defaultLimit,
      })
    );
  }, [comment.replies, defaultPreviousPageLastReplyIndex, dispatch, parentID]);

  useEffect(() => {
    if (makeRequest) {
      getRepliesRequest();
      if (commentsStore.getRepliesStatus === "pending" && !comment.replies) {
        setShowReplies(showRepliesState.pending);
      }
      setmakeRequest(false);
    }
  }, [
    comment.replies,
    commentsStore.getRepliesStatus,
    getRepliesRequest,
    makeRequest,
    showRepliesState.pending,
  ]);

  useEffect(() => {
    if (!isSearchRequest) setShowReplies(showRepliesState.no);
  }, [isSearchRequest, showRepliesState.no]);

  const displayComment = (comment: Comment) => {
    const isReplying =
      currentComment.id === comment.id && currentComment.type === "replying";
    const isEditing =
      currentComment.id === comment.id && currentComment.type === "editing";

    return (
      <div id={"comment" + comment.id}>
        <CommentDataContainer>
          <Author>{comment.authorName ? comment.authorName : username}</Author>
          <CommentDate>
            Modified: {new Date(comment.dateModified).toLocaleDateString()}
          </CommentDate>
          <CommentDate>
            Created: {new Date(comment.dateCreated).toLocaleDateString()}
          </CommentDate>
        </CommentDataContainer>
        <CommentTextContainer>
          {!isEditing && (
            <Text>
              {collapsed ? `${comment.text.substring(0, 350)}` : comment.text}
              {comment.text.length > 350 && (
                <ShowMoreButton onClick={() => setCollapsed(!collapsed)}>
                  Show {collapsed ? "more" : "less"}
                </ShowMoreButton>
              )}
            </Text>
          )}
          {isEditing && (
            <CommentForm
              submitLabel="Update"
              hasCancelButton
              initialText={comment.text}
              handleSubmit={(text: string) => updateComment(text, comment.id)}
              handleCancel={() => setCurrentComment({ id: 0, type: "" })}
              parentCommentId={comment.id}
              currentComment={currentComment.id}
            />
          )}
          {isReplying && (
            <CommentForm
              submitLabel="Reply"
              hasCancelButton
              handleSubmit={async (text: string) => {
                const response = await addComment(text, comment.id, parentID);
                if (response) return true;
                if (
                  !isSearchRequest &&
                  !comment.parentID &&
                  !comment.replies &&
                  comment.repliesCount > 0
                )
                  setmakeRequest(true);

                setShowReplies(showRepliesState.yes);
                setCurrentComment({ id: 0, type: "" });
                return false;
              }}
              handleCancel={() => setCurrentComment({ id: 0, type: "" })}
              parentCommentId={comment.id}
              currentComment={currentComment.id}
            />
          )}
        </CommentTextContainer>
        <div className="comment-actions">
          {isLoggedIn && (
            <ActionButton
              onClick={() => {
                setCurrentComment({ id: comment.id, type: "replying" });
              }}
            >
              Reply{" "}
            </ActionButton>
          )}
          {isLoggedIn && (isAdmin || userId === comment.author) && (
            <ActionButton
              onClick={() => {
                setCurrentComment({ id: comment.id, type: "editing" });
              }}
            >
              Edit{" "}
            </ActionButton>
          )}
          {isLoggedIn && (isAdmin || userId === comment.author) && (
            <ActionButton
              onClick={() => {
                setCurrentComment({ id: comment.id, type: "deleting" });
                setShowModal(true);
              }}
            >
              Delete{" "}
            </ActionButton>
          )}
          {comment.parentID === null &&
            comment.repliesCount > 0 &&
            !isSearchRequest && (
              <ActionButton
                onClick={() => {
                  if (currentComment.id !== comment.id)
                    setCurrentComment({
                      id: comment.id,
                      type: "showingReplies",
                    });
                  if (showReplies === showRepliesState.no) {
                    setShowRepliesButtonWasPressed(true);
                    comment.replies
                      ? setShowReplies(showRepliesState.yes)
                      : setmakeRequest(true);
                  } else if (showReplies === showRepliesState.error) {
                    setShowRepliesButtonWasPressed(true);
                    setmakeRequest(true);
                  } else setShowReplies(showRepliesState.no);
                }}
              >
                {showReplies === showRepliesState.no && (
                  <span>Show replies ({comment.repliesCount})</span>
                )}
                {showReplies === showRepliesState.pending && (
                  <span>
                    Loading replies <Spinner animation="border" size="sm" />
                  </span>
                )}{" "}
                {showReplies === showRepliesState.yes && (
                  <span>Hide replies ({comment.repliesCount})</span>
                )}
                {showReplies === showRepliesState.error && (
                  <RepliesErrorText>
                    Failed to load replies. Try again.
                  </RepliesErrorText>
                )}
              </ActionButton>
            )}
        </div>
        <CustomModal
          show={showModal}
          title="Delete"
          content="Are you sure you want to delete this comment?"
          onConfirm={async (confirmed: boolean) => {
            if (confirmed) {
              if (await deleteComment(comment.id, comment.parentID))
                setShowModal(false);
            } else setShowModal(false);
          }}
          isLoading={commentsStore.removeCommentStatus === "pending"}
        />
      </div>
    );
  };

  let sortedReplies;
  if (comment.replies !== undefined) {
    sortedReplies = [...comment.replies].map((reply) => (
      <ViewComment
        comment={reply}
        deleteComment={deleteComment}
        updateComment={updateComment}
        currentComment={currentComment}
        setCurrentComment={setCurrentComment}
        addComment={addComment}
        key={reply.id}
        isSearchRequest={isSearchRequest}
      />
    ));
  }

  return (
    <div>
      {(comment.parentID === null || isSearchRequest) && (
        <CommentContainer>{displayComment(comment)}</CommentContainer>
      )}
      {comment.parentID !== null && !isSearchRequest && (
        <ReplyContainer>{displayComment(comment)}</ReplyContainer>
      )}
      {showReplies !== showRepliesState.no && comment.replies && sortedReplies}
      {!isSearchRequest &&
        showReplies !== showRepliesState.no &&
        comment.replies &&
        comment.replies.length < comment.repliesCount && (
          <ShowMoreRepliesButton
            onClick={() => {
              setShowRepliesButtonWasPressed(false);
              setCurrentComment({
                id: comment.id,
                type: "showingMoreReplies",
              });
              setmakeRequest(true);
            }}
          >
            {(commentsStore.getRepliesStatus === "fulfilled" ||
              currentComment.id !== comment.id) && (
              <span>Show more replies</span>
            )}
            {commentsStore.getRepliesStatus === "pending" &&
              currentComment.id === comment.id && (
                <span>
                  Loading replies <Spinner animation="border" size="sm" />
                </span>
              )}{" "}
            {commentsStore.getRepliesStatus === "failed" &&
              currentComment.id === comment.id && (
                <RepliesErrorText>
                  Failed to load replies. Try again.
                </RepliesErrorText>
              )}
          </ShowMoreRepliesButton>
        )}
    </div>
  );
};

export default ViewComment;
