import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../../models/user";
import authorizedRequest from "../../authorizedRequest";
import { uploadImage as imageUpload } from "../store/imageSlice";

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

export const getAllUsers = createAsyncThunk(
  "users/getAllUser",
  async (
    params: {
      page: number;
    },
    { rejectWithValue }
  ) => {
    const limit = 5;
    const response = await authorizedRequest()
      .get<User, any>(`users?page=${params.page}&limit=${limit}`)
      .catch((error) => {
        return error.response;
      });

    if (response === undefined) {
      return rejectWithValue({
        status: 500,
        data: { message: "Unexpected server error!" },
      });
    }
    return response.status === 200 ? response.data : rejectWithValue(response);
  }
);

export const getFilteredUsers = createAsyncThunk(
  "users/getFilteredUsers",
  async (
    params: {
      page: number;
      emailFilter: string;
      search: string;
    },
    { rejectWithValue }
  ) => {
    const limit = 5;
    const response = await authorizedRequest()
      .get<User, any>(
        `users?page=${params.page}&limit=${limit}&email=${params.emailFilter}&search=${params.search}`
      )
      .catch((error) => {
        return error.response;
      });

    if (response === undefined) {
      return rejectWithValue({
        status: 500,
        data: { message: "Unexpected server error!" },
      });
    }

    return response.status === 200 ? response.data : rejectWithValue(response);
  }
);

export const getUser = createAsyncThunk(
  "users/getUser",
  async (id: number, { rejectWithValue }) => {
    const response = await authorizedRequest()
      .get<User, any>(`users/${id}`)
      .catch((error) => {
        return error.response;
      });

    if (response === undefined) {
      return rejectWithValue({
        status: 500,
        data: { message: "Unexpected server error!" },
      });
    }

    return response.status === 200 ? response.data : rejectWithValue(response);
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (
    params: {
      user: { name: string; email: string; password: string; isAdmin: boolean };
      file: any;
    },
    thunkAPI
  ) => {
    const { name, email, password, isAdmin } = params.user;
    const user = {
      name,
      email,
      password,
      isAdmin,
      image: "",
    };

    if (params.file !== undefined) {
      const formData = new FormData();
      formData.append("file", params.file);
      const imagePath = await thunkAPI.dispatch(imageUpload(formData));
      if (imagePath.meta.requestStatus === "fulfilled")
        user.image = imagePath.payload.data;
    }

    const response = await authorizedRequest()
      .post<User, any>("users", user)
      .catch((error) => {
        return error.response;
      });

    if (response === undefined) {
      return thunkAPI.rejectWithValue({
        status: 500,
        data: { message: "Unexpected server error!" },
      });
    }

    return response.status === 201
      ? response.data
      : thunkAPI.rejectWithValue(response);
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (params: { user: User; file: any }, thunkAPI) => {
    const { id, name, email, password, active, isAdmin } = params.user;
    let { image } = params.user;

    if (params.file !== undefined) {
      const formData = new FormData();
      formData.append("file", params.file);
      const imagePath = await thunkAPI.dispatch(imageUpload(formData));
      if (imagePath.meta.requestStatus === "fulfilled")
        image = imagePath.payload.data;
    }

    const response = await authorizedRequest()
      .put<User, any>(`users/${id}`, {
        name,
        email,
        password,
        active,
        isAdmin,
        image,
      })
      .catch((error) => {
        return error.response;
      });

    if (response === undefined) {
      return thunkAPI.rejectWithValue({
        status: 500,
        data: { message: "Unexpected server error!" },
      });
    }

    return response.status === 200
      ? response.data
      : thunkAPI.rejectWithValue(response);
  }
);

type DeactivationInfo = {
  id: number;
  deletePosts: boolean;
  deleteComments: boolean;
};

export const deleteUser = createAsyncThunk(
  "users/deleteuser",
  async (deactivationInfo: DeactivationInfo, { rejectWithValue }) => {
    const { id, deletePosts, deleteComments } = deactivationInfo;
    const dp = deletePosts === true ? "yes" : "no";
    const dc = deleteComments === true ? "yes" : "no";
    const response = await authorizedRequest()
      .delete<User, any>(`users/${id}?deletePosts=${dp}&deleteComments=${dc}`)
      .catch((error) => {
        return error.response;
      });

    if (response === undefined) {
      return rejectWithValue({
        status: 500,
        data: { message: "Unexpected server error!" },
      });
    }

    return response.status === 200 ? response.data : rejectWithValue(response);
  }
);

const setErrorMessage = (status: number) => {
  switch (status) {
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not found";
    default:
      return "Unexpected server error";
  }
};

export const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.usersPage = action.payload;
    },
    setCurrentSearchText: (state, action) => {
      state.usersSearchText = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllUsers.pending, (state) => {
      state.getAllUsersStatus = "pending";
    });

    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.users = action.payload.data.users;
      state.usersCount = action.payload.data.count;
      state.getAllUsersStatus = "success";
    });

    builder.addCase(
      getAllUsers.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.getAllUsersStatus = "rejected";
        state.getAllUsersError = setErrorMessage(action.payload.status);
      }
    );

    builder.addCase(getFilteredUsers.pending, (state) => {
      state.getAllUsersStatus = "pending";
    });

    builder.addCase(getFilteredUsers.fulfilled, (state, action) => {
      state.users = action.payload.data.users;
      state.usersCount = action.payload.data.count;
      state.getAllUsersStatus = "success";
    });

    builder.addCase(
      getFilteredUsers.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.getAllUsersStatus = "rejected";
        state.getAllUsersError = setErrorMessage(action.payload.status);
      }
    );

    builder.addCase(getUser.pending, (state) => {
      state.getUserStatus = "pending";
    });

    builder.addCase(getUser.fulfilled, (state) => {
      state.getUserStatus = "success";
    });

    builder.addCase(
      getUser.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.getUserStatus = "rejected";
        state.getUserError = setErrorMessage(action.payload.status);
      }
    );

    builder.addCase(addUser.pending, (state) => {
      state.addUserStatus = "pending";
    });

    builder.addCase(addUser.fulfilled, (state, action) => {
      state.users.push(action.payload.data);
      state.usersPage = 1;
      state.addUserStatus = "success";
    });

    builder.addCase(
      addUser.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.addUserStatus = "rejected";
        state.addUserError = setErrorMessage(action.payload.status);
      }
    );

    builder.addCase(updateUser.pending, (state, action) => {
      state.updateUserStatus = "pending";
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      const updatedUsers = state.users.map((user) =>
        user.id === action.payload.data.id ? action.payload.data : user
      );
      state.users = updatedUsers;
      state.updateUserStatus = "success";
    });

    builder.addCase(
      updateUser.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.updateUserStatus = "rejected";
        state.updateUserError = setErrorMessage(action.payload.status);
      }
    );

    builder.addCase(deleteUser.pending, (state) => {
      state.deleteUserStatus = "pending";
    });

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      const updatedUsers = state.users.map((user) =>
        user.id === action.payload.data.id ? action.payload.data : user
      );
      state.users = updatedUsers;
      state.deleteUserStatus = "success";
    });

    builder.addCase(
      deleteUser.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.deleteUserStatus = "rejected";
        state.deleteUserError = setErrorMessage(action.payload.status);
      }
    );
  },
});

export const selectUsers = (state: any) => state.usersState;
export const { setCurrentPage, setCurrentSearchText } = usersSlice.actions;
export default usersSlice.reducer;
