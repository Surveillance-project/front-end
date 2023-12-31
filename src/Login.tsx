import { Button, Input, Stack } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./api/login";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [usr, setUsr] = useState("");
  const [pwd, setPwd] = useState("");

  const loginAction = async () => {
    try {
      localStorage.setItem("token", ((await login(usr, pwd)) as any).access);
      navigate("/map");
    } catch {
      alert("Try again");
    }
  };

  return (
    <Stack padding={4}>
      <h1>Login</h1>
      <Input value={usr} onChange={(e) => setUsr(e.target.value)} />
      <Input
        type="password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <Button onClick={loginAction}>Login</Button>
    </Stack>
  );
};
