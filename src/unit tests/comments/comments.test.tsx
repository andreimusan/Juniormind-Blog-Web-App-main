import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import * as react from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "../../components/store/store";
import Comments from "../../components/comments/comments";
import Comment from "../../models/comment";
let container: HTMLDivElement;

const comment1 = new Comment(
  1,
  6,
  "this is comment #1",
  1,
  new Date(),
  new Date()
);
const comment2 = new Comment(
  2,
  6,
  "this is comment #2",
  1,
  new Date(),
  new Date()
);
const comment3 = new Comment(
  3,
  6,
  "this is comment #3",
  1,
  new Date(),
  new Date()
);
const comment4 = new Comment(
  4,
  6,
  "this is comment #4",
  1,
  new Date(),
  new Date()
);

const comment5 = new Comment(
  5,
  6,
  "this is comment #5",
  1,
  new Date(),
  new Date()
);

beforeEach(() => {
  jest.spyOn(react, "useSelector").mockReturnValue({
    commentsArray: [],
    primaryCommentsCount: 0,
    getCommentsStatus: "",
  });
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  jest.restoreAllMocks();
  unmountComponentAtNode(container);
  container.remove();
});

it("renders comments component with no comments yet message when post has no comments", () => {
  const setCommentsCount = jest.fn();
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <Comments
            postID={6}
            commentsCount={0}
            setCommentsCount={setCommentsCount}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const noCommentsYetMessage = container.querySelector("#noCommentsYetMessage");
  expect(noCommentsYetMessage).toBeInTheDocument();
  expect(noCommentsYetMessage?.innerHTML).toBe(
    "Post does not have any comments yet"
  );
  const showCommentsButton = container.querySelector("#showCommentsButton");
  expect(showCommentsButton).not.toBeInTheDocument();
  const errorModal = container.querySelector("#errorModal");
  expect(errorModal).toBeInTheDocument();
  const commentForm = container.querySelector("#commentForm");
  expect(commentForm).toBeInTheDocument();
  const searchBar = container.querySelector("#searchBar");
  expect(searchBar).toBeInTheDocument();
  const showMoreCommentsButton = container.querySelector(
    "#showMoreCommentsButton"
  );
  expect(showMoreCommentsButton).not.toBeInTheDocument();
});

it("renders comments component with show comments button when post has comments", () => {
  const setCommentsCount = jest.fn();
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <Comments
            postID={6}
            commentsCount={6}
            setCommentsCount={setCommentsCount}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const noCommentsYetMessage = container.querySelector("#noCommentsYetMessage");
  expect(noCommentsYetMessage).not.toBeInTheDocument();
  const showCommentsButton = container.querySelector("#showCommentsButton");
  expect(showCommentsButton).toBeInTheDocument();
  expect(showCommentsButton?.innerHTML).toBe("<span>Show comments (6)</span> ");
  const errorModal = container.querySelector("#errorModal");
  expect(errorModal).toBeInTheDocument();
  const commentForm = container.querySelector("#commentForm");
  expect(commentForm).toBeInTheDocument();
  const searchBar = container.querySelector("#searchBar");
  expect(searchBar).toBeInTheDocument();
  const showMoreCommentsButton = container.querySelector(
    "#showMoreCommentsButton"
  );
  expect(showMoreCommentsButton).not.toBeInTheDocument();
});

it("renders comments component with loading comments button when the button is pressed and response is pending", () => {
  const setCommentsCount = jest.fn();
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <Comments
            postID={6}
            commentsCount={6}
            setCommentsCount={setCommentsCount}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const showCommentsButton = container.querySelector("#showCommentsButton");
  expect(showCommentsButton).toBeInTheDocument();
  expect(showCommentsButton?.innerHTML).toBe("<span>Show comments (6)</span> ");

  act(() => {
    jest.restoreAllMocks();
    jest.spyOn(react, "useSelector").mockReturnValue({
      commentsArray: [],
      primaryCommentsCount: 0,
      getCommentsStatus: "pending",
    });
    showCommentsButton?.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
  });
  expect(showCommentsButton?.innerHTML).toContain("Loading comments");
  const noCommentsYetMessage = container.querySelector("#noCommentsYetMessage");
  expect(noCommentsYetMessage).not.toBeInTheDocument();

  const errorModal = container.querySelector("#errorModal");
  expect(errorModal).toBeInTheDocument();
  const commentForm = container.querySelector("#commentForm");
  expect(commentForm).toBeInTheDocument();
  const searchBar = container.querySelector("#searchBar");
  expect(searchBar).toBeInTheDocument();
});

