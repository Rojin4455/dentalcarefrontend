import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  location: {},
  answers:{},
};


export const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
      setLocation: (state, action) => {
        const { location, answers } = action.payload;
        state.location = location;
        state.answers = answers;
        
      },
      clearLocation: (state, action) => {
        state.location = {};
        state.answers = {};

      }
    }
})

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer