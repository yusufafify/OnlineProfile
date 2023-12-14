"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import UserInfo from './UserInfo';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "@fortawesome/fontawesome-free/css/all.css";


const MySwal = withReactContent(Swal);

const Nav = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");
  const userId = searchParams.get("id");
  const [toggleDropdown, setToggleDropdown] = useState(false);


  const showUserInfo=()=>{
    setToggleDropdown(false)
    MySwal.fire({
      html: <UserInfo userName={userName} userId={userId} />,
      confirmButtonText: 'Close',
    });
  }

  // Check if the current pathname is /sign-in or /sign-up
  const isSignInOrSignUp = ["/sign-in", "/sign-up"].includes(pathname);

  const isProfile = [`/profile`,"/profile/editProfile"].includes(pathname);
  return (
    <nav className="flex-between w-full mb-16 pt-3 z-10">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.png"
          alt="logo"
          width={50}
          height={50}
          className="object-contain"
        />
        <p className="logoText ">Online Profile</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
      {isProfile ? (
        <div className="flex gap-3 md:gap-5">
          <button onClick={showUserInfo} className="black_btn">
            Show User Info
          </button>

          <button type="button" className="outline_btn">
            Sign Out
          </button>
        </div>
      ) : (
        <div
          className={` justify-between ${
            isSignInOrSignUp ? "hidden" : "sm:flex hidden"
          }`}
        >
          <Link href={"/sign-in"}>
            <button type="button" className="black_btn">
              Sign in
            </button>
          </Link>
        </div>
      )}
</div>
      {/* Mobile Navigation */}

      <div className="sm:hidden flex relative">
        {isProfile ? (
          <div className="flex">
            <Image
              src={
                toggleDropdown
                  ? "/assets/icons/x-solid.svg"
                  : "/assets/icons/bars-solid.svg"
              }
              width={30}
              height={30}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />

            {toggleDropdown && (
              <div className="dropdown">

                <button
                  className="dropdown_link"
                  onClick={showUserInfo}
                >
                  Show User Info
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`sm:hidden flex relative ${
              isSignInOrSignUp ? "hidden" : ""
            }`}
          >
            <Link href={"/sign-in"}>
              <button type="button" className="black_btn">
                Sign in
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
