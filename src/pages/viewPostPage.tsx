import { useParams } from "react-router-dom";
import ViewPost from "../components/post/viewPost";

const ViewPostPage = () => {
  const postId = useParams().id;
  if (!postId) throw Error("invalid id");

  return <ViewPost postId={parseInt(postId, 10)}></ViewPost>;
};

export default ViewPostPage;
