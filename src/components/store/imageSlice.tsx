import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Axios from "axios";
import authorizedRequest from "../../authorizedRequest";

export const uploadImage = createAsyncThunk(
  "images/upload",
  async(file: FormData, { rejectWithValue }) => {
    try {
      const response = await authorizedRequest().post("images", file)
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

export const deleteImage = createAsyncThunk(
  "images/delete",
  async(image: string, { rejectWithValue }) => {
    try {
      const response = await authorizedRequest().delete(`images/${image}`)
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

const initialState = {
  image: "",
  uploadImageStatus: "",
  uploadImageError: "",
  deleteImageStatus: "",
  deleteImageError: ""
};

export const imageSlice = createSlice({
  name: "imageUpload",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(uploadImage.pending, (state, action) => {
      state.uploadImageStatus = "pending";
    });

    builder.addCase(uploadImage.fulfilled, (state, action) => {
      state.image = action.payload;
      state.uploadImageStatus = "success";
    });

    builder.addCase(
      uploadImage.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.uploadImageStatus = "rejected";
        state.uploadImageError = setErrorMessage(action.payload.status);
      }
    );

    builder.addCase(deleteImage.pending, (state, action) => {
      state.deleteImageStatus = "pending";
    });

    builder.addCase(deleteImage.fulfilled, (state, action) => {
      state.image = "";
      state.deleteImageStatus = "success";
    });

    builder.addCase(
      deleteImage.rejected,
      (state, action: PayloadAction<any, string>) => {
        state.deleteImageStatus = "rejected";
        state.deleteImageError = setErrorMessage(action.payload.status);
      }
    );
  }
})

export default imageSlice.reducer;
