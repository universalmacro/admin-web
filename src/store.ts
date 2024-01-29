import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import restaurantReducer from './features/restaurant/restaurantSlice';
import nodeReducer from './features/node/nodeSlice';



const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
    node: nodeReducer,
  }
})

export type AppDispatch = typeof store.dispatch;
export default store;