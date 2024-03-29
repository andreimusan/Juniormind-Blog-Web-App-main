import styled from "styled-components";
import { Button, Card, Col, Modal, Spinner } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { BsDot, BsXLg } from "react-icons/bs";

// view post styling
export const PostContainer = styled.div`
  margin: 20px auto;
  width: 50%;

  @media only screen and (max-width: 600px) {
    width: 90%;
  }

  @media only screen and (min-width: 600px) {
    width: 70%;
  }

  @media only screen and (min-width: 768px) {
    width: 70%;
  }

  @media only screen and (min-width: 992px) {
    width: 65%;
  }

  @media only screen and (min-width: 1200px) {
    width: 55%;
  }
`;

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
  margin-bottom: 1rem;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }
`;

export const PostImageReplacement = styled.div`
  display: block;
  background-color: grey;
  height: 20rem;
  border-radius: 15px;
  margin-bottom: 10px;

  @media only screen and (max-width: 992px) {
    height: 15rem;
  }
`;

export const PostTitle = styled.h1`
  margin-top: 10px;
  margin-right: auto;
`;

export const PostTitleEditable = styled.input`
  margin-right: auto;
  margin-top: 10px;
  width: 50%;
  padding: 6px 10px;
  box-sizing: content-box;
  border: 1px solid #bdbdbd;
  border-radius: 4px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.25rem rgb(173 216 230 / 40%);
    border-color: rgb(173 216 230);
  }
`;

export const PostBtn = styled(Button)`
  margin: 0 0 0 10px;
  width: 100px;
  display: ${(props) => {
    if (props.hide === "true") return "none";
  }};

  @media only screen and (max-width: 768px) {
    margin: 10px 10px 10px 0;
  }
`;

export const DetailsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PostAuthor = styled.p`
  font-weight: 500;
  margin: 0 0.3rem 0.5rem 0;

  @media only screen and (max-width: 600px) {
    margin: 0;
  }
`;

export const PostDate = styled.p`
  color: #bdbdbd;
  margin: 0 0.3rem 0.5rem 0.3rem;

  @media only screen and (max-width: 600px) {
    margin: 0;
  }
`;

export const PostDot = styled(BsDot)`
  padding-bottom: 0.2rem;
  color: #bdbdbd;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

export const PostContent = styled.p`
  height: 10%;
  overflow: auto;
  white-space: pre-wrap;
  text-align: justify;
  text-justify: inter-word;
  margin-bottom: 3rem;
`;

export const PostContentEditable = styled.textarea`
  width: 100%;
  height: 70vh;
  display: block;
  padding: 10px;
  text-align: justify;
  text-justify: inter-word;
  border: 1px solid #bdbdbd;
  border-radius: 4px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.25rem rgb(173 216 230 / 40%);
    border-color: rgb(173 216 230);
  }

  @media only screen and (max-width: 768px) {
    height: 50vh;
  }
`;

// modal styling
export const CustomModalContainer = styled(Modal)`
  .modal-footer {
    justify-content: flex-start;
    padding-left: 0.4rem;
  }
`;

export const ModalBtn = styled(Button)`
  margin: 0 0 0 10px;
  width: 100px;
  position: relative;

  @media only screen and (max-width: 257px) {
    margin: 5px 0 5px 10px;
  }
`;

export const BtnSpinner = styled(Spinner)`
  position: absolute;
  left: 67%;
  top: 30%;
`;

// post preview styling
export const PostCol = styled(Col)`
  justify-content: center;
`;

export const PostNavLink = styled(NavLink)`
  text-decoration: none;
  color: #2a2a2a;

  &:hover {
    color: #2a2a2a;
  }
`;

export const PostCard = styled(Card)`
  width: 22rem;
  height: 30rem;
  border-radius: 15px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  .card-title {
    texttransform: "uppercase";
    color: #2a2a2a;
  }

  .card-text {
    textalign: "justify";
    color: #2a2a2a;
  }

  .card-author {
    font-weight: 500;
    margin-bottom: 0;
  }

  .card-footer {
    &:last-child {
      border-radius: 0 0 15px 15px;
    }
  }

  @media only screen and (max-width: 575.9px) {
    width: 18rem;
    max-height: 28rem;
  }

  @media only screen and (max-width: 299.9px) {
    width: 16rem;
  }
`;

export const CardImageReplacement = styled.div`
  display: block;
  background-color: grey;
  height: 15rem;
  border-radius: 15px 15px 0 0;

  @media only screen and (max-width: 575.9px) {
    height: 12rem;
  }

  @media only screen and (max-width: 299.9px) {
    height: 10.5rem;
  }
`;

export const PostImage = styled.img`
  display: block;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  border: 0.5px solid grey;
  border-radius: 15px 15px 0 0;

  @media only screen and (max-width: 776px) {
    height: 30rem;
  }

  @media only screen and (max-width: 662px) {
    height: 20rem;
  }

  @media only screen and (max-width: 575.9px) {
    height: 12rem;
  }

  @media only screen and (max-width: 299.9px) {
    height: 10.5rem;
  }
`;

export const PostImagePreview = styled.img`
  border: 0.5px solid grey;
  border-radius: 15px 15px 0 0;
  height: 15rem;
`;

export const FileInput = styled.input`
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;

  &::file-selector-button {
    margin-right: 15px;
  }
`;

export const DeleteImageButton = styled(Button)`
  display: block;
  margin-bottom: 1%;
  margin-right: 1%;
  margin-top: 1%;
  background: none;
  border: none;
  padding: 0%;
  color: grey;
  text-decoration: underline;

  &:hover {
    background: none;
    color: black;
    text-decoration: underline;
  }
  &:focus {
    background: none;
    color: black;
    outline: none;
    box-shadow: none;
  }
`;

export const RemoveFileBtn = styled(BsXLg)`
  display: inline-block;
  vertical-align: top;
  margin-left: 1%;
  color: grey;

  &:hover {
    color: black;
    cursor: pointer;
  }
`;

export const PostFilePreview = styled.img`
  display: inline-block;
  margin-bottom: 1%;
  border: 0.5px solid grey;
  height: 8rem;
`;

export const UploadError = styled.p`
  color: red;
`;
