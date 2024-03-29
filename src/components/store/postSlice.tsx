import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Axios from "axios";
import authorizedRequest from "../../authorizedRequest";
import Post from "../../models/post";
import { deleteImage, uploadImage } from "./imageSlice";

type CurrentPostType = {
  post: Post;
  isUpdated: boolean;
};

const initialState = {
  posts: [] as Post[],
  postsCount: 0,
  currentPost: {} as CurrentPostType,
  getAllPostsStatus: "",
  getAllPostsError: "",
  getPostStatus: "",
  getPostError: "",
  addPostStatus: "",
  addPostError: "",
  updatePostStatus: "",
  updatePostError: "",
  deletePostStatus: "",
  deletePostError: "",
};

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (params: { search: string, page: number }, { rejectWithValue }) => {
    try {
      const response = await authorizedRequest().get<Post, any>(
        `posts?search=${params.search}&page=${params.page}&limit=6`
      );
      return response.data;
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        if (error.response === undefined)
          return rejectWithValue({
            status: 500,
          });

        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const getPost = createAsyncThunk(
  "posts/getPost",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await authorizedRequest().get<Post, any>(`posts/${id}`);
      return response.data;
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        if (error.response === undefined)
          return rejectWithValue({
            status: 500,
          });

        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (
      params: {
        post: {title: string, content: string, author: number },
        file: any
      },
      thunkAPI
    ) => {
    try {
      let imagePath = "";
      if (params.file !== undefined) {
        const formData = new FormData();
        formData.append("file", params.file);
        imagePath = (await thunkAPI.dispatch(uploadImage(formData))).payload.data;
      }

      const post = {
        title: params.post.title,
        content: params.post.content,
        author: params.post.author,
        image: imagePath
      }
      const response = await authorizedRequest().post<Post, any>("posts", post);
      return response.data;
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        if (error.response === undefined)
          return thunkAPI.rejectWithValue({
            status: 500,
          });

        return thunkAPI.rejectWithValue(error.response.status);
      }
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (params: { post: Post, file: any, deleteImage: boolean }, thunkAPI) => {
    try {
      const { id, title, content } = params.post;
      let response;
      let imagePath;
      if (params.file !== undefined) {
        const formData = new FormData();
        formData.append("file", params.file);
        imagePath = (await thunkAPI.dispatch(uploadImage(formData))).payload.data;
      }

      if (params.deleteImage)
        await thunkAPI.dispatch(deleteImage(params.post.image));

      response = await authorizedRequest().put<Post, any>(
        `posts/${id}`,
        {
          title,
          content,
          image: imagePath,
          deleteImage: params.deleteImage
        }
      );

      return response.data;
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        if (error.response === undefined)
          return thunkAPI.rejectWithValue({
            status: 500,
          });
        
        return thunkAPI.rejectWithValue(error.response.status);
      }
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await authorizedRequest().delete<Post, any>(
        `posts/${id}`
      );
      return response.data;
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        if (error.response === undefined)
          return rejectWithValue({
            status: 500,
          });

        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    viewCurrentPost: (state, action: { payload: CurrentPostType }) => {
      state.currentPost.post = action.payload.post;
      state.currentPost.isUpdated = action.payload.isUpdated;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllPosts.pending, (state, action) => {
      state.getAllPostsStatus = "pending";
    });

    builder.addCase(getAllPosts.fulfilled, (state, action) => {
      state.posts = action.payload.data.posts;
      state.postsCount = action.payload.data.count;
      state.getAllPostsStatus = "success";
    });

    builder.addCase(
      getAllPosts.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.getAllPostsStatus = "rejected";
        state.getAllPostsError = setErrorMessage(action.payload);
      }
    );

    builder.addCase(getPost.pending, (state, action) => {
      state.getPostStatus = "pending";
    });

    builder.addCase(getPost.fulfilled, (state, action) => {
      state.getPostStatus = "success";
    });

    builder.addCase(
      getPost.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.getPostStatus = "rejected";
        state.getPostError = setErrorMessage(action.payload);
      }
    );

    builder.addCase(addPost.pending, (state, action) => {
      state.addPostStatus = "pending";
    });

    builder.addCase(addPost.fulfilled, (state, action) => {
      state.posts.unshift(action.payload.data);
      state.addPostStatus = "success";
    });

    builder.addCase(
      addPost.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.addPostStatus = "rejected";
        state.addPostError = setErrorMessage(action.payload);
      }
    );

    builder.addCase(updatePost.pending, (state, action) => {
      state.updatePostStatus = "pending";
    });

    builder.addCase(
      updatePost.fulfilled,
      (state, action: { payload: { data: Post }}) => {
        const updatedPost = action.payload.data;
        updatedPost.content = updatedPost.content?.substring(0, 150);
        const updatedPosts = state.posts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        );
        state.posts = updatedPosts;
        state.updatePostStatus = "success";
    });

    builder.addCase(
      updatePost.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.updatePostStatus = "rejected";
        state.updatePostError = setErrorMessage(action.payload);
      }
    );

    builder.addCase(deletePost.pending, (state, action) => {
      state.deletePostStatus = "pending";
    });

    builder.addCase(deletePost.fulfilled, (state, action) => {
      const filteredPosts = state.posts.filter(
        (post) => post.id !== action.payload.postId
      );
      state.posts = filteredPosts;

      state.deletePostStatus = "success";
    });

    builder.addCase(
      deletePost.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.deletePostStatus = "rejected";
        state.deletePostError = setErrorMessage(action.payload);
      }
    );
  },
});

const setErrorMessage = (status: number) => {
  switch (status) {
    case 400:
      return "Bad request";
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

export const selectPosts = (state: any) => state.postsStore;

export const { viewCurrentPost } = postsSlice.actions;

export default postsSlice.reducer;
