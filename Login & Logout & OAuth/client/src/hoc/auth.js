import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authUser } from "../actions/user_action";
import { useNavigate } from "react-router-dom";

export default function authCover(
  SpecificComponent,
  option,
  adminRoute = null
) {
  // 컴포넌트 명 / null or true or false / 관리자 사용안할시 = null
  // null 👉 아무나 출입이 가능
  // true 👉 로그인한 유저만 출입이 가능
  // false 👉 로그인한 유저는 출입이 불가능
  // App.js 에서 설정한다

  function AuthenticationCheck() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(authUser()).then((res) => {
        console.log(res);
        if (res.payload.isAuth === false) {
          // 로그인하지 않은 상태일 경우
          return navigate("/login");
        } else if (res.payload.isAuth === true) {
          // 로그인 상태일 경우
          return navigate("/");
        } else if (
          res.payload.isAuth === false &&
          res.payload.loginSuccess === false &&
          res.payload.signupSuccess === false
        ) {
          // 로그인 상태일 경우
          return navigate("/register");
          // if (option === true) {
          //   // 로그인한 유저만 출입이 가능한 곳은 못들어가게하고
          //   navigate("/");
          //   // 로그인 페이지로 보내버린다
          // } else {
          //   if (adminRoute === true && res.payload.isAdmin === false) {
          //     // adminRoute 관리자만 들어갈수 있는 곳인데
          //     // isAdmin 가 false => 관리자가 아닐경우
          //     navigate("/");
          //     // 메인 페이지로 보내버린다
          //   } else if (option === false) {
          //     // 로그인한 유저가 로그인 페이지를 또 들어가려는 경우
          //     navigate("/");
          //     // 메인 페이지로 보내버린다
          //   }
          // }
        }
      });
    }, [dispatch, navigate]);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
