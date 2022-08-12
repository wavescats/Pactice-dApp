import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../actions/user_action";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };

  const onNameHandler = (e) => {
    setName(e.target.value);
  };

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // preventDefault 👉 새로고침이 실행되지 않게 하고싶을 경우 (submit은 작동됨)

    if (Password !== ConfirmPassword) {
      // 비밀번호랑 비밀번호 확인이 같지 않은경우
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다");
    }

    let body = {
      email: Email,
      password: Password,
      name: Name,
    };

    // 👇👇👇 dispatch를 이용해서 action을 취해야한다
    dispatch(registerUser(body)).then((res) => {
      console.log(res);
      // registerUser(body) 는 👆 에서 submit 되었을때
      // post로 '/api/users/register'에 보내서 응답받은 data를 req에 담았을때
      if (res.payload.signupSuccess === true) {
        // response에 req가 잘 담겨서 success 가 나온다면
        navigate("/login");
        // RegisterPage에서 Login화면으로 이동한다 navigate("/login")
        console.log(res.payload.signupSuccess);
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

        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />
        <br />
        <button>회원가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;
