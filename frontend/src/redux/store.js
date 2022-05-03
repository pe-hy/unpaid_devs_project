import { configureStore } from '@reduxjs/toolkit';
import practicesReducer from './practicesSlice';

export default configureStore({
	reducer: {
		practices: practicesReducer,
	},
});