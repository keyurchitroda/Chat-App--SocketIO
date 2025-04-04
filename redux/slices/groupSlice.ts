"use client";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { setIsLoaderFalse, setIsLoaderTrue } from "./commonSlice";
import { getAllGroupService } from "@/services/groupService";

const initialState: any = {
  groups: [],
};

export const groupSlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {
    getAllGroupSuccess: (state, action: PayloadAction<any[]>) => {
      state.groups = action.payload;
    },
  },
});

const { getAllGroupSuccess } = groupSlice.actions;
export default groupSlice.reducer;

export const getAllGroups = () => async (dispatch: AppDispatch) => {
  try {
    await dispatch(setIsLoaderTrue());
    let response: any = await getAllGroupService();
    console.log("response?>>>>>>>>>>>>.", response);
    if (response.success === true) {
      await dispatch(getAllGroupSuccess(response.data));
    }
    await dispatch(setIsLoaderFalse());
  } catch (e: any) {
    await dispatch(setIsLoaderFalse());
    if (e.code === 500) {
      console.log("error,", e);
    }
  }
};
