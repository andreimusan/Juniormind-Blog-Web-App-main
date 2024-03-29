import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import * as react from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "../../components/store/store";
import ViewUsers from "../../pages/userPages/viewUsers";
import User from "../../models/user";

const user1 = new User(
  1,
  "Denis",
  "denis@mail.com",
  "password",
  false,
  new Date(),
  new Date()
);
const user2 = new User(
  2,
  "Andrei",
  "andrei@mail.com",
  "password",
  false,
  new Date(),
  new Date()
);
const user3 = new User(
  3,
  "Adrian",
  "adrian@mail.com",
  "password",
  false,
  new Date(),
  new Date()
);
let users = [user1, user2, user3];

let container: HTMLDivElement;

describe("Users component with users", () => {
  beforeEach(() => {
    jest.spyOn(react, "useSelector").mockReturnValue({
      users,
      usersCount: "3",
      getAllUsersStatus: "success",
      usersPage: "1",
      usersSearchText: "",
    });
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    unmountComponentAtNode(container);
    container.remove();
  });

  test("should render users table head", () => {
    act(() => {
      render(
        <react.Provider store={store}>
          <Router>
            <ViewUsers />
          </Router>
        </react.Provider>,
        container
      );
    });
    const number = screen.getByText(/#/i);
    const picture = screen.getByText(/picture/i);
    const name = screen.getByText(/name/i);
    const email = screen.getByText(/email/i);
    const admin = screen.getByText(/admin/i);
    const status = screen.getByText(/status/i);
    const actions = screen.getByText(/actions/i);
    expect(number).toBeInTheDocument();
    expect(picture).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(admin).toBeInTheDocument();
    expect(status).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
  });

  test("should render users", () => {
    act(() => {
      render(
        <react.Provider store={store}>
          <Router>
            <ViewUsers />
          </Router>
        </react.Provider>,
        container
      );
    });
    const userEmail1 = screen.getByText(/denis@mail\.com/i);
    const userEmail2 = screen.getByText(/andrei@mail\.com/i);
    const userEmail3 = screen.getByText(/adrian@mail\.com/i);
    expect(userEmail1).toBeInTheDocument();
    expect(userEmail2).toBeInTheDocument();
    expect(userEmail3).toBeInTheDocument();
  });

  test("should render search bar", () => {
    act(() => {
      render(
        <react.Provider store={store}>
          <Router>
            <ViewUsers />
          </Router>
        </react.Provider>,
        container
      );
    });
    const search = screen.getByRole("textbox", {
      name: /search/i,
    });
    expect(search).toBeInTheDocument();
  });

  test("should render pagination bar", () => {
    act(() => {
      render(
        <react.Provider store={store}>
          <Router>
            <ViewUsers />
          </Router>
        </react.Provider>,
        container
      );
    });
    const pagination = screen.getByRole("list");
    expect(pagination).toBeInTheDocument();
  });
});

describe("Users component with no users", () => {
  beforeEach(() => {
    jest.spyOn(react, "useSelector").mockReturnValue({
      users: [],
      usersCount: "0",
      getAllUsersStatus: "success",
      usersPage: "1",
      usersSearchText: "",
    });
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    unmountComponentAtNode(container);
    container.remove();
  });

  test("should render users table head", () => {
    act(() => {
      render(
        <react.Provider store={store}>
          <Router>
            <ViewUsers />
          </Router>
        </react.Provider>,
        container
      );
    });
    const number = screen.getByText(/#/i);
    const picture = screen.getByText(/picture/i);
    const name = screen.getByText(/name/i);
    const email = screen.getByText(/email/i);
    const admin = screen.getByText(/admin/i);
    const status = screen.getByText(/status/i);
    const actions = screen.getByText(/actions/i);
    expect(number).toBeInTheDocument();
    expect(picture).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(admin).toBeInTheDocument();
    expect(status).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
  });

  test("should not render users", () => {
    act(() => {
      render(
        <react.Provider store={store}>
          <Router>
            <ViewUsers />
          </Router>
        </react.Provider>,
        container
      );
    });
    const message = screen.getByText(/No users to display/i);
    expect(message).toBeInTheDocument();
  });

  test("should render search bar", () => {
    act(() => {
      render(
        <react.Provider store={store}>
          <Router>
            <ViewUsers />
          </Router>
        </react.Provider>,
        container
      );
    });
    const search = screen.getByRole("textbox", {
      name: /search/i,
    });
    expect(search).toBeInTheDocument();
  });
});

describe("Users component pending", () => {
  beforeEach(() => {
    jest.spyOn(react, "useSelector").mockReturnValue({
      users: [],
      usersCount: "0",
      getAllUsersStatus: "pending",
      usersPage: "1",
      usersSearchText: "",
    });
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    unmountComponentAtNode(container);
    container.remove();
  });

  test("should render loading text", () => {
    act(() => {
      render(
        <react.Provider store={store}>
          <Router>
            <ViewUsers />
          </Router>
        </react.Provider>,
        container
      );
    });
    const message = screen.getByText(/Loading.../i);
    expect(message).toBeInTheDocument();
  });
});
