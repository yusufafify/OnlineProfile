import React from "react";

function PostCard({ post, datetime , handleDelete}) {
  return (
    <div className="activity mb-4 mx-2 pt-2">
      <div
        className="activity border p-4 rounded-xl"
        style={{ border: "3px solid #E8E8E8" }}
      >
        <p className="font-verdana text-xl mb-4">
          <i className="fas fa-comment text-blue-800"></i>
          <span className="ml-2">{post}</span>
        </p>
        <div className="flex justify-end pb-2">
          <span className="mt-5 text-xs text-gray-600 sm:text-sm max-w-2xl text-center">
            {datetime}
          </span>
        </div>
        <div className="flex justify-start">
          <button onClick={handleDelete} className="flex w-fit justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
