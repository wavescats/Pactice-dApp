import { combineReducers } from "redux";
// Stroe 안에 Reducer가 여러개 있을수 있는데
// combineReducers 를 사용하면 rootReducer로 하나로 합쳐줄수 있다
import user from "./user_reducer";

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
