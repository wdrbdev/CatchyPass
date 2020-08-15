import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useInterval from "use-interval";

const CatchyPass = () => {
  const { register, errors, handleSubmit } = useForm();
  const nInput = 1;

  const [status, setStatus] = useState(
    "Please enter 0-2 keyword(s). \nIf no input provided, a random result would be generated."
  );
  const [sentenceId, setSentenceId] = useState(null);
  const [sentence, setSentence] = useState("\n");
  const [password, setPassword] = useState("\n");
  const [isLoading, setIsLoading] = useState("");

  /*
   * Check database regularly
   */
  useInterval(() => {
    if (sentenceId) {
      async function setResult() {
        let res = await axios.post(
          "/api/result",
          {
            _id: sentenceId,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        setSentence(res.data.sentenceResult || "\n");
        if (res.data.passwordResult !== "") {
          setStatus("Password result is generated.");
          setIsLoading("");
          setPassword(res.data.passwordResult || "\n");
        }
      }
      setResult();
    }
  }, 10000);

  /*
   * React Hook Form
   */
  const onSubmit = async (data) => {
    const keywords = [];
    for (let i = 0; i < nInput; i++) {
      let keyword = data[`keyword ${i + 1}`];
      keyword !== "" && keywords.push(keyword);
    }
    const res = await axios.post(
      "/api/keywords",
      { keywords },
      { headers: { "Content-Type": "application/json" } }
    );
    setSentenceId(res.data._id);
    setStatus("Keywords submitted. The result is being processed.");
    setIsLoading("is-loading");
  };

  // console.log(errors);

  const keywordsInput = (nInput) => {
    const indexArray = Array.from(Array(nInput).keys());
    return indexArray.map(function (index) {
      let keywordId = `keyword ${index + 1}`;
      return (
        <div className="field" key={keywordId}>
          <p class="control is-expanded">
            <input
              type="text"
              placeholder={keywordId}
              name={keywordId}
              ref={register({
                minLength: 3,
                maxLength: 15,
                pattern: /[a-z]+/,
              })}
              className="input is-medium column is-half"
            />
          </p>
          <p className="has-text-danger">
            {errors[keywordId]?.type === "minLength" &&
              "Your keyword required to be more than 2 letters"}
          </p>
          <p className="has-text-danger">
            {errors[keywordId]?.type === "maxLength" &&
              "Your keyword required to be less than 15 letters"}
          </p>
          <p className="has-text-danger">
            {errors[keywordId]?.type === "pattern" &&
              "Keyword should only contain lower case letter."}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="container">
      <div className="columns">
        <div className="column mt-2">
          <div className="title is-3">Keywords for password generation</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {keywordsInput(nInput)}
            <button type="submit" className={`button is-info ${isLoading}`}>
              Submit
            </button>
          </form>
        </div>

        <div className="column mt-2">
          <div>
            <article className="message">
              <div className="message-header">Status:</div>
              <div className="message-body">{status}</div>
            </article>
          </div>
          <br />
          <div>
            <article className="message is-link">
              <div className="message-header">Limerick Result:</div>
              <div
                className="message-body"
                style={{ "white-space": "pre-line" }}
              >
                {sentence}
              </div>
            </article>
          </div>
          <br />
          <div>
            <article className="message is-link">
              <div className="message-header">Password Result:</div>
              <div
                className="message-body"
                style={{ "white-space": "pre-line" }}
              >
                {password}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CatchyPass;
