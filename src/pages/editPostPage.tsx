import { useParams } from "react-router-dom";
import EditPost from "../components/post/editPost";

const EditPostPage = () => {
  const postId = useParams().id;
  if (!postId) throw Error("invalid id");

  return <EditPost postId={parseInt(postId, 10)}></EditPost>;
};

export default EditPostPage;
