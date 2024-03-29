import { Col, Row } from "react-bootstrap";
import { CustomCol } from "../userStyledComponents/usersTableStyledComponents";
import UseWindowDimensions from "../window/useWindowDimensions";
import UsersThead from "./usersThead";

const NoUsers = () => {
  const { width } = UseWindowDimensions();
  const message = "No users to display";
  if (width >= 725)
    return (
      <Row className="mt-3 justify-content-center">
        <Col className="border border-dark rounded" sm={11}>
          <UsersThead></UsersThead>
          <Row className="border-bottom pt-2 pb-2 text-center">
            <Col sm={12}>{message}</Col>
          </Row>
        </Col>
      </Row>
    );
  else
    return (
      <Row className="mt-3 justify-content-center">
        <Col xs={11} className="mb-3 border border-dark rounded">
          <Row className="border-bottom">
            <CustomCol xs={3} sm={2} className="pt-2 pb-2 text-white fw-bold">
              #
            </CustomCol>
            <Col xs={9} sm={10} className="pt-2 pb-2 text-end">
              {message}
            </Col>
          </Row>
        </Col>
      </Row>
    );
};

export default NoUsers;
