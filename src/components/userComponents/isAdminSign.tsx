import {
  IsAdminIcon,
  IsNotAdminIcon,
} from "../userStyledComponents/userProfileStyling";

type Props = {
  isAdmin: boolean;
  size: string;
};
const AdminSign = ({ isAdmin, size }: Props) => {
  let isAdminCol;
  if (!isAdmin)
    isAdminCol = <IsNotAdminIcon size={size} color="#DC3545"></IsNotAdminIcon>;
  else isAdminCol = <IsAdminIcon size={size} color="#198754"></IsAdminIcon>;

  return <>{isAdminCol}</>;
};

export default AdminSign;
