import usersReducer, {
  getAllUsers,
  getFilteredUsers,
  addUser,
  updateUser,
  deleteUser,
  setCurrentPage,
  setCurrentSearchText,
} from "../../components/store/userSlice";
import User from "../../models/user";

const user1 = new User(
  1,
  "Denis",
  "denis@mail.com",
  "password",
  true,
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

jest.mock("../../components/store/store");

describe("Testing getAllUsers", () => {
  const initialState = {
    users: [] as User[],
    usersCount: 0,
    usersPage: 1,
    usersSearchText: "",
    getAllUsersStatus: "",
    getAllUsersError: "",
    getUserStatus: "",
    getUserError: "",
    addUserStatus: "",
    addUserError: "",
    updateUserStatus: "",
    updateUserError: "",
    deleteUserStatus: "",
    deleteUserError: "",
  };

  test("should handle slice getAllUsers fulfilled", async () => {
    const action = getAllUsers.fulfilled(
      {
        data: { users: [user1, user2], count: 2 },
      },
      "fulfilled",
      { page: 1 }
    );
    const actual = usersReducer(initialState, action);
    expect(actual.getAllUsersStatus).toEqual("success");
    expect(actual.users).toEqual([user1, user2]);
    expect(actual.usersCount).toEqual(2);
  });

  test("should handle slice getAllUsers pending", async () => {
    const action = getAllUsers.pending;
    const actual = usersReducer(initialState, action);
    expect(actual.getAllUsersStatus).toEqual("pending");
  });

  test("should handle slice getPosts rejected Unauthorized", async () => {
    const error = new Error("Unexpected server error");
    const action = getAllUsers.rejected(
      error,
      "rejected",
      { page: 1 },
      { status: "rejected" }
    );
    const actual = usersReducer(initialState, action);
    expect(actual.getAllUsersStatus).toEqual("rejected");
    expect(actual.getAllUsersError).toEqual("Unexpected server error");
  });
});

describe("Testing getFilteredUsers", () => {
  const initialState = {
    users: [] as User[],
    usersCount: 0,
    usersPage: 1,
    usersSearchText: "",
    getAllUsersStatus: "",
    getAllUsersError: "",
    getUserStatus: "",
    getUserError: "",
    addUserStatus: "",
    addUserError: "",
    updateUserStatus: "",
    updateUserError: "",
    deleteUserStatus: "",
    deleteUserError: "",
  };

  test("should handle slice getFilteredUsers with no filter fulfilled", async () => {
    const action = getFilteredUsers.fulfilled(
      {
        data: { users: [user1, user2], count: 2 },
      },
      "fulfilled",
      { page: 1, emailFilter: "", search: "" }
    );
    const actual = usersReducer(initialState, action);
    expect(actual.getAllUsersStatus).toEqual("success");
    expect(actual.users).toEqual([user1, user2]);
    expect(actual.usersCount).toEqual(2);
  });

  test("should handle slice getFilteredUsers with email fulfilled", async () => {
    const action = getFilteredUsers.fulfilled(
      {
        data: { users: [user1], count: 1 },
      },
      "fulfilled",
      { page: 1, emailFilter: "denis@mail.com", search: "" }
    );
    const actual = usersReducer(initialState, action);
    expect(actual.getAllUsersStatus).toEqual("success");
    expect(actual.users).toEqual([user1]);
    expect(actual.usersCount).toEqual(1);
  });

  test("should handle slice getFilteredUsers with search fulfilled", async () => {
    const action = getFilteredUsers.fulfilled(
      {
        data: { users: [user2], count: 1 },
      },
      "fulfilled",
      { page: 1, emailFilter: "", search: "andrei" }
    );
    const actual = usersReducer(initialState, action);
    expect(actual.getAllUsersStatus).toEqual("success");
    expect(actual.users).toEqual([user2]);
    expect(actual.usersCount).toEqual(1);
  });
});

describe("Testing deleteUser", () => {
  const initialState = {
    users: [user1, user2],
    usersCount: 2,
    usersPage: 1,
    usersSearchText: "",
    getAllUsersStatus: "",
    getAllUsersError: "",
    getUserStatus: "",
    getUserError: "",
    addUserStatus: "",
    addUserError: "",
    updateUserStatus: "",
    updateUserError: "",
    deleteUserStatus: "",
    deleteUserError: "",
  };

  test("should handle slice deleteUser fulfilled", async () => {
    const action = deleteUser.fulfilled(
      {
        data: user2,
      },
      "fulfilled",
      { id: 2, deletePosts: false, deleteComments: false }
    );
    const actual = usersReducer(initialState, action);
    expect(actual.deleteUserStatus).toEqual("success");
    expect(actual.users).toEqual([user1, user2]);
    expect(actual.usersCount).toEqual(2);
  });
});

describe("Testing addUser", () => {
  const initialState = {
    users: [user1, user2],
    usersCount: 2,
    usersPage: 1,
    usersSearchText: "",
    getAllUsersStatus: "",
    getAllUsersError: "",
    getUserStatus: "",
    getUserError: "",
    addUserStatus: "",
    addUserError: "",
    updateUserStatus: "",
    updateUserError: "",
    deleteUserStatus: "",
    deleteUserError: "",
  };

  test("should handle slice addUser fulfilled", async () => {
    const user3 = new User(
      3,
      "Adrian",
      "adrian@mail.com",
      "password",
      true,
      new Date(),
      new Date()
    );

    const action = addUser.fulfilled(
      {
        data: user3,
      },
      "fulfilled",
      {
        user: {
          name: "Adrian",
          email: "adrian@mail.com",
          password: "password",
          isAdmin: true,
        },
        file: "",
      }
    );
    const actual = usersReducer(initialState, action);
    expect(actual.addUserStatus).toEqual("success");
    expect(actual.users).toEqual([user1, user2, user3]);
  });

  test("should handle slice updateUser fulfilled", async () => {
    const updatedUser = user2;
    updatedUser.name = "Mihai";

    const action = updateUser.fulfilled(
      {
        data: user2,
      },
      "fulfilled",
      {
        user: updatedUser,
        file: "",
      }
    );
    const actual = usersReducer(initialState, action);
    expect(actual.updateUserStatus).toEqual("success");
    expect(actual.users).toEqual([user1, user2]);
    expect(actual.usersCount).toEqual(2);
    expect(actual.users[1].name).toEqual("Mihai");
  });
});

describe("Testing setCurrentPage and setCurrentSearchText reducers", () => {
  const initialState = {
    users: [user1, user2],
    usersCount: 2,
    usersPage: 1,
    usersSearchText: "",
    getAllUsersStatus: "",
    getAllUsersError: "",
    getUserStatus: "",
    getUserError: "",
    addUserStatus: "",
    addUserError: "",
    updateUserStatus: "",
    updateUserError: "",
    deleteUserStatus: "",
    deleteUserError: "",
  };

  test("should return the new page value", () => {
    const actual = usersReducer(initialState, setCurrentPage(2));
    expect(actual.usersPage).toEqual(2);
  });

  test("should return the new search text value", () => {
    const actual = usersReducer(initialState, setCurrentSearchText("an"));
    expect(actual.usersSearchText).toEqual("an");
  });
});
