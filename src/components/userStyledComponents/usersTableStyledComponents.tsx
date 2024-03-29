import { Col, Row } from "react-bootstrap";
import styled from "styled-components";

export const IconContainer = styled.span`
  margin-right: 0.4rem;
`;

export const StatusContainerGreen = styled.span`
  padding-right: 0.3rem;
  padding-left: 0.3rem;
  padding-bottom: 0.16rem;
  background-color: lightgreen;
`;

export const StatusContainerRed = styled.span`
  padding-right: 0.3rem;
  padding-left: 0.3rem;
  padding-bottom: 0.16rem;
  background-color: #ff9999;
`;

export const CustomTHead = styled(Row)`
  background-color: #6d7993;
  height: 60px;
  align-items: center;
`;

export const CustomCol = styled(Col)`
  background-color: #6d7993;
`;

export const GreyActionsIconsContainer = styled.span`
  background-color: #edf0f5;
`;

export const CustomTRow = styled(Row)`
  align-items: center;
`;

export const CustomTCol = styled(Col)`
  height: 3rem;
`;

export const UserPictureContainer = styled.div`
  border: 0.5px solid grey;
  display: inline-block;
  position: relative;
  width: 3rem;
  height: 3rem;
  overflow: hidden;
  border-radius: 50%;
`;

export const UserPicture = styled.img`
  width: auto;
  height: 100%;
`;
