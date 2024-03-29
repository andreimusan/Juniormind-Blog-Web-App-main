import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  deletePost,
  getPost,
  selectPosts,
  viewCurrentPost,
} from "../store/postSlice";
import { getLoginStatus } from "../store/authenticationSlice";
import CustomModal from "../customModal";
import {
  PostContainer,
  PostTitle,
  PostDate,
  PostContent,
  PostBtn,
  PostHeader,
  DetailsContainer,
  PostDot,
  PostAuthor,
  PostImage,
} from "../styles/components.styles";
import Post from "../../models/post";
import Comments from "../comments/comments";
import { useAppDispatch } from "../store/store";
import Loading from "../loading";
import ErrorModal from "../errorModal";

type Props = {
  postId: number;
};

const ViewPost = ({ postId }: Props) => {
  const dispatch = useAppDispatch();

  const [show, setShow] = useState(false);
  const [post, setPost] = useState(new Post(postId, "", "", 0, "", ""));
  const [commentsCount, setCommentsCount] = useState(0);
  const modalTitle = "DELETE";
  const modalContent = "Do you want to remove this post?";

  const navigate = useNavigate();
  const { getPostStatus, deletePostStatus, currentPost } =
    useSelector(selectPosts);
  const [cursor, setCursor] = useState("auto");
  const [delIsLoading, setDelIsLoading] = useState(false);
  useEffect(() => {
    if (deletePostStatus === "pending") {
      setCursor("wait");
      setDelIsLoading(true);
    }

    return () => {
      setCursor("auto");
      setDelIsLoading(false);
    };
  }, [deletePostStatus]);
  document.body.style.cursor = cursor;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorStatus, setErrorStatus] = useState(0);

  const removePost = async (applyChanges: boolean) => {
    if (applyChanges) {
      const response = await dispatch(deletePost(postId));
      setShow(false);

      if (response.meta.requestStatus === "fulfilled") navigate("/posts");
      if (response.meta.requestStatus === "rejected") {
        setShowErrorModal(true);
        setErrorStatus(response.payload.status);
      }
    } else {
      setShow(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (getPostStatus === "pending") setIsLoading(true);

    return () => setIsLoading(false);
  }, [getPostStatus]);

  useEffect(() => {
    if (
      currentPost.post === undefined ||
      currentPost.isUpdated === true ||
      currentPost.post.id !== postId ||
      currentPost.post.author === 0
    )
      (async () => {
        const response = await dispatch(getPost(postId));
        if (response.meta.requestStatus === "fulfilled")
          setPost(response.payload.data);
        if (response.meta.requestStatus === "rejected")
          navigate(`/error/${response.payload.status}`);
      })();
    else setPost(currentPost.post);
  }, [dispatch, postId, navigate, currentPost.isUpdated, currentPost.post]);

  const handleChanges = (newCount: number) => {
    setCommentsCount(newCount);
    const updatedPost = new Post(
      post.id,
      post.title,
      post.content,
      post.author,
      post.dateCreated,
      post.dateModified
    );
    updatedPost.authorName = post.authorName;
    updatedPost.commentsCount = newCount;
    setPost(updatedPost);
  };

  useEffect(() => {
    setCommentsCount(post.commentsCount);
  }, [post, post.commentsCount]);

  const isUpdated = false;
  useEffect(() => {
    dispatch(viewCurrentPost({ post, isUpdated }));
  }, [dispatch, isUpdated, post, post.commentsCount]);

  const logginStatus = useSelector(getLoginStatus);
  const { isLoggedIn } = logginStatus;
  const { isAdmin } = logginStatus;
  const isOwner = logginStatus.userId === post.author;

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <PostContainer>
          {post.image !== "" && (
            <PostImage src={process.env.REACT_APP_IMAGE_URL + post.image} />
          )}
          <PostHeader>
            <PostTitle>{post.title}</PostTitle>
            <div>
              {isLoggedIn && (isAdmin || isOwner) && (
                <NavLink to={`/posts/edit/${post.id}`}>
                  <PostBtn variant="outline-secondary">Edit</PostBtn>
                </NavLink>
              )}
              {isLoggedIn && (isAdmin || isOwner) && (
                <PostBtn variant="outline-danger" onClick={() => setShow(true)}>
                  Remove
                </PostBtn>
              )}
            </div>
          </PostHeader>
          <DetailsContainer>
            <PostAuthor>{post.authorName}</PostAuthor>
            <PostDot />
            <PostDate>
              posted on {new Date(post.dateCreated).toLocaleDateString("ro-RO")}
            </PostDate>
            <PostDot />
            <PostDate>
              last changed on{" "}
              {new Date(post.dateModified).toLocaleDateString("ro-RO")}
            </PostDate>
          </DetailsContainer>
          <PostContent>{post.content}</PostContent>
          <CustomModal
            show={show}
            title={modalTitle}
            content={modalContent}
            onConfirm={removePost}
            isLoading={delIsLoading}
          />
          <ErrorModal
            show={showErrorModal}
            errorStatus={errorStatus}
            onConfirm={() => setShowErrorModal(false)}
            isLoading={false}
          />
          <Comments
            postID={post.id}
            commentsCount={commentsCount}
            setCommentsCount={handleChanges}
          />
        </PostContainer>
      )}
    </>
  );
};

export default ViewPost;
