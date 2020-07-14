import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function CatchyPass() {
  const { register, errors, handleSubmit } = useForm();
  const [status, setStatus] = useState(
    "Please enter 0-2 keyword(s). \nIf no input provided, a random result would be generated."
  );

  const onSubmit = async (data) => {
    const keywords = [data.firstKeyword, data.secondKeyword];
    // await axios.post("/api/keywords", { keywords });
    setStatus("Keywords submitted. The result is being processed.");
  };

  console.log(errors);

  const keywordsInput = (nInput) => {
    const indexArray = Array.from(Array(nInput).keys());
    return indexArray.map(function (index) {
      let keywordId = `keyword${index + 1}`;
      return (
        <div className="field" key={keywordId}>
          <input
            type="text"
            placeholder={keywordId}
            name={keywordId}
            ref={register({
              minLength: 2,
              maxLength: 15,
              pattern: /[a-z]+/,
            })}
            className="input is-medium column is-one-quarter"
          />
          <p class="has-text-danger">
            {errors[keywordId]?.type === "minLength" &&
              "Your keyword required to be more than 2 letters"}
          </p>
          <p class="has-text-danger">
            {errors[keywordId]?.type === "maxLength" &&
              "Your keyword required to be less than 15 letters"}
          </p>
          <p class="has-text-danger">
            {errors[keywordId]?.type === "pattern" &&
              "Keyword should only contain lower case letter."}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="has-text-weight-bold">
          Keywords for password generation
        </label>
        {keywordsInput(2)}
        <input type="submit" className="button is-info" />
      </form>
      <div>Status: {status}</div>
    </div>
  );
}
export default CatchyPass;
