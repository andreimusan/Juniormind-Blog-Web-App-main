import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UsersThead from "../../components/userComponents/usersThead";
import UserRow from "../../components/userComponents/userRow";
import User from "../../models/user";
import UseWindowDimensions from "../../components/window/useWindowDimensions";
import UserCard from "../../components/userComponents/userCard";
import { useSelector } from "react-redux";
import {
  getAllUsers,
  selectUsers,
  getFilteredUsers,
  setCurrentPage,
  setCurrentSearchText,
} from "../../components/store/userSlice";
import { useAppDispatch } from "../../components/store/store";
import { Navigate } from "react-router-dom";
import Loading from "../../components/loading";
import SearchBar from "../../components/searchBar";
import NoUsers from "../../components/userComponents/noUsers";
import PaginationBar from "../../components/paginatonBar";
import usePrevious from "../../components/usePrevious";

const ViewUsers = () => {
  const dispatch = useAppDispatch();
  const { users, usersCount, getAllUsersStatus, usersPage, usersSearchText } =
    useSelector(selectUsers);
  const [errorStatus, setErrorStatus] = useState(0);
  const [page, setPage] = useState(usersPage);
  const [searchText, setSearchText] = useState(usersSearchText);
  const prevSearchRef = usePrevious(searchText);

  const jumpToFirstPage = useCallback(() => {
    if (page === 1) return;
    if (
      (prevSearchRef === "" && searchText !== "") ||
      (users.length === 0 && searchText !== "") ||
      (prevSearchRef !== undefined && prevSearchRef !== "" && searchText === "")
    )
      setPage(1);
  }, [page, prevSearchRef, searchText, users.length]);

  useEffect(() => {
    dispatch(setCurrentSearchText(searchText));
  }, [dispatch, searchText]);

  useEffect(() => {
    jumpToFirstPage();
  }, [jumpToFirstPage]);

  useEffect(() => {
    (async () => {
      if (
        (searchText === "" && prevSearchRef === searchText) ||
        (users.length === 0 && searchText === "" && prevSearchRef === undefined)
      ) {
        const response = (await dispatch(getAllUsers({ page }))).payload;
        if (response.status !== undefined && response.status !== 200)
          setErrorStatus(response.status);
        else dispatch(setCurrentPage(page));
      }
    })();
  }, [dispatch, page, prevSearchRef, searchText, users.length]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchText !== "" && prevSearchRef === searchText)
        (async () => {
          const response = (
            await dispatch(
              getFilteredUsers({ page, emailFilter: "", search: searchText })
            )
          ).payload;
          if (response.status !== undefined && response.status !== 200)
            setErrorStatus(response.status);
          else dispatch(setCurrentPage(page));
        })();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [dispatch, page, prevSearchRef, searchText]);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (getAllUsersStatus === "pending") {
      setIsLoading(true);
      document.body.style.cursor = "wait";
    }

    return () => {
      setIsLoading(false);
      document.body.style.cursor = "auto";
    };
  }, [getAllUsersStatus]);

  const { width } = UseWindowDimensions();

  let searchCol: string = "col-sm-11";
  if (width < 725) searchCol = "col-11";

  let userRows;
  let userCards;
  let usersTable;
  if (width >= 725) {
    if (!userRows)
      userRows = users.map((user: User) => (
        <UserRow key={user.id} receivedUser={user} />
      ));
    usersTable = (
      <Row className="mt-3 justify-content-center">
        <Col className="border border-dark rounded" sm={11}>
          <UsersThead></UsersThead>
          {userRows}
        </Col>
      </Row>
    );
  } else {
    if (userCards === undefined)
      userCards = users.map((user: User) => (
        <UserCard key={user.id} receivedUser={user} />
      ));
    usersTable = <Row className="mt-3 justify-content-center">{userCards}</Row>;
  }

  return errorStatus !== 0 ? (
    <Navigate to={`/error/${errorStatus}`} />
  ) : isLoading ? (
    <Loading />
  ) : (
    <Container fluid>
      <Row className="mt-4 justify-content-center text-end">
        <Col className={searchCol} style={{ padding: "0" }}>
          <SearchBar value={searchText} searchContent={setSearchText} />
        </Col>
      </Row>
      {users.length !== 0 && usersTable}
      {users.length === 0 && <NoUsers />}
      <PaginationBar
        unitsPerPage={5}
        unitsCount={usersCount}
        page={page}
        setPage={setPage}
      />
    </Container>
  );
};

export default ViewUsers;
