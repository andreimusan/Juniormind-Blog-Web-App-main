import CustomModal from "./customModal";

type Props = {
  show: boolean;
  errorStatus: number;
  onConfirm: Function;
  isLoading: boolean;
};

const ErrorModal = ({ show, errorStatus, onConfirm, isLoading }: Props) => {
  const getErrorText = () => {
    switch (errorStatus) {
      case 400:
        return "400 - Bad request";
      case 401:
        return "401 - Unauthorized";
      case 403:
        return "403 - Forbidden";
      case 404:
        return "404 - Not found";
      default:
        return "500 - Unexpected server error";
    }
  };

  return (
    <div id="errorModal">
      <CustomModal
        show={show}
        title="Error"
        content={getErrorText()}
        onConfirm={onConfirm}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ErrorModal;
