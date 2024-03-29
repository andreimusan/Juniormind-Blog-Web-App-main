import styled from "styled-components";
import { Container, Button } from "react-bootstrap";

export const CommentContainer = styled(Container)`
  margin: 1% 0% 1% 0%;
  border: 1px solid lightgray;
  border-radius: 5px;
  background-color: whitesmoke;
`;

export const AllComments = styled(Container)`
  margin: 1% 0% 1% 0%;
  width: 100%;
  padding: 0;
`;

export const ReplyContainer = styled(Container)`
  margin: 1% 0% 1% 5%;
  width: 95%;
  border: 1px solid lightgray;
  border-radius: 5px;
  background-color: whitesmoke;
`;

export const CommentDataContainer = styled.div`
  font-size: 80%;
  padding: 1%;
  margin: 1% 0% 1% 0%;
  width: 15%;
  display: inline-block;
  border: 1px solid lightgray;
  border-radius: 5px;

  @media only screen and (max-width: 700px) {
    width: 100%;
    height: min-content;
  }
`;

export const CommentTextContainer = styled.div`
  display: inline-block;
  margin: 1%;
  width: 83%;
  vertical-align: top;
`;

export const Text = styled.p`
  vertical-align: top;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const TextArea = styled.textarea`
  margin-top: 1%;
  width: 100%;
  padding: 1%;
  border: 1px solid lightgray;
  border-radius: 5px;
`;

export const Author = styled.p`
  text-align: center;
  color: grey;

  @media only screen and (max-width: 700px) {
    text-align: center;
    vertical-align: top;
    margin: 0%;
  }
`;

export const CommentDate = styled.p`
  text-align: center;
  margin: 1%;
  color: grey;

  @media only screen and (max-width: 700px) {
    text-align: center;
    vertical-align: top;
  }
`;

export const Reply = styled.p`
  vertical-align: top;
  border-radius: 5px;
  padding: 1%;
  color: grey;
  background-color: lightgray;
  font-style: italic;
`;

export const CustomButton = styled(Button)`
  margin-top: 1%;
  margin-bottom: 1%;
  margin-right: 1%;
  border-radius: 5px;
  background-color: lightblue;
  border:none;
  padding: 1% 4%;
  color: black;
  
  &:hover {
    background-color: lightskyblue;
    color: black;
  }
  &:focus {
    background-color: lightskyblue;
    color: black;
  }
  &:disabled {
    background-color: lightgray;
    color: black;
  }
}
`;

export const ActionButton = styled(Button)`
  margin-bottom: 1%;
  margin-right: 1%;
  background: none;
  border: none;
  padding: 0%;
  display: inline-block;
  color: grey;
  
  &:hover {
    background: none;
    color: black;
  }
  &:focus {
    background: none;
    color: black;
    outline: none;
    box-shadow: none;
  }

  @media only screen and (max-width: 700px) {
    margin-right: 10px;
  }
}
`;

export const ShowMoreRepliesButton = styled(Button)`
  margin: -1% 0% 1% 5%;
  background: none;
  border: none;
  padding: 0%;
  display: inline-block;
  color: grey;
  
  &:hover {
    background: none;
    color: black;
  }
  &:focus {
    background: none;
    color: black;
    outline: none;
    box-shadow: none;
  }

  @media only screen and (max-width: 700px) {
    margin-right: 10px;
  }
}
`;

export const ShowMoreButton = styled(Button)`
  margin-bottom: 1%;
  background: none;
  border: none;
  padding: 0% 0% 0% 1%;
  display: inline-block;
  color: steelblue;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
    background: none;
    color: steelblue;
  }
  &:focus {
    text-decoration: underline;
    background: none;
    color: steelblue;
    outline: none;
    box-shadow: none;
  }
`;

export const ShowCommentsButton = styled(Button)`
  margin-bottom: 1%;
  margin-right: 1%;
  background: none;
  border: none;
  padding: 0%;
  display: inline-block;
  color: black;
  font-size: larger;
  font-weight: 500;
  
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
    margin-right: 10px;
  }
}
`;

export const RedirectToLoginBtn = styled(Button)`
  margin-bottom: 1%;
  margin-right: 1%;
  background: none;
  border: none;
  padding: 0%;
  display: inline-block;
  color: grey;
  
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
    margin-right: 10px;
  }
}
`;

export const RepliesErrorText = styled.span`
  color: red;
`;

export const CommentsErrorText = styled.h5`
  color: red;
`;

export const NoCommentsFoundMessage = styled.h5`
  text-align: center;
`;
