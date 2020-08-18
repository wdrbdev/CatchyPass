import React from "react";

const Tutorial = () => {
  return (
    <div className="container">
      <div className="mt-2">
        <div className="title is-3">CatchyPass - Tutorial</div>
        <div className="is-size-5">
          <p>
            Users could type keyword input and press the submit button to
            generate limerick and password relative to keyword input. Also,
            users could choose not to submit keywords and use the keywords
            randomly provided by the system to generate random passwords.
          </p>
          <p>
            There are 3 types of password formats:
            <ol style={{ "list-style-position": "inside" }}>
              <li>
                Password only contains upper-case and lower-case english
                letters.
              </li>
              <li>Password contains numbers and english letters. (default)</li>
              <li>
                Password contains special characters, numbers and english
                letters.
              </li>
            </ol>
            User could choose their preferred formats by clicking the dropdown
            menu in the password result section.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
