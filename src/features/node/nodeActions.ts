import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { basePath } from "../../api";

export const getNodeInfoConfig = createAsyncThunk(
  'node/info',
  async ({ token, id }: any, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${basePath}/nodes/${id}/config`, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${token}`,
        }
      });
      if(id){
        localStorage.setItem('admin-web-nodeId', id);
      }
      return data;

    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);