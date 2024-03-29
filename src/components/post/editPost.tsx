import { useEffect, useState } from "react";
import {
  getPost,
  selectPosts,
  updatePost,
  viewCurrentPost,
} from "../store/postSlice";
import CustomModal from "../customModal";
import {
  PostContainer,
  PostTitleEditable,
  PostDate,
  PostContentEditable,
  PostBtn,
  PostHeader,
  DetailsContainer,
  PostDot,
  PostAuthor,
  PostImage,
  DeleteImageButton,
} from "../styles/components.styles";
import Post from "../../models/post";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import { useSelector } from "react-redux";
import ErrorModal from "../errorModal";
import ImageFileInput from "../imageFileInput";

type Props = {
  postId: number;
};

const EditPost = ({ postId }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [post, setPost] = useState(new Post(postId, "", "", 0, "", "", ""));
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [deleteImage, setDeleteImage] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorStatus, setErrorStatus] = useState(0);
  const [show, setShow] = useState(false);
  const [file, setFile] = useState();

  const modalTitle = "SAVE";
  const modalContent = "Do you want to save the changes?";

  const { updatePostStatus, currentPost } = useSelector(selectPosts);
  const [cursor, setCursor] = useState("auto");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (updatePostStatus === "pending") {
      setCursor("wait");
      setIsLoading(true);
    }

    return () => {
      setCursor("auto");
      setIsLoading(false);
    };
  }, [updatePostStatus]);
  document.body.style.cursor = cursor;

  const handleChanges = async (applyChanges: boolean) => {
    if (applyChanges) {
      if (
        post.title === title &&
        post.content === content &&
        file === undefined &&
        !deleteImage
      ) {
        navigate(`/posts/${post.id}`);
        return;
      }

      const updatedPost = new Post(
        postId,
        title,
        content,
        post.author,
        "",
        "",
        post.image
      );
      const response = await dispatch(
        updatePost({ post: updatedPost, file, deleteImage })
      );
      setShow(false);
      if (response.meta.requestStatus === "fulfilled") {
        const isUpdated = true;
        dispatch(viewCurrentPost({ post, isUpdated }));
        navigate(`/posts/${response.payload.data.id}`);
      }

      if (response.meta.requestStatus === "rejected") {
        setShowErrorModal(true);
        setErrorStatus(response.payload.status);
      }
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    if (currentPost.post !== undefined) {
      setPost(currentPost.post);
      setTitle(post.title);
      setContent(post.content);
    } else {
      (async () => {
        const response = (await dispatch(getPost(postId))).payload.data;
        setPost(response);
        setTitle(response.title);
        setContent(response.content);
      })();
    }
  }, [
    dispatch,
    postId,
    currentPost.post,
    post.content,
    post.title,
    post.image,
  ]);

  return (
    <PostContainer>
      {post.image !== "" && !deleteImage && (
        <PostImage src={process.env.REACT_APP_IMAGE_URL + post.image} />
      )}
      {post.image !== "defaultPostImage.png" && !deleteImage && (
        <DeleteImageButton onClick={() => setDeleteImage(true)}>
          Delete image
        </DeleteImageButton>
      )}
      <ImageFileInput file={file} setFile={setFile} parent="post" />
      <PostHeader>
        <PostTitleEditable
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></PostTitleEditable>
        <div>
          <PostBtn
            variant="secondary"
            disabled={!title || !content}
            onClick={() => setShow(true)}
          >
            Save
          </PostBtn>
          <NavLink to={`/posts/${post.id}`}>
            <PostBtn variant="outline-danger">Cancel</PostBtn>
          </NavLink>
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
      <PostContentEditable
        value={content}
        onChange={(e) => setContent(e.target.value)}
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

export default EditPost;
