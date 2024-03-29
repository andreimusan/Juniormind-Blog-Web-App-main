import { Button, Form } from "react-bootstrap";
import styled from "styled-components";

export const FormField = styled(Form.Control)`
  cursor: inherit;
`;

export const ImageContainer = styled.div`
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 10px 20px;
  margin-top: 5px;
  display: flex;
  align-items: center;

  @media only screen and (max-width: 700px) {
    flex-direction: column;
  }
`;

export const RemoveImageBtn = styled(Button)`
  margin-left: 20px;
  background: none;
  border: none;
  padding: 0;
  display: inline-block;
  color: grey;
  text-decoration: underline;
  
  &:hover {
    text-decoration: underline;
    background: none;
    color: black;
  }
  &:focus {
    text-decoration: underline;
    background: none;
    color: black;
    outline: none;
    box-shadow: none;
  }

  @media only screen and (max-width: 700px) {
    margin: 0;
  }
}
`;
