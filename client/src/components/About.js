import React from "react";

const About = () => {
  return (
    <section class="section px-1 py-1">
      <div className="container">
        <div className="mt-2">
          <div id="about-title" className="title is-2">
            CatchyPass - About
          </div>
          <div className="title is-4 mb-3">About CatchyPass</div>
          <div className="is-size-5">
            CatchyPass is a random password generator for strong and catchy
            password generation from keyword input with natural language
            processing. The goal of the app is to generate a strong password
            with an easy-to-remember limerick according to keywords provided by
            the user to enhance password usability while preserving password
            strength.
          </div>
          <br />
          <div className="title is-4 mb-3">About Password Strength</div>
          <div className="is-size-5">
            Traditionally, passwords are recommended to be created with fully
            random letters, numbers and special l, such as “!T7m@C:#”. While the
            password is strong, it is almost impossible to memorize. When
            forgetting passwords and rejected by online services, users often
            feel frustrated and choose very simplified and predictable passwords
            instead, resulting in more vulnerable passwords. The drawback for
            such rule outweighs its benefits. To address this issue, the
            National Institute of Standards and Technology (NIST) advocates
            memorable passwords in the new guideline (SP 800-63B). It recommends
            less complex but still lengthy and random passwords to increase
            password usability while maintaining strength. One way to achieve
            this is by the combination of more than 4 random vocabularies. It
            could be easier to memorize while preserving the length and
            randomness of the passwords. The rule is illustrated as webcomics by{" "}
            <a href="https://xkcd.com/936/">XKCA</a> in the following figure.
          </div>
          <div className="columns is-centered">
            <img
              src="https://imgs.xkcd.com/comics/password_strength.png"
              alt="Correct horse battery staple comics by XKCA"
              className="column is-half"
            />
          </div>
          <br />
          <div className="is-size-5">
            Other information could be referred to the following links:
          </div>
          <ol
            type="1"
            style={{
              "list-style-position": "inside",
            }}
            className="is-size-5"
          >
            <li>
              <a href="https://www.bbc.com/news/technology-40875534">
                BBC News - Password guru regrets past advice
              </a>
            </li>
            <li>
              <a href="http://cups.cs.cmu.edu/rshay/pubs/shay2012correct.pdf">
                Correct horse battery staple: Exploring the usability of
                system-assigned passphrases
              </a>
            </li>
            <li>
              <a href="https://pages.nist.gov/800-63-3/sp800-63b.html">
                NIST Special Publication 800-63B
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default About;
