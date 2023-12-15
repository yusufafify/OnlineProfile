"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserInfo({ username, userId }) {
  const [data, setData] = useState([]);
  const [gitHubUserName, setGitHubUserName] = useState("");
  const [FacebookUserName, setFacebookUserName] = useState("");
  const [InstagramUserName, setInstagramUserName] = useState("");

  function extractUserName(url) {
    var parts = url.split("/");
    return parts[3]; // The 4th part of the URL is the username
  }

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

        setInstagramUserName(
          userData.data[6] ? extractUserName(userData.data[6]) : null
        );
        setFacebookUserName(
          userData.data[5] ? extractUserName(userData.data[5]) : null
        );
        setGitHubUserName(
          userData.data[7] ? extractUserName(userData.data[7]) : null
        );
      } catch (error) {
        console.error("Error fetching user information:", error.message);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          User Information
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {data[1]} {data[2]}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Gender</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {data[8]}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {data[3]}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {data[4]}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Facebook</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <Link href={`${data[5]}`} target="_blank" className="text-blue-900">
                <i className="fa-brands fa-facebook"></i> {FacebookUserName}
              </Link>
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Instagram</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <Link href={`${data[6]}`} target="_blank" className="text-pink-600">
                <i className="fa-brands fa-instagram"></i> {InstagramUserName}
              </Link>
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Github</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <Link href={`${data[7]}`} target="_blank" className="text-purple-600">
                <i className="fa-brands fa-github"></i> {gitHubUserName}
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
