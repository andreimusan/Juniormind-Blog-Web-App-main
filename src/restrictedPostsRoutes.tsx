import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import Loading from "./components/loading";
import { getLoginStatus } from "./components/store/authenticationSlice";
import { getPost, selectPosts } from "./components/store/postSlice";
import { useAppDispatch } from "./components/store/store";
import Post from "./models/post";

const RestrictedPostsRoutes = () => {
  const urlId = useParams().id;
  if (!urlId) throw Error("invalid id");

  const navigate = useNavigate();
  const { isAdmin, userId } = useSelector(getLoginStatus);
  const { currentPost } = useSelector(selectPosts);
  const [post, setPost] = useState(new Post(0, "", "", 0, "", ""));
  const [requestIsFinished, setRequestIsFinished] = useState(false);

  let isOwner: boolean;
  isOwner = post.author === userId;

  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      if (currentPost.post === undefined || currentPost.isUpdated === true) {
        const response = await dispatch(getPost(parseInt(urlId, 10)));
        if (response.meta.requestStatus === "fulfilled") {
          setPost(response.payload.data);
          setRequestIsFinished(true);
        }
        if (response.meta.requestStatus === "rejected")
          navigate(`/error/${response.payload.status}`);
      } else {
        setPost(currentPost.post);
        setRequestIsFinished(true);
      }
    })();
  });

  if (requestIsFinished)
    return isAdmin || isOwner ? <Outlet /> : <Navigate to="/error/403" />;
  else return <Loading></Loading>;
};

export default RestrictedPostsRoutes;
