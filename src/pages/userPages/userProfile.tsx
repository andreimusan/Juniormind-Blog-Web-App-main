import { useParams } from "react-router-dom";
import UserProfileContent from "../../components/userComponents/userProfileContent";

const UserProfile = () => {
  const userId = useParams().id;
  if (!userId) throw Error("Invalid id");

  return <UserProfileContent userId={userId} />;
};

export default UserProfile;
