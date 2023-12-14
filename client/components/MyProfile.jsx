// MyProfile.jsx
import React from "react";
import LeftColumn from "./leftcolumn";
import RightColumn from "./rightcolumn";
import Loading from "./loading";

function MyProfile({
  userid,
  firstName,
  lastName,
  email,
  phoneNumber,
  profPic,
  gender
}) {
  if (!userid) {
    return <Loading />;
  }
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">
        <LeftColumn
          userid={userid}
          firstName={firstName}
          lastName={lastName}
          email={email}
          phoneNumber={phoneNumber}
          profPic={profPic}
          gender={gender}
        />
        <RightColumn userid={userid} />
      </div>
    </div>
  );
}

export default MyProfile;
