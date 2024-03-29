import { configureStore, createSlice, Store } from "@reduxjs/toolkit";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Posts from "../../pages/posts";
import Post from "../../models/post";

const post1 = new Post(1, "test title", "test content", 1, new Date().toDateString(), new Date().toDateString());
let mockSlice;
let mockStore: Store;

beforeAll(() => {
  mockSlice = createSlice({
    name: "posts",
    initialState: {
      posts: [post1],
      postsCount: 1,
      currentPost: { post: post1, isUpdated: false },
      getAllPostsStatus: "success",
      getAllPostsError: "",
    },
    reducers: {},
  });
  
  mockStore = configureStore({
    reducer: {
      postsStore: mockSlice.reducer,
    }
  });
});

afterEach(() => cleanup);

jest.mock("../../components/post/postPreview", () => () => {
   return <div>post-preview</div>
});

jest.mock("../../components/paginatonBar", () => () => {
  return <div>pagination-bar</div>
});

describe("Posts component", () => {
  test("should render Posts component", () => {
    const { baseElement } = render(
      <Provider store={mockStore}>
        <Router>
          <Posts />
        </Router>
      </Provider>
    );
    expect(baseElement).toBeInTheDocument();
  });

  test("should render search box", () => {
    const { queryByPlaceholderText } = render(
      <Provider store={mockStore}>
        <Router>
          <Posts />
        </Router>
      </Provider>
    );
    const searchInput = queryByPlaceholderText("search...")
    expect(searchInput).toBeInTheDocument();
  });

  test("should render post preview", () => {
    const { queryByText } = render(
      <Provider store={mockStore}>
        <Router>
          <Posts />
        </Router>
      </Provider>
    );
    const postPreview = queryByText("post-preview")
    expect(postPreview).toBeInTheDocument();
  });

  test("should render pagination bar", () => {
    const { queryByText } = render(
      <Provider store={mockStore}>
        <Router>
          <Posts />
        </Router>
      </Provider>
    );
    const paginationBar = queryByText("pagination-bar")
    expect(paginationBar).toBeInTheDocument();
  });
});

describe("loading page", () => {
  beforeAll(() => {
    mockSlice = createSlice({
      name: "posts",
      initialState: {
        posts: [],
        postsCount: 1,
        currentPost: { post: null, isUpdated: false },
        getAllPostsStatus: "pending",
        getAllPostsError: "",
      },
      reducers: {},
    });
    
    mockStore = configureStore({
      reducer: {
        postsStore: mockSlice.reducer,
      }
    });
  });

  test("should render loading page if getAllPostsStatus is pending and posts array is empty", () => {
    const { queryByText } = render(
      <Provider store={mockStore}>
        <Router>
          <Posts />
        </Router>
      </Provider>
    );
    const loading = queryByText("Loading...");
    expect(loading).toBeInTheDocument();
  });

  test("should not render search box", () => {
    const { queryByPlaceholderText } = render(
      <Provider store={mockStore}>
        <Router>
          <Posts />
        </Router>
      </Provider>
    );
    const searchInput = queryByPlaceholderText("search...")
    expect(searchInput).not.toBeInTheDocument();
  });

  test("should not render post preview", () => {
    const { queryByText } = render(
      <Provider store={mockStore}>
        <Router>
          <Posts />
        </Router>
      </Provider>
    );
    const postPreview = queryByText("post-preview")
    expect(postPreview).not.toBeInTheDocument();
  });

  test("should not render pagination bar", () => {
    const { queryByText } = render(
      <Provider store={mockStore}>
        <Router>
          <Posts />
        </Router>
      </Provider>
    );
    const paginationBar = queryByText("pagination-bar")
    expect(paginationBar).not.toBeInTheDocument();
  });
});