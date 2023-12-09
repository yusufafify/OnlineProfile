// emailSlice.js
"use client"
import { createSlice } from '@reduxjs/toolkit';

export const emailSlice = createSlice({
  name: 'email',
  initialState: '',
  reducers: {
    setEmail: (state, action) => action.payload,
  },
});

export const { setEmail } = emailSlice.actions;

export default emailSlice.reducer;
