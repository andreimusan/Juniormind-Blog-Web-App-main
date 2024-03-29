import { waitForElementToBeRemoved } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import * as react from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "../../components/store/store";
import CommentForm from "../../components/comments/commentForm";

let container: HTMLDivElement;
beforeEach(() => {
  jest.spyOn(react, "useSelector").mockReturnValueOnce({ isLoggedIn: true });
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  jest.restoreAllMocks();
  unmountComponentAtNode(container);
  container.remove();
});

it("renders form when all non-function props are sent from parent and user is logged in", () => {
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <CommentForm
            submitLabel=""
            hasCancelButton={true}
            parentCommentId={7}
            initialText="alal"
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const textArea = container.querySelector("#textArea");
  const confirmButton = container.querySelector("#confirmButton");
  const cancelButton = container.querySelector("#cancelButton");
  expect(textArea).toBeInTheDocument();
  expect(confirmButton).toBeInTheDocument();
  expect(confirmButton?.innerHTML).toBe(" ");
  expect(cancelButton).toBeInTheDocument();
  expect(cancelButton?.innerHTML).toBe("Cancel");
});

it("renders form button with given label sent through props", () => {
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <CommentForm submitLabel="Add comment" />
        </Router>
      </react.Provider>,
      container
    );
  });
  const confirmButton = container.querySelector("#confirmButton");
  expect(confirmButton).toBeInTheDocument();
  expect(confirmButton?.innerHTML).toBe("Add comment ");
});

it("renders form without cancel button when props sets that property to false", () => {
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <CommentForm
            submitLabel=""
            hasCancelButton={false}
            parentCommentId={7}
            initialText="alal"
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const cancelButton = container.querySelector("#cancelButton");
  expect(cancelButton).not.toBeInTheDocument();
  const textArea = container.querySelector("#textArea");
  const confirmButton = container.querySelector("#confirmButton");
  expect(textArea).toBeInTheDocument();
  expect(confirmButton).toBeInTheDocument();
});

it("renders form with disabled confirm button if no initial text is provided", () => {
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <CommentForm submitLabel="Hey" parentCommentId={7} />
        </Router>
      </react.Provider>,
      container
    );
  });
  const confirmButton = container.querySelector("#confirmButton");
  expect(confirmButton).toBeInTheDocument();
  expect(confirmButton).toHaveAttribute("disabled");
});

it("renders form with clickable confirm button if initial text is provided", () => {
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <CommentForm
            submitLabel="Hey"
            parentCommentId={7}
            initialText="sdfsdf"
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const confirmButton = container.querySelector("#confirmButton");
  expect(confirmButton).toBeInTheDocument();
  expect(confirmButton).not.toHaveAttribute("disabled");
});

it("renders form with only redirect to login button when user is not logged in and cancel button is set to false", () => {
  jest.restoreAllMocks();
  jest.spyOn(react, "useSelector").mockReturnValueOnce({ isLoggedIn: false });
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <CommentForm
            submitLabel=""
            hasCancelButton={false}
            parentCommentId={7}
            initialText="alal"
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const textArea = container.querySelector("#textArea");
  const confirmButton = container.querySelector("#confirmButton");
  const cancelButton = container.querySelector("#cancelButton");
  const redirectToLoginButton = container.querySelector(
    "#redirectToLoginButton"
  );
  expect(textArea).not.toBeInTheDocument();
  expect(confirmButton).not.toBeInTheDocument();
  expect(cancelButton).not.toBeInTheDocument();
  expect(redirectToLoginButton).toBeInTheDocument();
  expect(redirectToLoginButton?.innerHTML).toBe("Log in to add comments");
});

it("renders form with clickable confirm button and loading animation when request is in progress after button click", () => {
  jest.restoreAllMocks();
  jest
    .spyOn(react, "useSelector")
    .mockReturnValue({ isLoggedIn: true, addCommentStatus: "pending" });
  const requestInProgress = jest.fn(async () => {
    return undefined;
  });
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <CommentForm
            submitLabel="Hey"
            parentCommentId={7}
            initialText="sdfsdf"
            handleSubmit={requestInProgress}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const confirmButton = container.querySelector("#confirmButton");
  expect(confirmButton).toBeInTheDocument();
  act(() => {
    confirmButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  expect(requestInProgress).toHaveBeenCalledTimes(1);
  const spinner = container.querySelector("#spinner");
  expect(spinner).toBeInTheDocument();
});

it("renders form with clickable confirm button and without loading animation when request failed after button click", async () => {
  jest.restoreAllMocks();
  jest
    .spyOn(react, "useSelector")
    .mockReturnValue({ isLoggedIn: true, addCommentStatus: "pending" });
  const requestFailed = jest.fn(async () => {
    return true;
  });
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <CommentForm
            submitLabel="Hey"
            parentCommentId={7}
            initialText="sdfsdf"
            handleSubmit={requestFailed}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const confirmButton = container.querySelector("#confirmButton");
  expect(confirmButton).toBeInTheDocument();
  act(() => {
    confirmButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  const spinner = container.querySelector("#spinner");
  await waitForElementToBeRemoved(spinner);
  expect(requestFailed).toHaveBeenCalledTimes(1);
  expect(spinner).not.toBeInTheDocument();
});

it("renders form with clickable confirm button and without loading animation when request succeded after button click", async () => {
  jest.restoreAllMocks();
  jest
    .spyOn(react, "useSelector")
    .mockReturnValue({ isLoggedIn: true, addCommentStatus: "fulfilled" });
  const requestFulfilled = jest.fn(async () => {
    return false;
  });
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <CommentForm
            submitLabel="Hey"
            parentCommentId={7}
            initialText="sdfsdf"
            handleSubmit={requestFulfilled}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const confirmButton = container.querySelector("#confirmButton");
  expect(confirmButton).toBeInTheDocument();
  act(() => {
    confirmButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  const spinner = container.querySelector("#spinner");
  expect(requestFulfilled).toHaveBeenCalledTimes(1);
  expect(spinner).not.toBeInTheDocument();
});

it("renders form with empty text area after button click if parentComment id is 0 (add new primary comment case)", async () => {
  jest.restoreAllMocks();
  jest
    .spyOn(react, "useSelector")
    .mockReturnValue({ isLoggedIn: true, addCommentStatus: "pending" });
  const requestFulfilled = jest.fn(async () => {
    return false;
  });
  act(() => {
    render(
      <react.Provider store={store}>
        <Router>
          <CommentForm
            submitLabel="Hey"
            parentCommentId={0}
            initialText="sdfsdf"
            handleSubmit={requestFulfilled}
          />
        </Router>
      </react.Provider>,
      container
    );
  });
  const confirmButton = container.querySelector("#confirmButton");
  const textArea = container.querySelector("#textArea");
  expect(textArea?.innerHTML).toBe("sdfsdf");
  act(() => {
    confirmButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  const spinner = container.querySelector("#spinner");
  await waitForElementToBeRemoved(spinner);
  expect(requestFulfilled).toHaveBeenCalledTimes(1);
  expect(spinner).not.toBeInTheDocument();
  expect(textArea?.innerHTML).toBe("");
});
