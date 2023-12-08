"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname} from 'next/navigation'

const Nav = () => {
  const pathname = usePathname()

  // Check if the current pathname is /sign-in or /sign-up
  const isSignInOrSignUp = ['/sign-in', '/sign-up'].includes(pathname);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
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
      <div className={` justify-between ${isSignInOrSignUp ? 'hidden' : 'sm:flex hidden'}`}>
        <Link href={"/sign-in"}>
          <button type="button" className="black_btn">
            Sign in
          </button>
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className={`sm:hidden flex relative ${isSignInOrSignUp ? 'hidden' : ''}`}>
        <Link href={"/sign-in"}>
          <button type="button" className="black_btn">
            Sign in
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
