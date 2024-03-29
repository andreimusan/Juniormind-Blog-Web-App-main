import { Button, Row } from "react-bootstrap";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import styled from "styled-components";

export const NameText = styled.span`
  color: #157eab;
`;
export const IsAdminIcon = styled(BsCheckCircleFill)`
  margin-bottom: 0.17rem;
`;

export const IsNotAdminIcon = styled(BsXCircleFill)`
  margin-bottom: 0.17rem;
`;

export const ColouredProfileHead = styled(Row)`
  background-color: #99a8cc;
`;

export const CustomButton = styled(Button)`
  font-size: 0.85rem;
`;

export const UserProfileContainer = styled.div`
  border: 0.5px solid grey;
  display: inline-block;
  position: relative;
  width: 4.5rem;
  height: 4.5rem;
  overflow: hidden;
  border-radius: 50%;
`;

export const UserProfilePicture = styled.img`
  width: auto;
  height: 100%;
`;
