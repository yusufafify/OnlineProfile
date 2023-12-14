"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

function Signin() {
  //Testing the requests of the sign in form

  const router = useRouter();
  //creating a states for the name and the form data which contains email and password
  const [names, setNames] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //function that handle the changes of the input tags
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  //Function that handle the submit of the form to send the wanted HTTP request to the backend endpoint
  const handleSubmit = async (e) => {
    //prevent the default behavior of the form to refresh the page after submitting
    e.preventDefault();

    //a try and catch method to try sending the request to the api endpoint and if there is an error it will be caught
    try {
      // Send a POST request to the Flask backend to add data to the database
      const response = await fetch("http://localhost:8080/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Setting localStorage items:", result.id, formData.email, result.fname);
        localStorage.setItem("loggedInEmail", formData.email);
        localStorage.setItem("loggedInId", result.id);
        localStorage.setItem("loggedInUserName", result.fname);
        console.log("Items set successfully");
        console.log(result.message);
        Swal.fire({
          title: `${result.flag === true ? "Success" : "Error"}`,
          text: `${
            result.flag === true ? "Welcome Back" : `${result.message}`
          }`,
          icon: `${result.flag ? `success` : `error`}`,
          showConfirmButton: !result.flag,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: `${
            result.flag ? `Go Back to Log-in page` : `Try again`
          }`,
          timer: 2000,
        });
        // Add the timer only if the condition is met
        if (!result.flag) {
          Swal.stopTimer();
        }
        if (result.flag) {
          console.log(result.id);
          setTimeout(() => {
            router.push(`/profile?id=${result.id}&name=${result.fname}`);
          }, 2000);
        }

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
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    href={"/forgetpassword"}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              href={"/register"}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              register Now!
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signin;
