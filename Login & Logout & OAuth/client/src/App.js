import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./component/views/LandingPage/LandingPage";
import LoginPage from "./component/views/LoginPage/LoginPage";
import RegisterPage from "./component/views/RegisterPage/RegisterPage";
import authCover from "./hoc/auth";

function App() {
  const LandingPageAuthPage = authCover(LandingPage, null);
  const LoginPageAuthPage = authCover(LoginPage, null);
  const RegisterPageAuthPage = authCover(RegisterPage, null);
  // null 👉 아무나 출입이 가능
  // true 👉 로그인한 유저만 출입이 가능
  // false 👉 로그인한 유저는 출입이 불가능

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageAuthPage />} />

        <Route path="/login" element={<LoginPageAuthPage />} />

        <Route path="/register" element={<RegisterPageAuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
