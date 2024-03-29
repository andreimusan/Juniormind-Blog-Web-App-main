import { Button, CloseButton, Container, Pagination } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import styled from "styled-components";

export const ErrorMessage = styled.h3`
  color: #dc3545;
  display: flex;
  justify-content: center;
  margin: 5rem auto 2rem;
`

export const LoadingContainer = styled(Container)`
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: grey;
`

export const ErrorButton = styled(Button)`
  margin: auto;
  display: flex;
  justify-content: center;
  background: none;
  border: none;
  padding: 0%;
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
`

export const LightText = styled.p`
  margin-top: 2%;
  display: flex;
  justify-content: center;
  color: grey;
`

export const PostContainer = styled(Container)`
  margin: 20px auto;
`

// search bar
export const SearchContainer = styled.div`
  float: right;
  position: relative;
  width: 30vw;

  @media only screen and (max-width: 992px) {
    width: 100%;
  }
`

export const SearchInput = styled.input`
  text-indent: 30px;
  color: grey;
  width: inherit;
  height: 4.6vh;

  &:focus-visible {
    border: 2px solid grey;
    border-radius: 4px;
    outline: none;
  }
`

export const SearchIconContainer = styled.span`
  position: absolute;
  top: 3px;
  left: 2px;
  width: 32px;
  padding-right: 8px;
  background-color: #fff;
`

export const SearchIcon = styled(BsSearch)`
  color: grey;
`

export const SearchCloseBtnContainer = styled.span`
  position: absolute;
  top: 4px;
  right: 2px;
  border-left: 1px solid #d1d5db;
  background-color: #fff;
`

export const SearchCloseBtn = styled(CloseButton)`
  margin: 1px 4px 0;
`

// pagination bar
export const PaginationContainer = styled(Container)`
  margin: 1rem auto 0;
  display: flex;
  justify-content: center;
  color: grey;
`

export const PaginationItem = styled(Pagination.Item)`
  a {
    color: grey;

    &:hover, &:focus {
      color: #2a2a2a;
    }
  }

  span {
    background-color: #6c757d !important;
    border-color: #6c757d !important;
  }
`

export const PaginationPrev = styled(Pagination.Prev)`
  a {
    color: grey;

    &:hover, &:active, &:focus {
      color: #2a2a2a;
    }
  }
`

export const PaginationNext = styled(Pagination.Next)`
  a {
    color: grey;

    &:hover, &:active, &:focus {
      color: #2a2a2a;
    }
  }
`
