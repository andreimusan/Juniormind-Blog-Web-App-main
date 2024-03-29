import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../components/store/store";
import { getAllPosts, selectPosts } from "../components/store/postSlice";
import PostsPreview from "../components/post/postPreview";
import { PostContainer, LightText } from "./styles/pages.styles";
import { Col, Row } from "react-bootstrap";
import Post from "../models/post";
import UseWindowDimensions from "../components/window/useWindowDimensions";
import Loading from "../components/loading";
import SearchBar from "../components/searchBar";
import PaginationBar from "../components/paginatonBar";
import usePrevious from "../components/usePrevious";

const Posts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { posts, getAllPostsStatus, postsCount } = useSelector(selectPosts);
  const [searchText, setSearchText] = useState("");
  const [errorStatus, setErrorStatus] = useState(0);
  const [page, setPage] = useState(1);
  const prevSearchRef = usePrevious(searchText);

  const { width } = UseWindowDimensions();
  let gyClass = "gy-5";
  if (width < 991.9) gyClass = "gy-3";
  if (width < 767.9) gyClass = "gy-4";

  useEffect(() => {
    if (page === 1) return;
    if (
      (prevSearchRef === "" && searchText !== "") ||
      (posts.length === 0 && searchText !== "") ||
      (prevSearchRef !== undefined && prevSearchRef !== "" && searchText === "")
    )
      setPage(1);
    
    if (posts.length === 0 && searchText !== "" && page !== 1) setPage(1);
  }, [page, posts.length, prevSearchRef, searchText]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      (async () => {
        const response = (
          await dispatch(getAllPosts({ search: searchText, page }))
        ).payload;
        if (response.status !== undefined && response.status !== 200) {
          setErrorStatus(response.status);
        }
      })();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [dispatch, page, searchText]);

  useEffect(() => {
    (async () => {
      if (posts.length === 0 && searchText === "") {
        const response = await dispatch(getAllPosts({ search: "", page }));
        if (response.meta.requestStatus === "rejected")
          setErrorStatus(response.payload.status);
      }
    })();
  }, [posts.length, dispatch, navigate, page, searchText]);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (getAllPostsStatus === "pending") setIsLoading(true);

    return () => setIsLoading(false);
  }, [getAllPostsStatus]);

  const allPosts = posts.map((post: Post) => (
    <PostsPreview key={post.id} post={post}></PostsPreview>
  ));
  return errorStatus !== 0 && errorStatus !== undefined ? (
    <Navigate to={`/error/${errorStatus}`} />
  ) : (
    <PostContainer>
      {isLoading && posts.length === 0 && <Loading />}
      {posts.length !== 0 && (
        <Row
          className="mt-4 justify-content-center text-end"
          style={{ marginBottom: "2%" }}
        >
          <Col className="col-sm-11" style={{ marginLeft: "5%" }}>
            <SearchBar value={searchText} searchContent={setSearchText} />
          </Col>
        </Row>
      )}
      {getAllPostsStatus !== "success" && searchText !== "" && (
        <LightText>No posts found.</LightText>
      )}
      {getAllPostsStatus === "success" && (
        <div>
          <Row className={`gx-5 ${gyClass}`}>{allPosts}</Row>
          <PaginationBar
            unitsPerPage={6}
            unitsCount={postsCount}
            page={page}
            setPage={setPage}
          />
        </div>
      )}
    </PostContainer>
  );
};

export default Posts;
