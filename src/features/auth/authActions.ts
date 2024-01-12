import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { basePath } from "../../utils/constant";
import sha256 from 'crypto-js/sha256';

export const userLogin = createAsyncThunk(
	'auth/login',
	async ({ userName, password }: any, { rejectWithValue }) => {
		try {
			const { data } = await axios.post(`${basePath}/sessions`, {
				'account': userName,
				'password': sha256(sha256(password).toString()).toString(),
			});
			if(data?.token){
				localStorage.setItem('admin-web-token', data.token);
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