import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function AvatarSelection() {
  const avatarService = `https://api.multiavatar.com/4645646`;
  const router = useNavigate();
  const [avatarImages, setAvatarImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const checkUserAuth = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        router("/login");
      }
    };

    checkUserAuth();
  }, [router]);

  const setProfilePicture = async () => {
    if (selectedAvatarIndex === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      try {
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatarImages[selectedAvatarIndex],
        });

        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(user)
          );
          router("/");
        } else {
          toast.error(
            "Error setting avatar. Please try again.",
            toastOptions
          );
        }
      } catch (error) {
        console.error("Error setting avatar:", error.message);
      }
    }
  };

  useEffect(() => {
    const fetchAvatarImages = async () => {
      const images = [];
      for (let i = 0; i < 4; i++) {
        const response = await axios.get(
          `${avatarService}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(response.data);
        images.push(buffer.toString("base64"));
      }
      setAvatarImages(images);
      setLoading(false);
    };

    fetchAvatarImages();
  }, []);

  return (
    <Container>
      {loading ? (
        <LoaderContainer>
          <img src={loader} alt="loader" className="loader" />
        </LoaderContainer>
      ) : (
        <ContentContainer>
          <TitleContainer>
            <h1>Select an Avatar for Your Profile</h1>
          </TitleContainer>
          <AvatarsContainer>
            {avatarImages.map((image, index) => (
              <Avatar
                key={image}
                isSelected={selectedAvatarIndex === index}
                onClick={() => setSelectedAvatarIndex(index)}
              >
                <img src={`data:image/svg+xml;base64,${image}`} alt="avatar" />
              </Avatar>
            ))}
          </AvatarsContainer>
          <SubmitButton onClick={setProfilePicture}>Set as Profile Picture</SubmitButton>
          <ToastContainer />
        </ContentContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
`;

const LoaderContainer = styled.div`
  .loader {
    max-inline-size: 100%;
  }
`;

const ContentContainer = styled.div`
  .title-container {
    h1 {
      color: white;
    }
  }
`;

const AvatarsContainer = styled.div`
  display: flex;
  gap: 2rem;

  .avatar {
    border: 0.4rem solid transparent;
    padding: 0.4rem;
    border-radius: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s ease-in-out;

    img {
      height: 6rem;
      transition: 0.5s ease-in-out;
    }
  }

  .selected {
    border: 0.4rem solid #4e0eff;
  }
`;

const Avatar = styled.div`
  border: 0.4rem solid transparent;
  padding: 0.4rem;
  border-radius: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s ease-in-out;

  img {
    height: 6rem;
    transition: 0.5s ease-in-out;
  }

  ${({ isSelected }) => isSelected && "border: 0.4rem solid #4e0eff;"}
`;

const SubmitButton = styled.button`
  background-color: #4e0eff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;

  &:hover {
    background-color: #4e0eff;
  }
`;
