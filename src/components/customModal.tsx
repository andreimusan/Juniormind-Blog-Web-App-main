import { Modal } from "react-bootstrap";
import {
  BtnSpinner,
  CustomModalContainer,
  ModalBtn,
} from "./styles/components.styles";

type Props = {
  show: boolean;
  title: string;
  content: string | JSX.Element;
  onConfirm: Function;
  isLoading: boolean;
};

const CustomModal = ({ show, title, content, onConfirm, isLoading }: Props) => {
  return (
    <CustomModalContainer
      show={show}
      size="sm"
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        {title === "Error" && (
          <ModalBtn variant="secondary" onClick={() => onConfirm(true)}>
            OK
          </ModalBtn>
        )}
        {title !== "Error" && (
          <>
            <ModalBtn variant="secondary" onClick={() => onConfirm(true)}>
              Yes
              {isLoading && <BtnSpinner animation="border" size="sm" />}
            </ModalBtn>
            <ModalBtn variant="outline-danger" onClick={() => onConfirm(false)}>
              No
            </ModalBtn>
          </>
        )}
      </Modal.Footer>
    </CustomModalContainer>
  );
};

export default CustomModal;
