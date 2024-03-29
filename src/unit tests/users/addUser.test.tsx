import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddUser from "../../pages/userPages/addUser";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "../../components/store/store";

jest.mock("../../components/imageFileInput", () => () => {
  return <div>image-input-test</div>;
});

describe("AddUser", () => {
  test("should render AddUser component", () => {
    const { baseElement } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    expect(baseElement).toBeInTheDocument();
  });
});

describe("Render form fields and button", () => {
  test("should render image input field", () => {
    const { queryByText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );
    const fileInput = queryByText("image-input-test");
    expect(fileInput).toBeInTheDocument();
  });

  test("name input should be rendered", () => {
    const { queryByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const nameInputEl = queryByPlaceholderText(/Name/i);
    expect(nameInputEl).toBeInTheDocument();
  });

  test("email input should be rendered", () => {
    const { queryByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const emailInputEl = queryByPlaceholderText(/Your email/i);
    expect(emailInputEl).toBeInTheDocument();
  });

  test("password input should be rendered", () => {
    const { queryAllByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const passwordInputEl = queryAllByPlaceholderText(/Password/i);
    expect(passwordInputEl[0]).toBeInTheDocument();
    expect(passwordInputEl[1]).toBeInTheDocument();
  });

  test("submit button should be rendered", () => {
    const { queryByRole } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const submitBtn = queryByRole("button", {
      name: /submit/i,
    });
    expect(submitBtn).toBeInTheDocument();
  });
});

describe("change form fields", () => {
  test("name input should change", () => {
    const { queryByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const testValue = "username";
    const nameInputEl = queryByPlaceholderText(/Name/i);
    fireEvent.change(nameInputEl as HTMLInputElement, {
      target: { value: testValue },
    });
    expect((nameInputEl as HTMLInputElement).value).toBe(testValue);
  });

  test("email input should be rendered", () => {
    const { queryByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const testValue = "email@mail.com";
    const emailInputEl = queryByPlaceholderText(/Email/i);
    fireEvent.change(emailInputEl as HTMLInputElement, {
      target: { value: testValue },
    });
    expect((emailInputEl as HTMLInputElement).value).toBe(testValue);
  });

  test("password input should be rendered", () => {
    const { queryAllByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const testValue = "password";
    const passwordInputEl = queryAllByPlaceholderText(/Password/i);
    fireEvent.change(passwordInputEl[0] as HTMLInputElement, {
      target: { value: testValue },
    });
    fireEvent.change(passwordInputEl[1] as HTMLInputElement, {
      target: { value: testValue },
    });
    expect((passwordInputEl[0] as HTMLInputElement).value).toBe(testValue);
    expect((passwordInputEl[1] as HTMLInputElement).value).toBe(testValue);
  });
});

describe("display errors", () => {
  test("errors should be displayed if fields are empty and submit button is clicked", () => {
    const { queryByRole, queryByText, queryAllByText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const submitBtn = queryByRole("button", {
      name: /submit/i,
    });
    userEvent.click(submitBtn!);
    const nameError = queryByText(/name is required/i);
    const emailError = queryByText(/email is required/i);
    const passwordError = queryAllByText(/password is required/i);
    expect(nameError).toBeInTheDocument();
    expect(emailError).toBeInTheDocument();
    expect(passwordError[0]).toBeInTheDocument();
    expect(passwordError[1]).toBeInTheDocument();
  });

  test("email error should be displayed if email field doest not contain @ and submit button is clicked", () => {
    const { queryByPlaceholderText, queryByRole, queryByText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const emailInputEl = queryByPlaceholderText(/Email/i);
    fireEvent.change(emailInputEl as HTMLInputElement, {
      target: { value: "testValue" },
    });
    const submitBtn = queryByRole("button", {
      name: /submit/i,
    });
    userEvent.click(submitBtn!);
    const emailError = queryByText(/email address is invalid/i);
    expect(emailError).toBeInTheDocument();
  });

  test("password error should be displayed if password has less than 6 characters and submit button is clicked", () => {
    const { queryAllByPlaceholderText, queryByRole, queryByText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const passwordInputEl = queryAllByPlaceholderText(/Password/i);
    fireEvent.change(passwordInputEl[0] as HTMLInputElement, {
      target: { value: "1" },
    });
    const submitBtn = queryByRole("button", {
      name: /submit/i,
    });
    userEvent.click(submitBtn!);
    const passwordrror = queryByText(
      /password needs to be 6 characters or more/i
    );
    expect(passwordrror).toBeInTheDocument();
  });

  test("password error should be displayed if repeated password does not match the firs password and submit button is clicked", () => {
    const { queryAllByPlaceholderText, queryByRole, queryByText } = render(
      <Provider store={store}>
        <Router>
          <AddUser />
        </Router>
      </Provider>
    );

    const passwordInputEl = queryAllByPlaceholderText(/Password/i);
    fireEvent.change(passwordInputEl[0] as HTMLInputElement, {
      target: { value: "123456" },
    });
    fireEvent.change(passwordInputEl[1] as HTMLInputElement, {
      target: { value: "1" },
    });
    const submitBtn = queryByRole("button", {
      name: /submit/i,
    });
    userEvent.click(submitBtn!);
    const passwordrror = queryByText(/passwords do not match/i);
    expect(passwordrror).toBeInTheDocument();
  });
});
