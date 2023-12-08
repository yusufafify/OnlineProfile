import React from "react";

function Home() {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Create and Share
        <br className="max-md:hidden" />
        <span className="blue_gradient text-center">
          Your Own Online Profile
        </span>
      </h1>
      <p className="desc text-center">
        Craft Your Digital Identity! Elevate your online presence with a profile
        that speaks volumes about you. Share feeds, connect with others, and let
        the world see the incredible person you are.
      </p>
    </section>
  );
}

export default Home;
