import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useInterval from "use-interval";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as fs from "fs";

const CatchyPass = () => {
  const { register, errors, handleSubmit } = useForm();
  const nInput = 1;
  const INTERVAL_TIME = 2000;

  const [status, setStatus] = useState(
    "Please enter 0-2 keyword(s). \nIf no input provided, a random result would be generated."
  );
  const [sentenceId, setSentenceId] = useState(null);
  const [sentence, setSentence] = useState("\n");
  const [password, setPassword] = useState("\n");
  const [passwordResult, setPasswordResult] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [intervalTime, setIntervalTime] = useState(INTERVAL_TIME);

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
        setPasswordResult(res.data.passwordResult || []);

        if (passwordResult.length > 0) {
          document.getElementById("dropdown").classList.remove("is-hidden");
          document.querySelectorAll(".copy-btn").forEach((elem) => {
            elem.classList.remove("is-hidden");
          });

          setStatus("Password result is generated.");
          setIsLoading("");

          setPassword(passwordResult[1]);
          setIntervalTime(null); // Stop checking database regularly
        }
      }
      setResult();
    }
  }, intervalTime);

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
    document.getElementById("dropdown").classList.add("is-hidden");
    document.getElementById("dropdown").classList.remove("is-active");
    document.querySelectorAll(".copy-btn").forEach((elem) => {
      elem.classList.add("is-hidden");
    });
    document.getElementById("dropdown-info").innerHTML =
      "Select password types";

    setSentenceId(res.data._id);
    setStatus("Keywords submitted. The result is being processed.");
    setIsLoading("is-loading");

    setSentence("\n");
    setPassword("\n");
    setIntervalTime(INTERVAL_TIME);
    setPasswordResult([]);
  };

  const onRandomSubmit = async () => {
    const keywordPath = process.env.PUBLIC_URL + "/keywords.txt";
    const keywordList = await fs.readFileSync(keywordPath, "utf-8").split("\n");

    let randomKeyword = "";
    for (let i = 0; i < nInput; i++) {
      randomKeyword =
        keywordList[Math.floor(Math.random() * keywordList.length)];
      document.querySelector(
        `input[name="keyword ${i + 1}"]`
      ).value = randomKeyword;
    }
    document.getElementById("submit-btn").click();
  };

  const keywordsInput = (nInput) => {
    const indexArray = Array.from(Array(nInput).keys());
    return indexArray.map(function (index) {
      let keywordId = `keyword ${index + 1}`;
      return (
        <div className="field" key={keywordId}>
          <p className="control is-expanded">
            <input
              type="text"
              placeholder={keywordId}
              name={keywordId}
              ref={register({
                minLength: 3,
                maxLength: 15,
                pattern: /^[a-z]+$/,
              })}
              className="input is-medium column is-half"
            />
          </p>
          <p className="has-text-danger">
            {errors[keywordId]?.type === "minLength" &&
              "Your keyword required to be more than 3 letters"}
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

  const dropdown = () => {
    const dropdownBtnOnClick = () => {
      document.querySelector(".dropdown").classList.toggle("is-active");
    };
    const dropdownItemOnClick = (event) => {
      const sourceId = event.target.id;
      let pswIndex = 1;
      switch (sourceId) {
        case "password-uppercase":
          pswIndex = 0;
          break;
        case "password-number":
          pswIndex = 1;
          break;
        case "password-character":
          pswIndex = 2;
          break;
      }

      document.getElementById(
        "dropdown-info"
      ).innerHTML = document.getElementById(sourceId).innerHTML;
      ["password-uppercase", "password-number", "password-character"].map(
        (pswId) => {
          document.getElementById(pswId).classList.remove("is-active");
        }
      );
      document.getElementById(sourceId).classList.add("is-active");
      setPassword(passwordResult[pswIndex]);
      dropdownBtnOnClick();
    };

    return (
      <div className="dropdown is-right">
        <div className="dropdown-trigger" onClick={dropdownBtnOnClick}>
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span id="dropdown-info">Select password types</span>
            <span className="icon is-small">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <a
              id="password-uppercase"
              href="#"
              className="dropdown-item"
              onClick={dropdownItemOnClick}
            >
              Including only letters
            </a>
            <a
              id="password-number"
              href="#"
              className="dropdown-item is-active"
              onClick={dropdownItemOnClick}
            >
              Including numbers
            </a>
            <a
              id="password-character"
              href="#"
              className="dropdown-item"
              onClick={dropdownItemOnClick}
            >
              Including special characters
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="columns">
        <div className="column mt-2">
          <div className="title is-3">Keywords for password generation</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {keywordsInput(nInput)}
            <button
              id="submit-btn"
              type="submit"
              className={`button is-info ${isLoading}`}
            >
              Submit
            </button>
            <button
              id="randomly-submit-btn"
              type="button"
              className={`button is-primary ${isLoading}`}
              onClick={onRandomSubmit}
            >
              Use Random Keywords
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
                id="limerick-result"
                className="message-body columns"
                style={{ whiteSpace: "pre-line" }}
              >
                <div className="column is-11">{sentence}</div>
                <div className="column is-1">
                  <CopyToClipboard text={sentence}>
                    <button className="copy-btn button is-right is-small is-hidden">
                      <i className="fas fa-copy"></i>
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
            </article>
          </div>
          <br />
          <div>
            <article className="message is-link">
              <div className="message-header">
                Password Result:
                <span id="dropdown" className="is-hidden">
                  {dropdown()}
                </span>
              </div>
              <div
                id="psw-result"
                className="message-body"
                style={{ whiteSpace: "pre-line" }}
              >
                <div id="password" className="columns">
                  <div className="column is-11">{password}</div>
                  <div className="column is-1">
                    <CopyToClipboard text={password}>
                      <button className="copy-btn button is-right is-small is-hidden">
                        <i className="fas fa-copy"></i>
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CatchyPass;
