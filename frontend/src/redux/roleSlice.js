import { createSlice } from '@reduxjs/toolkit';

export const roleSlice = createSlice({
	name: 'role',
	initialState: {name: "ah"},
	reducers: {
		setRole: (state, action) => {
			console.log("redux slice", state, action);
			const role = {
				name: action.payload.name,
			};
			state = role;
		},
	},
});


export const { setRole } = roleSlice.actions;

export default roleSlice.reducer;