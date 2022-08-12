import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./types";

export function loginUser(dataToSubmit) {
  const req = axios
    .post("/api/users/login", dataToSubmit)
    .then((res) => res.data); // post로 '/api/users/login'에 보내서 응답받은 data를 req에 담는다

  // 👇👇👇 req 를 reducer로 넘겨주는 작업 (👆👆 action을 만드는 방법)
  return {
    type: LOGIN_USER, // 👈 types.js 에서 꺼내씀
    payload: req,
  }; // 👆👆 action 의 형태로 만들어진 json / type 이름은 아무거나 지어도 가능
  // retrun 된 action을 Reducer로 보내준다
}

// Reducer 는 (previousState, action) 을 담아서 다음(nextState)으로 보내준다

export function registerUser(dataToSubmit) {
  const req = axios
    .post("/api/users/register", dataToSubmit)
    .then((res) => res.data); // post로 '/api/users/login'에 보내서 응답받은 data를 req에 담는다

  // 👇👇👇 req 를 reducer로 넘겨주는 작업 (👆👆 action을 만드는 방법)
  return {
    type: REGISTER_USER, // 👈 types.js 에서 꺼내씀
    payload: req,
  }; // 👆👆 action 의 형태로 만들어진 json / type 이름은 아무거나 지어도 가능
  // retrun 된 action을 Reducer로 보내준다
}

export function authUser() {
  const req = axios.get("/api/users/auth").then((res) => res.data);
  // get으로 로그인된 정보를 '/api/users/auth'에 보내서 응답받은 data를 req에 담는다
  // get 이니까 함수에 인자는 필요가 없어진다

  // 👇👇👇 req 를 reducer로 넘겨주는 작업 (👆👆 action을 만드는 방법)
  return {
    type: AUTH_USER, // 👈 types.js 에서 꺼내씀
    payload: req,
  }; // 👆👆 action 의 형태로 만들어진 json / type 이름은 아무거나 지어도 가능
  // retrun 된 action을 Reducer로 보내준다
}
