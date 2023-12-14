"use client";
import React, { useState, useEffect } from "react";
import MyProfile from "@components/MyProfile";
import { useSearchParams } from "next/navigation";

function Profile() {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");
  const userId = searchParams.get("id");
  const [data, setData] = useState([]);

  const [encodedImage, setEncodedImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Assuming your API expects the userId as a query parameter
        const response = await fetch(
          `http://localhost:8080/api/userInfo?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // Handle error if the response is not okay
          console.error(
            "Error fetching user information:",
            response.statusText
          );
          return;
        }

        const userData = await response.json();
        setData(userData.data);
        // Check if the response includes an encoded image
        if (userData.encoded_image) {
          setEncodedImage(userData.encoded_image);
        }
      } catch (error) {
        console.error("Error fetching user information:", error.message);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <>
      <MyProfile
        userid={data[0]}
        firstName={data[1]}
        lastName={data[2]}
        email={data[3]}
        phoneNumber={data[4]}
        profPic={encodedImage}
        gender={data[8]}
      />
    </>
  );
}

export default Profile;
