// store.js
"use client"
import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './slices/emailSlice';

export const store= configureStore({
  reducer: {
    email: emailReducer,
  },
});

