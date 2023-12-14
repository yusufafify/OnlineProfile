"use client";
import React, { useState } from "react";
import { setEmail } from "@store/slices/emailSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

function ForgetPass() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the Flask backend to add data to the database
      const response = await fetch("http://localhost:8080/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.flag) {
          console.log(result.result["id"]);
          dispatch(setEmail(result.result["email"]));
          router.push(
            `/forgetpassword/newPassword?id=${result.result["id"]}&email=${result.result["email"]}`
          );
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
            <div className="emailBarSlide">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Enter you email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="continueBtnSlide">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Continue &#8680;
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgetPass;
