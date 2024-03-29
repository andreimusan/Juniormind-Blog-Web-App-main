import styled from "styled-components";
import { Button, Navbar, NavDropdown, Spinner } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { BsPerson } from "react-icons/bs";

// navbar styling
export const CustomNavbar = styled(Navbar)`
  background-color: lightblue;
  padding: 0 1rem;
  min-height: 60px;
`;

export const NavContainer = styled.div`
  width: 100%;
  margin: 10px auto;
  padding: 0;

  .dropdown-item {
    &:active {
      background-color: #6c757d;
    }
  }
`;

export const AddBtn = styled(Button)`
  margin-right: 5px;
  width: 110px;
  font-size: 1rem;
  font-weight: 400;
  color: #6c757d;
  border: 1px solid transparent;
  transition: border-color 0.5s ease;

  &:hover {
    color: #212529;
    background-color: transparent;
    border: 1px solid #212529;
  }

  @media (max-width: 576px) {
    margin-right: 0;
    margin-top: 20px;
    margin-bottom: 2px;
  }
`;

export const UserNavDropdown = styled(NavDropdown)`
  .dropdown-toggle::after {
    position: absolute;
    margin-top: 11px;
  }

  .dropdown-menu {
    right: -30px;
  }

  a {
    color: #6c757d !important;
  }

  &:hover {
    a {
      color: #212529 !important;
    }
  }

  @media (max-width: 576px) {
    .dropdown-toggle {
      padding-right: 7px;
    }

    .dropdown-menu {
      position: absolute !important;
      right: -30px;
    }
  }
`;

export const NavbarLink = styled(NavLink)`
  margin: 0 2rem 0 0.7rem;
  text-decoration: none;
  color: #2a2a2a;
  font-size: 20px;

  &:hover {
    color: #2a2a2a;
    -webkit-text-stroke: 1px black;
  }

  @media only screen and (max-width: 575.9px) {
    margin: 0 auto 10px auto;
  }
}
`;

export const LoginBtn = styled(Button)`
  border: none;
  width: 110px;
  font-size: 1rem;
  font-weight: 400;
  color: #6c757d;
  border: 1px solid transparent;
  transition: border-color 0.5s ease;

  &:hover {
    color: #212529;
    background-color: transparent;
    border: 1px solid #212529;
  }
`;

export const UserIcon = styled(BsPerson)`
  color: #6c757d;
  transform: scale(1.5);

  @media (max-width: 576px) {
    margin-right: 7px;
  }
`;

export const DropdownContainer = styled.div`
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 200px;
  min-width: 110px;
  padding: 0 20px 0 17px;
  border: 1px solid transparent;
  border-radius: 5px;
  transition: border-color 0.5s ease;

  &:hover {
    border: 1px solid #212529;
    color: #212529;

    ${UserIcon} {
      color: #212529;
    }

    .dropdown-toggle {
      color: #212529 !important;
    }
  }
`;

//login styling
export const LoginContainer = styled.div`
  padding: 60px 0;

  form {
    margin: 0 auto;
    max-width: 320px;
  }

  .form-control:focus {
    box-shadow: 0 0 0 0.25rem rgb(173 216 230 / 40%);
    border-color: rgb(173 216 230);
  }

  .modal-footer {
    padding-top: 35px;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      margin: 0;
      color: #bdbdbd;
    }
  }

  @media (max-width: 575.9px) {
    padding: 120px 0;
  }
`;

export const SubmitBtn = styled(Button)`
  width: 100%;
  position: relative;
`;

export const CancelBtn = styled(Button)`
  border: none;
  margin-top: 5px;
  padding: 5px;

  &:hover {
    background-color: transparent;
    color: inherit;
    text-decoration: underline;
  }
`;

export const SignUpBtn = styled(Button)`
  border: none;
  text-transform: uppercase;
  margin-top: 0;

  &:hover {
    background-color: transparent;
    color: inherit;
    text-decoration: underline;
  }
`;

type FormFeedbackProps = {
  hide: boolean;
};

export const FormFeedback = styled.span<FormFeedbackProps>`
  color: #dc3545;
  position: absolute;
  top: 6.25rem;
  display: ${(props) => {
    if (props.hide) return "none";
  }};
`;

export const BtnSpinner = styled(Spinner)`
  position: absolute;
  left: 60%;
  top: 30%;
`;

export const UserPictureContainer = styled.div`
  border: 0.5px solid grey;
  display: inline-block;
  position: relative;
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;

  @media (max-width: 576px) {
    margin-right: 7px;
  }
`;

export const UserPicture = styled.img`
  width: auto;
  height: 100%;
`;
