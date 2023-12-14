"use client";
// RightColumn.jsx
import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import PostCard from "./PostCard";
import Swal from "sweetalert2";

const RightColumn = ({ userid }) => {
  const [postData, setPostData] = useState({
    id: userid,
    post: "",
  });
  const [posts, setPosts] = useState([]);

  const createPost = async (text) => {
    setPostData({
      id: userid,
      post: text,
    });

    try {
      const response = await fetch("http://localhost:8080/api/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userid,
          post: text,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message); // Log the success message

        // Trigger a GET request to retrieve posts after creating a new post
        await fetch(`http://localhost:8080/api/getPost?id=${userid}`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            setPosts(data.posts); // Use spread operator to merge the arrays
          });
      } else {
        const errorData = await response.json();
        console.error(errorData.error); // Log the error message
        // Handle the error or show an error message to the user
      }
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle the error or show an error message to the user
    }
  };

  useEffect(() => {
    // Call the getPost API when the component mounts
    fetch(`http://localhost:8080/api/getPost?id=${userid}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
      });
  }, [userid]);

  const handleCreatePost = () => {
    Swal.fire({
      input: "textarea",
      inputLabel: "Post",
      inputPlaceholder: "Type your Post here...",
      inputAttributes: {
        "aria-label": "Type your Post here",
      },
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const text = result.value;

        // Call the createPost function with the obtained text
        createPost(text);

        // Optionally, show another SweetAlert to inform the user
        Swal.fire({
          icon: "success",
          title: "Post Created",
          text: "Your post has been created successfully!",
        });
      }
    });
  };
  // Function to format datetime string to readable date and time
  const formatDatetime = (datetimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(datetimeString).toLocaleDateString("en-US", options);
  };

  const handleDelete = async (post) => {
    // Show the confirmation modal
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    // Check the result of the confirmation modal
    if (result.isConfirmed) {
      try {
        // Perform the delete operation
        await fetch(`http://localhost:8080/api/deletePost?postid=${post[0]}`, {
          method: "DELETE",
        });

        // Update the state to remove the deleted post
        const filteredPosts = posts.filter((p) => p[0] !== post[0]);
        setPosts(filteredPosts);

        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "Your Post has been deleted.",
          icon: "success",
        });
      } catch (error) {
        console.log(`Deleting Prompt Error: ${error}`);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Show cancellation message
      Swal.fire({
        title: "Cancelled",
        text: "Your Post is safe :)",
        icon: "error",
      });
    }
  };

  return (
    <div className="right-column">
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-2xl blue_gradient font-bold tracking-tight text-gray-900">
          <i className="fas fa-solid fa-pen text-blue-800"></i>
          <span className="ml-2"> Posts </span>
        </h3>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Hey there! 👋 This is a space for sharing thoughts, activities, and
          experiences. Share your thoughts and let's build a vibrant community
          together. Your perspective matters!
        </p>
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
            What’s on your mind?
          </h4>
          <div className="h-px flex-auto bg-gray-100" />
          <button
            onClick={handleCreatePost}
            className="flex w-fit justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create a Post
          </button>
        </div>
        {/* Map over the posts array and render PostCard for each post */}
        {Array.isArray(posts) &&
          posts.map((post) => (
            <PostCard
              key={post[0]}
              post={post[1]}
              datetime={formatDatetime(post[2])} // Format the datetime
              handleDelete={() => handleDelete(post)} // Pass a function reference
            />
          ))}
      </div>
    </div>
  );
};

export default RightColumn;
