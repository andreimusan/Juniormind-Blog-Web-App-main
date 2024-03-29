import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Comment from "../../models/comment";
import Axios from "axios";
import authorizedRequest from "../../authorizedRequest";

export const getComments = createAsyncThunk(
  "comments/getComments",
  async (
    criteria: {
      filter: string;
      filterId: number;
      previousPageLastCommentIndex: number;
      limit: number;
      searchText?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const {
        filter,
        filterId,
        previousPageLastCommentIndex,
        limit,
        searchText,
      } = criteria;
      const response = await authorizedRequest().get<Comment, any>(
        `comments?filter=${filter}&id=${filterId}&previousPageLastCommentIndex=${previousPageLastCommentIndex}&limit=${limit}&searchText=${searchText}`
      );
      return {
        comments: response.data.comments,
        primaryCommentsCount: response.data.primaryCommentsCount,
      };
    } catch (error) {
      if (Axios.isAxiosError(error))
        return rejectWithValue(error.response?.status);
    }
  }
);

export const getReplies = createAsyncThunk(
  "comments/getReplies",
  async (
    parameters: {
      parentID: number;
      previousPageLastReplyIndex: number;
      limit: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authorizedRequest().get<Comment, any>(
        `comments?filter=parent&id=${parameters.parentID}&previousPageLastCommentIndex=${parameters.previousPageLastReplyIndex}&limit=${parameters.limit}`
      );
      return response.data;
    } catch (error) {
      if (Axios.isAxiosError(error))
        return rejectWithValue(error.response?.status);
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (
    comment: {
      postID: number;
      text: string;
      author: number;
      isSearchRequest: boolean;
      siblingID: number;
      parentID?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authorizedRequest().post<Comment, any>(
        "comments",
        comment
      );

      return response.data;
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.status);
      }
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (data: { id: number; text: string }, { rejectWithValue }) => {
    try {
      const { id, text } = data;
      const response = await authorizedRequest().put<Comment, any>(
        `comments/${id}`,
        { text }
      );

      return response.data;
    } catch (error) {
      if (Axios.isAxiosError(error))
        return rejectWithValue(error.response?.status);
    }
  }
);

export const removeComment = createAsyncThunk(
  "comments/removeComment",
  async (data: { id: number; parentID?: number }, { rejectWithValue }) => {
    try {
      await authorizedRequest().delete<Comment, any>(`comments/${data.id}`);
      return data;
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.status);
      }
    }
  }
);

function setError(errorStatus: number) {
  switch (errorStatus) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized request";
    case 403:
      return "Forbidden Access";
    case 404:
      return "Not found";
    default:
      return "Unexpected server error";
  }
}

