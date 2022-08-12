import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../actions/user_action";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // preventDefault 👉 새로고침이 실행되지 않게 하고싶을 경우 (submit은 작동됨)

    let body = {
      email: Email,
      password: Password,
    };

    // 👇👇👇 dispatch를 이용해서 action을 취해야한다
    dispatch(loginUser(body)).then((res) => {
      console.log(res);
      // loginUser(body) 는 👆 에서 submit 되었을때
      // post로 '/api/users/login'에 보내서 응답받은 data를 req에 담았을때
      if (res.payload.loginSuccess === true) {
        // response에 req가 잘 담겨서 loginSuccess 가 나온다면
        navigate("/");
        // LoginPage에서 Home화면으로 이동한다 navigate("/")
        console.log(res.payload.loginSuccess);
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
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
