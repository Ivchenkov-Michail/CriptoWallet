import { combineReducers } from "@reduxjs/toolkit";
import portfolioReducer from "./slices/portfolioSlice";
const rootReducer = combineReducers({
  portfolio: portfolioReducer,
});

export default rootReducer;
