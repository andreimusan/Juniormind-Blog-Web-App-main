import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./store/store";
import { getLoginStatus, logout } from "./store/authenticationSlice";
import {
  CustomNavbar,
  LoginBtn,
  NavContainer,
  NavbarLink,
  AddBtn,
  UserNavDropdown,
  DropdownContainer,
  UserIcon,
  UserPicture,
  UserPictureContainer,
} from "../components/styles/navbar.styles";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import CustomModal from "./customModal";

const BlogNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [expanded, setExpanded] = useState(false);
  let node: Node;
  document.addEventListener("click", (e) => {
    if (
      node &&
      node !== null &&
      e.target !== node &&
      !node.contains(e.target as Node)
    )
      setExpanded(false);
  });
  useEffect(() => {
    return () => {
      setExpanded(!expanded);
    };
  }, [expanded]);

  const { isLoggedIn, username, userId, userImage, isAdmin } =
    useSelector(getLoginStatus);
  const isOnPostPage = location.pathname.includes("posts");
  const isOnUserPage = location.pathname.includes("users");

  let usersLink;
  if (isLoggedIn && isAdmin) {
    usersLink = (
      <NavbarLink id="RouterNavLink" to="/users">
        Users
      </NavbarLink>
    );
  }

  const handleLogout = (applyChanges: boolean) => {
    if (applyChanges) dispatch(logout({}));
    setShow(false);
  };

  const [show, setShow] = useState(false);
  const modalTitle = "LOGOUT";
  const modalContent = "Do you want to log out from your account?";

  return (
    <CustomNavbar
      expand="sm"
      variant="light"
      sticky="top"
      expanded={expanded}
      ref={(c: Node) => (node = c)}
    >
      <NavContainer>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded(expanded ? false : true)}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav
            className="me-auto"
            onClick={() =>
              setTimeout(() => {
                setExpanded(false);
              }, 100)
            }
          >
            <NavbarLink id="RouterNavLink" to="/posts">
              Posts
            </NavbarLink>

            {usersLink}
          </Nav>
          <Nav style={{ alignItems: "center" }}>
            {isLoggedIn && isOnPostPage && (
              <AddBtn
                variant="outline-secondary"
                onClick={() => navigate("/posts/add")}
              >
                Add post
              </AddBtn>
            )}
            {isLoggedIn && isAdmin && isOnUserPage && (
              <AddBtn
                variant="outline-secondary"
                onClick={() => navigate("/users/add")}
              >
                Add user
              </AddBtn>
            )}
            {!isLoggedIn && (
              <LoginBtn
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Log in
              </LoginBtn>
            )}
            {isLoggedIn && (
              <DropdownContainer>
                {userImage !== "" && (
                  <UserPictureContainer>
                    <UserPicture
                      src={process.env.REACT_APP_IMAGE_URL + userImage}
                      alt={"profile"}
                    />
                  </UserPictureContainer>
                )}
                {userImage === "" && <UserIcon />}
                <UserNavDropdown
                  align="end"
                  title={`${username}`}
                  id="dropdown-menu-user"
                >
                  <NavDropdown.Item
                    onClick={() => navigate(`/users/${userId}`)}
                  >
                    View Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setShow(true)}>
                    Log out
                  </NavDropdown.Item>
                </UserNavDropdown>
              </DropdownContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </NavContainer>
      <CustomModal
        show={show}
        title={modalTitle}
        content={modalContent}
        onConfirm={handleLogout}
        isLoading={false}
      />
    </CustomNavbar>
  );
};

export default BlogNavbar;
