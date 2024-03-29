import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, ErrorButton, LightText } from "./styles/pages.styles";

const ErrorPage = () => {
  const errorStatus = useParams().status;
  const navigate = useNavigate();

  const Error = (props: { text: string }) => {
    return (
      <div>
        <ErrorMessage>{props.text}</ErrorMessage>
        <ErrorButton onClick={() => navigate(-2)}>Go back</ErrorButton>
        <ErrorButton onClick={() => navigate("/posts")}>
          Go to posts page
        </ErrorButton>
        <LightText>
          If the problem persists, you can reach us by email at&nbsp;
          <a href="mailto:support@blogapp.com">support@blogapp.com</a>.
        </LightText>
      </div>
    );
  };

  switch (errorStatus) {
    case "400":
      return <Error text="400 - Bad request" />;
    case "401":
      return <Navigate to="/login" />;
    case "403":
      return <Error text="403 - Forbidden" />;
    case "404":
      return <Error text="404 - Not found" />;
    default:
      return <Error text="500 - Unexpected server error" />;
  }
};

export default ErrorPage;
