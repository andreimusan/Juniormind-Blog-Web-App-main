import ViewComment from "./viewComment";
import {
  ShowCommentsButton,
  AllComments,
  CommentsErrorText,
  NoCommentsFoundMessage,
} from "./commentsStyle";
import CommentForm from "./commentForm";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getComments,
  addComment,
  updateComment,
  removeComment,
  selectCommentsStore,
} from "../store/commentSlice";
import Comment from "../../models/comment";
import { getLoginStatus } from "../store/authenticationSlice";
import { Col, Row, Spinner } from "react-bootstrap";
import { useAppDispatch } from "../store/store";
import SearchBar from "../searchBar";
import ErrorModal from "../errorModal";

const Comments = (props: {
  postID: number;
  commentsCount: number;
  setCommentsCount: (count: number) => void;
}) => {
  enum showCommentsState {
    no,
    pending,
    yes,
    error,
  }
  const { postID, commentsCount, setCommentsCount } = props;
  const commentsStore = useSelector(selectCommentsStore);
  const comments: Comment[] = commentsStore.commentsArray;
  const [currentComment, setCurrentComment] = useState({ id: 0, type: "" });
  const [showComments, setShowComments] = useState(showCommentsState.no);
  const [showCommentsButtonWasPressed, setShowCommentsButtonWasPressed] =
    useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorStatus, setErrorStatus] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isSearchRequest, setIsSearchRequest] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);
  const [makeRequest, setMakeRequest] = useState(false);
  const dispatch = useAppDispatch();
  const { userId } = useSelector(getLoginStatus);
  const defaultPreviousPageLastCommentIndex = -1;
  const defaultLimit = 5;
  const commentsNumber: number = isSearchRequest
    ? commentsStore.primaryCommentsCount
    : commentsCount;

  useEffect(() => {
    setShowCommentsButtonWasPressed(true);
    const delaySearch = setTimeout(() => {
      if (searchText !== "") {
        setIsSearchRequest(true);
        setRefreshComments(true);
        setShowComments(showCommentsState.yes);
        return;
      }
      setIsSearchRequest(false);
      setShowComments(showCommentsState.no);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [
    searchText,
    showCommentsState.error,
    showCommentsState.no,
    showCommentsState.yes,
  ]);

  const getCommentsRequest = useCallback(
    async (
      requestPreviousPageLastCommentIndex: number = comments.length > 0
        ? comments[comments.length - 1].id
        : defaultPreviousPageLastCommentIndex
    ) => {
      isSearchRequest
        ? dispatch(
            getComments({
              filter: "search",
              filterId: postID,
              previousPageLastCommentIndex: requestPreviousPageLastCommentIndex,
              limit: defaultLimit,
              searchText: searchText,
            })
          )
        : dispatch(
            getComments({
              filter: "post",
              filterId: postID,
              previousPageLastCommentIndex: requestPreviousPageLastCommentIndex,
              limit: defaultLimit,
            })
          );
    },
    [
      comments,
      defaultPreviousPageLastCommentIndex,
      dispatch,
      isSearchRequest,
      postID,
      searchText,
    ]
  );

  useEffect(() => {
    if (refreshComments) {
      getCommentsRequest(defaultPreviousPageLastCommentIndex);
      setRefreshComments(false);
      return;
    }

    if (makeRequest) {
      getCommentsRequest();
      setMakeRequest(false);
    }
  }, [
    defaultPreviousPageLastCommentIndex,
    getCommentsRequest,
    makeRequest,
    refreshComments,
  ]);

  useEffect(() => {
    if (!showCommentsButtonWasPressed) return;
    if (commentsStore.getCommentsStatus === "fulfilled")
      setShowComments(showCommentsState.yes);

    if (commentsStore.getCommentsStatus === "pending")
      setShowComments(showCommentsState.pending);

    if (commentsStore.getCommentsStatus === "failed")
      setShowComments(showCommentsState.error);
  }, [
    dispatch,
    postID,
    commentsStore.getCommentsStatus,
    showCommentsButtonWasPressed,
    showCommentsState.error,
    showCommentsState.no,
    showCommentsState.pending,
    showCommentsState.yes,
  ]);

  const handleError = (response: unknown) => {
    if (response === undefined) {
      setErrorStatus(500);
      setShowErrorModal(true);
      return true;
    }
    if (typeof response === "number") {
      setErrorStatus(response);
      setShowErrorModal(true);
      return true;
    }

    return false;
  };

  const handleAdd = async (
    text: string,
    siblingID: number,
    parentID?: number
  ) => {
    if (parentID === undefined) setCurrentComment({ id: 0, type: "" });
    const response = (
      await dispatch(
        addComment({
          postID: postID,
          text: text,
          author: userId,
          isSearchRequest,
          siblingID,
          parentID: parentID,
        })
      )
    ).payload;
    if (handleError(response)) return true;
    setCommentsCount(commentsCount + 1);

    if (
      (comments.length === 0 || comments[0].postID !== postID) &&
      !isSearchRequest
    )
      setRefreshComments(true);

    setShowComments(showCommentsState.yes);
    return false;
  };

  const handleDelete = async (
    id: number,
    parentID?: number
  ): Promise<boolean> => {
    const repliesNumber = comments.find((c) => c.id === id)?.repliesCount;
    const response = (await dispatch(removeComment({ id, parentID }))).payload;
    if (handleError(response)) return true;
    repliesNumber !== undefined
      ? setCommentsCount(commentsCount - (repliesNumber + 1))
      : setCommentsCount(commentsCount - 1);
    setCurrentComment({ id: 0, type: "" });
    return false;
  };

  const handleUpdate = async (text: string, id: number) => {
    const response = (await dispatch(updateComment({ id, text }))).payload;
    if (handleError(response)) return true;
    setCurrentComment({ id: 0, type: "" });
    return false;
  };

  return (
    <AllComments>
      <Row className="mt-2 ">
        <Col xs={12} md={7}>
          {commentsNumber > 0 && (
            <ShowCommentsButton
              id="showCommentsButton"
              onClick={() => {
                if (
                  showComments === showCommentsState.no ||
                  showComments === showCommentsState.error
                ) {
                  setShowCommentsButtonWasPressed(true);
                  setRefreshComments(true);
                } else setShowComments(showCommentsState.no);
              }}
            >
              {showComments === showCommentsState.no && (
                <span>Show comments ({commentsNumber})</span>
              )}{" "}
              {showComments === showCommentsState.yes && (
                <span>Hide comments ({commentsNumber})</span>
              )}
              {showComments === showCommentsState.pending && (
                <span>
                  Loading comments <Spinner animation="border" size="sm" />
                </span>
              )}
              {showComments === showCommentsState.error && (
                <CommentsErrorText>
                  Failed to load comments. Try again.
                </CommentsErrorText>
              )}
            </ShowCommentsButton>
          )}
          {commentsNumber === 0 && !isSearchRequest && (
            <span>
              <h5 id="noCommentsYetMessage">
                Post does not have any comments yet
              </h5>
            </span>
          )}
        </Col>
        <Col className="mb-2 text-end" xs={12} md={5}>
          <SearchBar value={searchText} searchContent={setSearchText} />
        </Col>
      </Row>

      <CommentForm
        submitLabel="Add Comment"
        handleSubmit={handleAdd}
        parentCommentId={0}
        currentComment={currentComment.id}
      />
      <ErrorModal
        show={showErrorModal}
        errorStatus={errorStatus}
        onConfirm={() => setShowErrorModal(false)}
        isLoading={false}
      />
      {showComments !== showCommentsState.no &&
        [...comments].map((comment) => (
          <ViewComment
            key={comment.id}
            comment={comment}
            deleteComment={handleDelete}
            updateComment={handleUpdate}
            currentComment={currentComment}
            setCurrentComment={setCurrentComment}
            addComment={handleAdd}
            isSearchRequest={isSearchRequest}
          />
        ))}
      {showComments !== showCommentsState.no &&
        comments.length < commentsStore.primaryCommentsCount && (
          <ShowCommentsButton
            id="showMoreCommentsButton"
            onClick={() => {
              setShowCommentsButtonWasPressed(false);
              setMakeRequest(true);
            }}
          >
            {(commentsStore.getCommentsStatus === "fulfilled" ||
              showCommentsButtonWasPressed) && (
              <span>Show more comments</span>
            )}{" "}
            {commentsStore.getCommentsStatus === "pending" &&
              !showCommentsButtonWasPressed && (
                <span>
                  Loading comments <Spinner animation="border" size="sm" />
                </span>
              )}
            {commentsStore.getCommentsStatus === "failed" &&
              !showCommentsButtonWasPressed && (
                <CommentsErrorText>
                  Failed to load comments. Try again.
                </CommentsErrorText>
              )}
          </ShowCommentsButton>
        )}
      {comments.length === 0 && isSearchRequest && (
        <NoCommentsFoundMessage id="noCommentsFoundMessage">
          No comments found
        </NoCommentsFoundMessage>
      )}
    </AllComments>
  );
};

export default Comments;
