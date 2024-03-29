import { cleanup, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import AddPost from "../../components/post/addPost";
import store from "../../components/store/store";

afterEach(() => cleanup);

jest.mock("../../components/imageFileInput", () => () => {
  return <div>image-input-test</div>;
});

describe("AddPost", () => {
  test("should render AddPost component", () => {
    const { baseElement } = render(
      <Provider store={store}>
        <Router>
          <AddPost />
        </Router>
      </Provider>
    );
    
    expect(baseElement).toBeInTheDocument();
  });
});

describe("input fields", () => {
  test("should render image input field", () => {
    const { queryByText } = render(
      <Provider store={store}>
        <Router>
          <AddPost />
        </Router>
      </Provider>
    );
    const fileInput = queryByText("image-input-test");
    expect(fileInput).toBeInTheDocument();
  });

  test("should render title input field", () => {
    const { queryByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <AddPost />
        </Router>
      </Provider>
    );
    const titleInput = queryByPlaceholderText("Add title here...");
    expect(titleInput!).toBeInTheDocument();
  });

  test("should render content input field", () => {
    const { queryByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <AddPost />
        </Router>
      </Provider>
    );
    const contentInput = queryByPlaceholderText("Add content here...");
    expect(contentInput!).toBeInTheDocument();
  });

  test("should update title field on change", () => {
    const { queryByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <AddPost />
        </Router>
      </Provider>
    );
    const titleInput = queryByPlaceholderText("Add title here...");
    fireEvent.change(titleInput!, { target: { value: "test title" } });
    expect((titleInput! as HTMLInputElement).value).toEqual("test title");
  });

  test("should update content field on change", () => {
    const { queryByPlaceholderText } = render(
    <Provider store={store}>
      <Router>
        <AddPost />
      </Router>
    </Provider>
    );
    const contentInput = queryByPlaceholderText("Add content here...");
    fireEvent.change(contentInput!, { target: { value: "test content" } });
    expect((contentInput! as HTMLInputElement).value).toEqual("test content");
  });
});

describe("buttons", () => {
  test("should render save button", () => {
    const { queryByText } = render(
      <Provider store={store}>
        <Router>
          <AddPost />
        </Router>
      </Provider>
    );
    const saveButton = queryByText("Save");
    expect(saveButton).toBeInTheDocument();
  });

  test("should render cancel button", () => {
    const { queryByText } = render(
      <Provider store={store}>
        <Router>
          <AddPost />
        </Router>
      </Provider>
    );
    const cancelButton = queryByText("Cancel");
    expect(cancelButton).toBeInTheDocument();
  });

  test("Save button should be disabled if no title and content are provided", () => {
    const { queryByText } = render(
      <Provider store={store}>
        <Router>
          <AddPost />
        </Router>
      </Provider>
    );
    const saveBtn = queryByText("Save");
    userEvent.click(saveBtn!);
    let modal = queryByText("modal-test");
    expect(modal).not.toBeInTheDocument();
  });

  test("should render modal only after clicking Save", () => {
    const { queryByText, queryByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <AddPost />
        </Router>
      </Provider>
    );
    const saveBtn = queryByText("Save");
    const titleInput = queryByPlaceholderText("Add title here...");
    fireEvent.change(titleInput!, { target: { value: "test title" } });
    const contentInput = queryByPlaceholderText("Add content here...");
    fireEvent.change(contentInput!, { target: { value: "test content" } });
    userEvent.click(saveBtn!);
    const modal = queryByText("Do you want to save the changes?");
    expect(modal).toBeInTheDocument();
  });
});
