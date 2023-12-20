// LeftColumn.jsx
"use client";
import React from "react";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.css";
import { useRouter } from "next/navigation";

const LeftColumn = ({
  userid,
  firstName,
  lastName,
  email,
  phoneNumber,
  profPic,
  gender,
}) => {
  const router = useRouter();
  const editUserProfile = () => {
    router.push(`/profile/editProfile?id=${userid}`);
  };

  return (
    <div className="-mt-2 p-2 lg:mt-0 lg:w-[35%] lg:max-w-md lg:flex-shrink-0">
      <div
        className="rounded-2xl ring-blue-500 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16"
        style={{ boxShadow: "0 4px 8px blue" }}
      >
        <div className="flex w-full lg:flex-col lg:justify-center lg:items-start items-center flex-row flex-wrap justify-between mt-[-30px] px-8">
          {profPic ? (
            <img
              src={`data:image/jpeg;base64,${profPic}`}
              alt="Profile Pic"
              width={175}
              height={175}
              className="h-48 w-48 ml-4 rounded-full"
            />
          ) : (
            <Image
              width={175}
              height={175}
              className="h-48 w-48 ml-4 rounded-full"

              src={
                gender === "Male"
                  ? "/assets/images/man.png"
                  : "/assets/images/woman.png"
              }
            />
          )}
          <ul>
            <li className="font-verdana text-start text-xl mb-4">
              <i className="fas fa-user user-icon text-blue-800"></i>
              <span className="ml-2">
                {firstName} {lastName}
              </span>
            </li>
            <li className="font-verdana text-start text-xl mb-4">
              <i className="fas fa-envelope email-icon text-blue-800"></i>
              <span className="ml-2">{email}</span>
            </li>
            {phoneNumber ? (
              <li className="font-verdana text-start text-xl mb-4">
                <i className="fas fa-phone phone-icon text-blue-800"></i>
                <span className="ml-2">{phoneNumber}</span>
              </li>
            ) : (
              <></>
            )}
          </ul>
        </div>

        <div className=" flex justify-center ">
          <button
            onClick={editUserProfile}
            className="rounded-md w-fit bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;
