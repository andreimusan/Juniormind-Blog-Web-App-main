import {
  StatusContainerGreen,
  StatusContainerRed,
} from "../userStyledComponents/usersTableStyledComponents";

type Props = {
  isActive: boolean;
};
const StatusIcon = ({ isActive }: Props) => {
  let status;
  if (isActive === true) {
    status = (
      <StatusContainerGreen className="border rounded">
        Active
      </StatusContainerGreen>
    );
  } else {
    status = (
      <StatusContainerRed className="border rounded">
        Inactive
      </StatusContainerRed>
    );
  }

  return <>{status}</>;
};

export default StatusIcon;
