"use client";


import { useEffect, useState } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";


function NewPassword() {
  const searchParams = useSearchParams();
  const router=useRouter()
  const userEmail = searchParams.get("email");
  const userId = searchParams.get("id");
  const [formData, setFormData] = useState({
    id: userId,
    email: userEmail,
    newPassword: "",
    confirmPassword: "",
  });
  const [flag, setFlag] = useState(false);

  const [showFeedback, setShowFeedback] = useState(true);

  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 5000);

      // Clear the timeout if the component unmounts or if showFeedback becomes false before 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  const handleChanges = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newFormData);
    checkValidation(newFormData.newPassword, newFormData.confirmPassword);
  };

  const checkValidation = (pass1, pass2) => {
    setFlag((prevFlag) => {
      const newFlag = pass1 === pass2;
      return newFlag;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (flag) {
      try {
        // Send a POST request to the Flask backend to add data to the database
        const response = await fetch("http://localhost:8080/api/newPassword", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.flag) {
            console.log(result.message);
          } else {
            console.log(result.message);
          }

          // Optionally, you can update the list of names after successful registration
        } else {
          const result = await response.json();
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("The two passwords are not the same");
    }
    Swal.fire({
      title: `${flag === true ? 'Success' : 'Error'}`,
      text: `${flag === true ? 'Password reset successfully' : 'Two Passwords are not the same'}`,
      icon: `${flag ? `success`:`error`}`,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${flag ? `Go Back to Log-in page`:`Try again`}`
    }).then((result) => {
      if (result.isConfirmed && flag) {
        router.push(`/sign-in`);
      }
    });

  };

  return (
    <>

      <div
        className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
        style={{ width: "100%" }}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto mb-[-20px]"
            src="/assets/images/logo.png"
            alt="Online Profile"
            style={{ width: "170px", height: "130px" }}
          />

          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Forgot Your Password?
          </h2>
          <p className="text-gray-600 font-medium  text-center">
            Dont worry you can recover it easily
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="emailBarUp">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Your Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userEmail}
                  disabled
                  autoComplete="email"
                  required
                  className="block text-center bg-slate-200 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="passwordBarSlide">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="newpassword"
                  name="newPassword"
                  type="password"
                  onChange={handleChanges}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="passwordBarSlide">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChanges}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewPassword;