export const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    commentsArray: [] as Comment[],
    primaryCommentsCount: 0,
    getCommentsStatus: "",
    getCommentsError: "",
    getRepliesStatus: "",
    getRepliesError: "",
    addCommentStatus: "",
    addCommentError: "",
    updateCommentStatus: "",
    updateCommentError: "",
    removeCommentStatus: "",
    removeCommentError: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getComments.pending, (state) => {
      state.getCommentsStatus = "pending";
    });
    builder.addCase(getComments.fulfilled, (state, action) => {
      const defaultPreviousPageLastCommentIndex = -1;
      if (
        action.meta.arg.previousPageLastCommentIndex ===
        defaultPreviousPageLastCommentIndex
      ) {
        state.commentsArray = action.payload?.comments;
        state.primaryCommentsCount = action.payload?.primaryCommentsCount;
      } else
        state.commentsArray = [
          ...state.commentsArray,
          ...action.payload?.comments,
        ];

      state.getCommentsStatus = "fulfilled";
    });
    builder.addCase(
      getComments.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.getCommentsStatus = "failed";
        state.getCommentsError = setError(action.payload);
      }
    );

    builder.addCase(getReplies.pending, (state) => {
      state.getRepliesStatus = "pending";
    });
    builder.addCase(getReplies.fulfilled, (state, action) => {
      const defaultPreviousPageLastReplyIndex = -1;

      const parentIndex = state.commentsArray.findIndex(
        (x: Comment) => x.id === action.payload.comments[0].parentID
      );

      action.meta.arg.previousPageLastReplyIndex ===
      defaultPreviousPageLastReplyIndex
        ? (state.commentsArray[parentIndex].replies = action.payload.comments)
        : (state.commentsArray[parentIndex].replies = [
            ...state.commentsArray[parentIndex].replies,
            ...action.payload.comments,
          ]);

      state.getRepliesStatus = "fulfilled";
    });
    builder.addCase(
      getReplies.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.getRepliesStatus = "failed";
        state.getRepliesError = setError(action.payload);
      }
    );

    builder.addCase(addComment.pending, (state) => {
      state.addCommentStatus = "pending";
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      const newComment: Comment = action.payload.data;
      if (!action.payload.data.parentID) {
        newComment.repliesCount = 0;
        state.commentsArray.unshift(newComment);
        state.primaryCommentsCount = state.primaryCommentsCount + 1;
      } else {
        if (!action.meta.arg.isSearchRequest) {
          const parentIndex = state.commentsArray.findIndex(
            (c) => c.id === action.payload.data.parentID
          );
          state.commentsArray[parentIndex].repliesCount = !state.commentsArray[
            parentIndex
          ].repliesCount
            ? 1
            : state.commentsArray[parentIndex].repliesCount + 1;

          if (state.commentsArray[parentIndex].replies) {
            const siblingIndex = state.commentsArray[
              parentIndex
            ].replies.findIndex((c) => c.id === action.meta.arg.siblingID);
            state.commentsArray[parentIndex].replies.splice(
              siblingIndex + 1,
              0,
              newComment
            );
          } else
            state.commentsArray[parentIndex].replies = [action.payload.data];
        } else {
          const siblingIndex = state.commentsArray.findIndex(
            (c) => c.id === action.meta.arg.siblingID
          );
          state.commentsArray.splice(siblingIndex + 1, 0, newComment);
          state.primaryCommentsCount = state.primaryCommentsCount + 1;
        }
      }
      state.addCommentStatus = "fulfilled";
    });
    builder.addCase(
      addComment.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.addCommentStatus = "failed";
        state.addCommentError = setError(action.payload);
      }
    );

    builder.addCase(updateComment.pending, (state) => {
      state.updateCommentStatus = "pending";
    });
    builder.addCase(updateComment.fulfilled, (state, action) => {
      const commentIndex = state.commentsArray.findIndex(
        (c) => c.id === action.payload.data.id
      );
      if (commentIndex > -1) {
        state.commentsArray[commentIndex].text = action.payload.data.text;
        state.commentsArray[commentIndex].dateModified =
          action.payload.data.dateModified;
      } else {
        const parentIndex = state.commentsArray.findIndex(
          (c) => c.id === action.payload.data.parentID
        );
        const replyIndex = state.commentsArray[parentIndex].replies.findIndex(
          (c) => c.id === action.payload.data.id
        );

        state.commentsArray[parentIndex].replies[replyIndex].text =
          action.payload.data.text;
        state.commentsArray[parentIndex].replies[replyIndex].dateModified =
          action.payload.data.dateModified;
      }

      state.updateCommentStatus = "fulfilled";
    });
    builder.addCase(
      updateComment.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.updateCommentStatus = "failed";
        state.updateCommentError = setError(action.payload);
      }
    );

    builder.addCase(removeComment.pending, (state) => {
      state.removeCommentStatus = "pending";
    });
    builder.addCase(
      removeComment.fulfilled,
      (state, action: PayloadAction<any, string>) => {
        const comment = state.commentsArray.find(
          (c) => c.id === action.payload.id
        );

        if (comment !== undefined) {
          state.commentsArray.splice(state.commentsArray.indexOf(comment), 1);
          state.primaryCommentsCount = state.primaryCommentsCount - 1;
          state.removeCommentStatus = "fulfilled";
          return;
        }

        const parent = state.commentsArray.find(
          (c) => c.id === action.payload.parentID
        );

        const reply = parent?.replies.find((c) => c.id === action.payload.id);
        if (parent !== undefined && reply !== undefined) {
          parent.replies.splice(parent.replies.indexOf(reply), 1);
          parent.repliesCount = parent.repliesCount - 1;
        }

        state.removeCommentStatus = "fulfilled";
      }
    );
    builder.addCase(
      removeComment.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.removeCommentStatus = "failed";
        state.removeCommentError = setError(action.payload);
      }
    );
  },
});

export const selectCommentsStore = (state: any) => state.comments;

export default commentsSlice.reducer;
