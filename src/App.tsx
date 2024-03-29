import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogNavbar from "./components/navbar";
import Posts from "./pages/posts";
import ViewUsers from "./pages/userPages/viewUsers";
import UserProfile from "./pages/userPages/userProfile";
import AddUser from "./pages/userPages/addUser";
import EditUser from "./pages/userPages/editUser";
import AddPost from "./components/post/addPost";
import Login from "./components/login";
import RestrictedRoutes from "./restrictedRoutes";
import RestrictedAdminRoutes from "./restrictedAdminRoutes";
import RestrictedAdminOrOwnerRoutes from "./restrictedAdminOrOwnerRoutes";
import RestrictedAfterLogin from "./restrictedAfterLogin";
import "./App.css";
import ErrorPage from "./pages/error";
import { useAppDispatch } from "./components/store/store";
import { isAlreadyLoggedIn } from "./components/store/authenticationSlice";
import ViewPostPage from "./pages/viewPostPage";
import EditPostPage from "./pages/editPostPage";
import RestrictedPostsRoutes from "./restrictedPostsRoutes";

function App() {
  const dispatch = useAppDispatch();
  dispatch(isAlreadyLoggedIn({}));

  return (
    <div className="App">
      <Router>
        <BlogNavbar />
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/error/:status" element={<ErrorPage />} />
          <Route path="/posts/:id" element={<ViewPostPage />} />
          <Route element={<RestrictedAfterLogin />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<RestrictedRoutes />}>
            <Route path="/posts/add" element={<AddPost />} />
            <Route element={<RestrictedPostsRoutes />}>
              <Route path="/posts/edit/:id" element={<EditPostPage />} />
            </Route>
            <Route element={<RestrictedAdminOrOwnerRoutes />}>
              <Route path="/users/:id" element={<UserProfile />} />
              <Route path="/users/edit/:id" element={<EditUser />} />
            </Route>
            <Route element={<RestrictedAdminRoutes />}>
              <Route path="/users" element={<ViewUsers />} />
              <Route path="/users/add" element={<AddUser />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
