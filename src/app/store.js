import { configureStore, createSlice } from '@reduxjs/toolkit';
//import counterReducer from '../features/counter/counterSlice';

const userSlice = createSlice({
  name: 'uid',
  initialState: null,
  reducers: {
    logIn: (state, action) => action.payload,
    logOut: (state, action) => null
  }
});

export const { logIn, logOut } = userSlice.actions;

export default configureStore({
  reducer: userSlice.reducer
});
