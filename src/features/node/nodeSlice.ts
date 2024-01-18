import { createSlice } from '@reduxjs/toolkit';
import { getNodeInfoConfig } from "./nodeActions";

// // initialize userToken from local storage
// const restaurantId = localStorage.getItem('restaurantId')
//   ? localStorage.getItem('restaurantId')
//   : null;


const initialState = {
  loading: false,
  nodeInfo: null,
  nodeConfig: null,
  error: null,
  success: false,
} as any;


const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    setNode: (state: any, { payload }: any) => {
      console.log("setNode", payload);
      state.nodeInfo = payload;
      // state.nodeConfig = payload?.config;
      localStorage.setItem('admin-web-nodeId', payload?.id);
      return state;
    },
    resetNode: (state: any, { payload }: any) => {
      state.nodeInfo = null;
      state.nodeConfig = null;
      localStorage.removeItem('admin-web-nodeId');
      return state;
    }

  },
  extraReducers: (builder: any) => {
    builder
      .addCase(getNodeInfoConfig.pending, (state: any, { payload }: any) => {
        state.loading = true;
        state.error = null;
        return state;
      })
      .addCase(getNodeInfoConfig.fulfilled, (state: any, { payload }: any) => {
        state.loading = false;
        state.nodeConfig = payload;
        return state;
      })
      .addCase(getNodeInfoConfig.rejected, (state: any, { payload }: any) => {
        state.loading = false;
        state.error = payload;
        return state;
      })
  }
} as any);

export const { setNode, resetNode } = nodeSlice.actions;
export default nodeSlice.reducer;