it("renders comments component with hide comments button and comments when the button is pressed and response is fulfilled", () => {
  const setCommentsCount = jest.fn();
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <Comments
            postID={6}
            commentsCount={6}
            setCommentsCount={setCommentsCount}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const showCommentsButton = container.querySelector("#showCommentsButton");
  expect(showCommentsButton).toBeInTheDocument();
  expect(showCommentsButton?.innerHTML).toBe("<span>Show comments (6)</span> ");

  act(() => {
    jest.restoreAllMocks();
    jest.spyOn(react, "useSelector").mockReturnValue({
      commentsArray: [],
      primaryCommentsCount: 0,
      getCommentsStatus: "fulfilled",
    });
    showCommentsButton?.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
  });
  expect(showCommentsButton?.innerHTML).toBe(" <span>Hide comments (6)</span>");
  const noCommentsYetMessage = container.querySelector("#noCommentsYetMessage");
  expect(noCommentsYetMessage).not.toBeInTheDocument();

  const errorModal = container.querySelector("#errorModal");
  expect(errorModal).toBeInTheDocument();
  const commentForm = container.querySelector("#commentForm");
  expect(commentForm).toBeInTheDocument();
  const searchBar = container.querySelector("#searchBar");
  expect(searchBar).toBeInTheDocument();
});

it("renders comments component and first 5 comments (default) when the button is pressed, response is fulfilled and comments array is not empty", () => {
  const setCommentsCount = jest.fn();
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <Comments
            postID={6}
            commentsCount={6}
            setCommentsCount={setCommentsCount}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const showCommentsButton = container.querySelector("#showCommentsButton");
  expect(showCommentsButton).toBeInTheDocument();
  expect(showCommentsButton?.innerHTML).toBe("<span>Show comments (6)</span> ");

  act(() => {
    jest.restoreAllMocks();
    jest.spyOn(react, "useSelector").mockReturnValue({
      commentsArray: [comment1, comment2, comment3, comment4, comment5],
      primaryCommentsCount: 6,
      getCommentsStatus: "fulfilled",
    });
    showCommentsButton?.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
  });
  expect(showCommentsButton?.innerHTML).toBe(" <span>Hide comments (6)</span>");
  const noCommentsYetMessage = container.querySelector("#noCommentsYetMessage");
  expect(noCommentsYetMessage).not.toBeInTheDocument();

  const comment1Rendered = container.querySelector("#comment1");
  expect(comment1Rendered).toBeInTheDocument();
  const comment2Rendered = container.querySelector("#comment2");
  expect(comment2Rendered).toBeInTheDocument();
  const comment3Rendered = container.querySelector("#comment3");
  expect(comment3Rendered).toBeInTheDocument();
  const comment4Rendered = container.querySelector("#comment4");
  expect(comment4Rendered).toBeInTheDocument();
  const comment5Rendered = container.querySelector("#comment5");
  expect(comment5Rendered).toBeInTheDocument();
  const comment6Rendered = container.querySelector("#comment6");
  expect(comment6Rendered).not.toBeInTheDocument();

  const errorModal = container.querySelector("#errorModal");
  expect(errorModal).toBeInTheDocument();
  const commentForm = container.querySelector("#commentForm");
  expect(commentForm).toBeInTheDocument();
  const searchBar = container.querySelector("#searchBar");
  expect(searchBar).toBeInTheDocument();
});

