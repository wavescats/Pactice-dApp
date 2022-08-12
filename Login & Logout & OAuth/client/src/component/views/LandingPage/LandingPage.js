import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// postman 으로 get / post 요청을 보내서 어떤 값이 오는지 확인하는 과정을
// axios를 사용하면 그걸 리액트에서 하는것이다

function LandingPage() {
  const navigate = useNavigate();

  const onClickHandler = () => {
    axios
      .get("/api/users/logout")
      // 로그인된 정보를 그대로 가지고 있는 상태에서
      // 5000포트 백엔드로 get요청을 보냄 👉 로그아웃이 된다
      .then((res) => {
        if (res.data.isAuth === false) {
          // 로그아웃이 성공적으로 됐다면
          navigate("/login");
          // 로그인페이지로 이동
        } else {
          alert("Error");
        }
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      LandingPage
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default LandingPage;
