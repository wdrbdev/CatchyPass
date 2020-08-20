import React from "react";

const About = () => {
  return (
    <div className="container">
      <div className="mt-2">
        <div id="about-title" className="title is-3">
          CatchyPass - About
        </div>
        <div className="is-size-5">
          A web application for strong and catchy password generation from
          keyword input with natural language processing. The goal of the app is
          to generate a strong password with an easy-to-remember limerick
          according to keywords provided by the user to enhance password
          usability while preserving password strength.
        </div>
      </div>
    </div>
  );
};

export default About;
