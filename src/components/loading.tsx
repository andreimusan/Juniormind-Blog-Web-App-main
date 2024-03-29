import { Spinner } from "react-bootstrap";
import { LoadingContainer } from "../pages/styles/pages.styles";

const Loading = () => {
  return (
    <LoadingContainer>
      <Spinner animation="border" role="status" />
      <h6>Loading...</h6>
    </LoadingContainer>
  );
};

export default Loading;
