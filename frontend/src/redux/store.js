import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';

export default configureStore({
	reducer: {
		role: roleReducer,
	},
});