it("renders comments component hides comments when hide comments button is pressed", () => {
  const setCommentsCount = jest.fn();
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <Comments
            postID={6}
            commentsCount={6}
            setCommentsCount={setCommentsCount}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const showCommentsButton = container.querySelector("#showCommentsButton");
  expect(showCommentsButton).toBeInTheDocument();
  expect(showCommentsButton?.innerHTML).toBe("<span>Show comments (6)</span> ");

  act(() => {
    jest.restoreAllMocks();
    jest.spyOn(react, "useSelector").mockReturnValue({
      commentsArray: [comment1, comment2, comment3, comment4, comment5],
      primaryCommentsCount: 6,
      getCommentsStatus: "fulfilled",
    });
    showCommentsButton?.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
  });

  act(() => {
    showCommentsButton?.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
  });
  expect(showCommentsButton?.innerHTML).toBe("<span>Show comments (6)</span> ");
  const noCommentsYetMessage = container.querySelector("#noCommentsYetMessage");
  expect(noCommentsYetMessage).not.toBeInTheDocument();

  const comment1Rendered = container.querySelector("#comment1");
  expect(comment1Rendered).not.toBeInTheDocument();
  const comment2Rendered = container.querySelector("#comment2");
  expect(comment2Rendered).not.toBeInTheDocument();
  const comment3Rendered = container.querySelector("#comment3");
  expect(comment3Rendered).not.toBeInTheDocument();
  const comment4Rendered = container.querySelector("#comment4");
  expect(comment4Rendered).not.toBeInTheDocument();
  const comment5Rendered = container.querySelector("#comment5");
  expect(comment5Rendered).not.toBeInTheDocument();
  const comment6Rendered = container.querySelector("#comment6");
  expect(comment6Rendered).not.toBeInTheDocument();

  const errorModal = container.querySelector("#errorModal");
  expect(errorModal).toBeInTheDocument();
  const commentForm = container.querySelector("#commentForm");
  expect(commentForm).toBeInTheDocument();
  const searchBar = container.querySelector("#searchBar");
  expect(searchBar).toBeInTheDocument();
});

it("renders comments component with comments and show more comments button when number of shown comments is less than the total amount of primary comments the post has", () => {
  const setCommentsCount = jest.fn();
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <Comments
            postID={6}
            commentsCount={6}
            setCommentsCount={setCommentsCount}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const showCommentsButton = container.querySelector("#showCommentsButton");
  expect(showCommentsButton).toBeInTheDocument();
  expect(showCommentsButton?.innerHTML).toBe("<span>Show comments (6)</span> ");

  act(() => {
    jest.restoreAllMocks();
    jest.spyOn(react, "useSelector").mockReturnValue({
      commentsArray: [comment1, comment2, comment3, comment4, comment5],
      primaryCommentsCount: 6,
      getCommentsStatus: "fulfilled",
    });
    showCommentsButton?.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
  });
  expect(showCommentsButton?.innerHTML).toBe(" <span>Hide comments (6)</span>");
  const showMoreCommentsButton = container.querySelector(
    "#showMoreCommentsButton"
  );
  expect(showMoreCommentsButton).toBeInTheDocument();
});

it("renders comments component with comments and without show more comments button when number of shown comments is equal to the total amount of primary comments the post has", () => {
  const setCommentsCount = jest.fn();
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <Comments
            postID={6}
            commentsCount={6}
            setCommentsCount={setCommentsCount}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const showCommentsButton = container.querySelector("#showCommentsButton");
  expect(showCommentsButton).toBeInTheDocument();
  expect(showCommentsButton?.innerHTML).toBe("<span>Show comments (6)</span> ");

  act(() => {
    jest.restoreAllMocks();
    jest.spyOn(react, "useSelector").mockReturnValue({
      commentsArray: [comment1, comment2, comment3, comment4, comment5],
      primaryCommentsCount: 5,
      getCommentsStatus: "fulfilled",
    });
    showCommentsButton?.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
  });
  expect(showCommentsButton?.innerHTML).toBe(" <span>Hide comments (6)</span>");
  const showMoreCommentsButton = container.querySelector(
    "#showMoreCommentsButton"
  );
  expect(showMoreCommentsButton).not.toBeInTheDocument();
});

it("renders comments component with error show comments button when request failed", () => {
  const setCommentsCount = jest.fn();
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <Comments
            postID={6}
            commentsCount={6}
            setCommentsCount={setCommentsCount}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const showCommentsButton = container.querySelector("#showCommentsButton");
  expect(showCommentsButton).toBeInTheDocument();
  expect(showCommentsButton?.innerHTML).toBe("<span>Show comments (6)</span> ");

  act(() => {
    jest.restoreAllMocks();
    jest.spyOn(react, "useSelector").mockReturnValue({
      commentsArray: [],
      primaryCommentsCount: 0,
      getCommentsStatus: "failed",
    });
    showCommentsButton?.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
  });
  expect(showCommentsButton?.innerHTML).toBe(
    ' <h5 class="sc-caiLqq hplUvr">Failed to load comments. Try again.</h5>'
  );
  const showMoreCommentsButton = container.querySelector(
    "#showMoreCommentsButton"
  );
  expect(showMoreCommentsButton).not.toBeInTheDocument();
});
