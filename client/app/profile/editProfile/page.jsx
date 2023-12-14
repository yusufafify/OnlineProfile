"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  // Check if userId is not null before using it
  const router = useRouter();
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    first_name: data[1] ?? "",
    last_name: data[2] ?? "",
    email: data[3] ?? "",
    phone_number: data[4] ?? "",
    profile_image: "",
    facebook: data[5] ?? "",
    instagram: data[6] ?? "",
    github: data[7] ?? "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    // Implement your logic to save the entries
    console.log("Saving entries:", formData);
    // You can make an API call or perform any other actions here
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
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
          console.error(
            "Error fetching user information:",
            response.statusText
          );
          return;
        }
        const userData = await response.json();

        // Check if userData.data has the expected structure
        if (Array.isArray(userData.data) && userData.data.length >= 8) {
          // Update the formData state
          setFormData({
            first_name: userData.data[1] ?? "",
            last_name: userData.data[2] ?? "",
            email: userData.data[3] ?? "",
            phone_number: userData.data[4] ?? "",
            profile_image: "",
            facebook: userData.data[5] ?? "",
            instagram: userData.data[6] ?? "",
            github: userData.data[7] ?? "",
          });
        } else {
          console.error("Invalid user data structure");
        }
      } catch (error) {
        console.error("Error fetching user information:", error.message);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append the userId to FormData
      formDataToSend.append("userId", userId);

      // Append other form data to FormData
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append the file to FormData
      const fileInput = document.getElementById("profile_image");

      if (fileInput.files.length > 0) {
        formDataToSend.append("profile_image", fileInput.files[0]);
      } else {
        // Handle the case when no file is chosen
        console.log("No file chosen");
        // You can choose to do nothing or handle it based on your requirements
      }

      // Send a PATCH request to the Flask backend to update user data
      const response = await fetch(`http://localhost:8080/api/updateUser`, {
        method: "PATCH",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        Swal.fire({
          title: `${result.flag === true ? "Success" : "Error"}`,
          text: `${
            result.flag === true
              ? "Profile Updated Successfully"
              : `${result.message}`
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
            router.push(`/profile?id=${result.id}&name=${result.name}`);
          }, 2000);
        }
        // Optionally, you can update the list of names after a successful update
      } else {
        const result = await response.json();
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="isolate  px-6 pb-24 sm:pb-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Edit your personal information
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Feel free to edit your personal information
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="first_name"
                id="first_name"
                onChange={handleChange}
                value={formData.first_name}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="last_name"
                id="last_name"
                onChange={handleChange}
                value={formData.last_name}
                autoComplete="family-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                value={formData.email}
                disabled
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone_number"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Phone number
            </label>
            <div className="relative mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="country" className="sr-only">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-2 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                >
                  <option>EG</option>
                </select>
              </div>
              <input
                type="tel"
                name="phone_number"
                id="phone_number"
                autoComplete="tel"
                onChange={handleChange}
                value={formData.phone_number}
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="image"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Upload Profile Photo
            </label>
            <div className="relative mt-2.5">
              <input
                type="file"
                name="profile_image"
                id="profile_image"
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="facebook"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Facebook Link
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="facebook"
                id="facebook"
                onChange={handleChange}
                value={formData.facebook}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="instagram"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Instagram Link
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="instagram"
                id="instagram"
                onChange={handleChange}
                value={formData.instagram}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="github"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Github Link
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="github"
                id="github"
                onChange={handleChange}
                value={formData.github}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            onClick={handleEdit}
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}
