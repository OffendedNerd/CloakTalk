import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

export default function SignOutButton() {
  const navigator = useNavigate();

  const handleSignOut = async () => {
    try {
      const userId = await getUserIdFromLocalStorage();
      await axios.get(`${logoutRoute}/${userId}`);
      clearLocalStorage();
      navigator("/login");
    } catch (error) {
      console.error("Sign-out failed:", error.message);
    }
  };

  const getUserIdFromLocalStorage = async () => {
    const userData = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    return userData._id;
  };

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  return (
    <SignOutBtn onClick={handleSignOut}>
      <BiPowerOff />
    </SignOutBtn>
  );
}

const SignOutBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;

  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
