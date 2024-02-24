import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducer/authReducer';

const store = configureStore({
  reducer: {
    login: loginReducer, // Add your login reducer here
  },
});

export default store;
