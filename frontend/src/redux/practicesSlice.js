import { createSlice } from '@reduxjs/toolkit';

export const practicesSlice = createSlice({
	name: 'practices',
	initialState: {
		pastPractices: [],
		futurePractices: [],
	},
	reducers: {
		setPractices: (state, action) => {
			if(action.payload.pastPractices){
				state.pastPractices = action.payload.pastPractices;
			}
			if(action.payload.futurePractices){
				state.futurePractices = action.payload.futurePractices;
			}
		},
	},
});


export const { setPractices } = practicesSlice.actions;

export default practicesSlice.reducer;