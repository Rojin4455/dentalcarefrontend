import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: "",
  email: ""
};

export const userDetailsSlice = createSlice({
  name: 'userdetails',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Merge each key from the payload into the state
      Object.entries(action.payload).forEach(([key, value]) => {
        if (value !== undefined) {
          state[key] = value;
        }
      });
    },
    clearUser: (state) => {
      state.name = "";
      state.email = "";
    }
  }
});

export const { setUser, clearUser } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
