import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useInterval from "use-interval";
import { CopyToClipboard } from "react-copy-to-clipboard";
import keywordList from "./keywords";

const CatchyPass = () => {
  const { register, errors, handleSubmit } = useForm();
  const nInput = 1;
  const INTERVAL_TIME = 2000;

  const [status, setStatus] = useState(
    `Please enter 0 - ${nInput} keyword(s). \nIf no input provided, a random result would be generated.`
  );
  const [textId, setTextId] = useState(null);
  const [text, setText] = useState("\n");
  const [password, setPassword] = useState("\n");
  const [passwordResult, setPasswordResult] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [intervalTime, setIntervalTime] = useState(INTERVAL_TIME);

  /*
   * Check database regularly
   */
  useInterval(() => {
    if (textId) {
      async function setResult() {
        let res = await axios.post(
          "/api/result",
          {
            _id: textId,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        setText(res.data.textResult || "\n");
        setPasswordResult(res.data.passwordResult || []);

        if (passwordResult.length > 0) {
          document.getElementById("dropdown").classList.remove("is-hidden");
          document.querySelectorAll(".copy-btn").forEach((elem) => {
            elem.classList.remove("is-hidden");
          });

          setStatus("Password result is generated.");
          setIsLoading("");

          setPassword(passwordResult[0]);
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

    setTextId(res.data._id);
    setStatus("Keywords submitted. The result is being processed.");
    setIsLoading("is-loading");

    setText("\n");
    setPassword("\n");
    setIntervalTime(INTERVAL_TIME);
    setPasswordResult([]);
  };

  const onRandomSubmit = async () => {
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
        <div className="field mr-2" key={keywordId}>
          <p className="control">
            <input
              type="text"
              placeholder={keywordId}
              name={keywordId}
              ref={register({
                minLength: 3,
                maxLength: 15,
                pattern: /^[a-z]+$/,
              })}
              className="input"
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
              className="dropdown-item is-active"
              onClick={dropdownItemOnClick}
            >
              Including only letters
            </a>
            <a
              id="password-number"
              href="#"
              className="dropdown-item"
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
    <div className="container mt-2 has-text-centered">
      <div className="has-text-primary has-text-weight-semibold">
        Random Password Generator
      </div>
      <div className="title is-2">Password Generation from Keyword Input</div>
      <div className="subtitle is-5">
        Generate strong and easy-to-remember password based on limericks written
        through the keywords
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="columns is-centered">
          <p className="mr-2 has-text-grey is-size-7">
            Enter keyword(s) here <br />
            to generate password
          </p>
          {keywordsInput(nInput)}
          <button
            id="submit-btn"
            type="submit"
            className={`button is-link ${isLoading} mr-2`}
          >
            Submit
          </button>
          <button
            id="randomly-submit-btn"
            type="button"
            className={`button is-primary ${isLoading} mr-2`}
            onClick={onRandomSubmit}
          >
            Use Random Keywords
          </button>
        </form>
      </div>
      <br />
      <div className="columns is-centered">
        <div className="column is-8">
          <article className="message is-link ">
            <div className="message-header">Limerick Result:</div>
            <div
              id="limerick-result"
              className="message-body columns"
              style={{ whiteSpace: "pre-line" }}
            >
              <div className="column is-11">{text}</div>
              <div className="column is-1">
                <CopyToClipboard text={text}>
                  <button className="copy-btn button is-right is-small is-hidden">
                    <i className="fas fa-copy"></i>
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </article>
        </div>
      </div>
      <br />
      <div className="columns is-centered">
        <div className="column is-8">
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
      <br />
      <div className="columns is-centered ">
        <article className="column is-8 has-text-left message">
          <div className="message-body">
            <p>Note:</p>
            <p>
              - The format of the password is the combination of "keyword input"
              + "the last word of the 1st sentence" + "the last word of the 2nd
              sentence" + "the last word of the 5th sentence". Since, according
              to the format of limericks, the last word of 1st, 2nd and 5th
              sentence rhyme with one another, the password would be easier to
              memorize.
            </p>
            <p>
              - The conversion of characters to number is achieved by
              <a href="https://en.wikipedia.org/wiki/Leet"> Leet</a>, which
              replaces English letter by numbers with similar shape. For
              example, letter "l" is replaced by number "1". The full conversion
              rule could be referred as the following:
              <p>
                <ol
                  type="I"
                  style={{ "list-style-position": "inside" }}
                  className="has-text-centered"
                >
                  <li>a → 4</li>
                  <li>b → 8</li>
                  <li>e → 3</li>
                  <li>g → 6</li>
                  <li>l → 1</li>
                  <li>o → 0</li>
                  <li>r → 2</li>
                  <li>s → 5</li>
                  <li>t → 7</li>
                  <li>z → 2</li>
                </ol>
              </p>
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
export default CatchyPass;
