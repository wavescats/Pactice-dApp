import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "../actions/types";

// Reducer 는 (previousState, action) 을 담아서 다음(nextState)으로 보내준다
export default function userReducer(previousState = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...previousState, loginSuccess: action.payload };
    // (previousState, action) 둘다 가졌으니 다음(nextState)으로 retrun
    // loginSuccess 라고 server에 index.js 에서 정의했기때문에 loginSuccess라고 적어야함

    case REGISTER_USER:
      return { ...previousState, signupSuccess: action.payload };
    // (previousState, action) 둘다 가졌으니 다음(nextState)으로 retrun
    // success 라고 server에 index.js 에서 정의했기때문에 success라고 적어야함

    case AUTH_USER:
      return { ...previousState, isAuth: action.payload };
    // (previousState, action) 둘다 가졌으니 다음(nextState)으로 retrun
    // success 라고 server에 index.js 에서 정의했기때문에 success라고 적어야함

    default:
      return previousState;
  }
}
