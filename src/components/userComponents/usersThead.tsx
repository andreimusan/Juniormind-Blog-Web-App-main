import { Col } from "react-bootstrap";
import { CustomTHead } from "../userStyledComponents/usersTableStyledComponents";

const UsersThead = () => {
  return (
    <CustomTHead className="text-white pt-2 pb-2 fw-bold text-center">
      <Col xs={1}>#</Col>
      <Col xs={1}>Picture</Col>
      <Col xs={2}>Name</Col>
      <Col xs={3}>Email</Col>
      <Col xs={1}>Admin</Col>
      <Col xs={2}>Status</Col>
      <Col xs={2}>Actions</Col>
    </CustomTHead>
  );
};

export default UsersThead;
