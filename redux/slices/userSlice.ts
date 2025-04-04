"use client";

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { setIsLoaderFalse, setIsLoaderTrue } from "./commonSlice";
import { getAllCategoryService } from "@/services/categoryService";
import { getAllUserService } from "@/services/userService";
import { AxiosResponse } from "axios";

export const getAllUserData = createAsyncThunk<any>(
  "events/getAllUserData",
  async () => {
    const response: any = await getAllUserService();
    return {
      data: response.data,
      pagination: response.pagination,
    };
  }
);
export interface UserResponse {
  users: any[];
  loading: boolean;
}

const initialState = {
  users: [],
  loading: false,
};

export const userSlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUserData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(
        getAllUserData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.users = action.payload;
        }
      )
      .addCase(getAllUserData.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

const {} = userSlice.actions;
export default userSlice.reducer;
