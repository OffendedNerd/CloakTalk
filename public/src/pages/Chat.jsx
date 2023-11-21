import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const nav = useNavigate();
  const soc = useRef();
  const [cont, setCont] = useState([]);
  const [curChat, setCurChat] = useState(undefined);
  const [curUser, setCurUser] = useState(undefined);

  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      nav("/login");
    } else {
      setCurUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);

  useEffect(() => {
    if (curUser) {
      soc.current = io(host);
      soc.current.emit("add-user", curUser._id);
    }
  }, [curUser]);

  useEffect(async () => {
    if (curUser) {
      if (curUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${curUser._id}`);
        setCont(data.data);
      } else {
        nav("/setAvatar");
      }
    }
  }, [curUser]);

  const handleChange = (chat) => {
    setCurChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={cont} changeChat={handleChange} />
          {curChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={curChat} socket={soc} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
