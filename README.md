# CatchyPass

Web Application for Strong and Catchy Password Generation from Keyword Input through Natural Language Generation

> Note: It is my MSc dissertation project and if you are interested in it, please feel free to contact me for the digital copy of my dissertation. It was deployed on [catchypass.me](http://catchypass.me) while it is currently offline due to limited budget.

## Contents

- [Abstract](#abstract)
- [Objective](#objective)
- [About Password Strength](#about-password-strength)
- [System Design](#system-design)
  - [System Architecture](#system-architecture)
  - [Technologies](#technologies)
  - [Sequence Diagram for NLG process](#sequence-diagram-for-nlg-process)
- [CI/CD Workflow](#cicd-workflow)
- [User Flow](#user-flow)
- [Screenshot](#screenshot)

## Abstract

The more passwords applied in our daily life, the more we need an efficient way to generate passwords for different online services. Utilizing password generator is one of the most efficient ways to generate passwords. The common passwords generated consists of the combination of random characters e.g. “0[n)zRL{”. While the password is strong, it is not memorable and usable. This project is to implement a web application named CatchyPass to address the usability issue. By generating passphrase instead of password, it could be easier to type and memorize. Furthermore, mnemonic in the form of text is applied to aid memorization. A catchy text with rhyming would be generated along with the password and limerick is chosen for its strict rhyming scheme. For limerick generation, natural language generation (NLG) techniques would be implemented. It takes keywords from users as the input to generate customized limerick as the output. Users could better memorize the password with the help of the limerick. Besides implementing web applications and NLG techniques, real-world software development methodologies would be applied in the project to facilitate development and production, including version control, cloud deployment and automation testing as well as continuous integration and continuous delivery (CI/CD) workflow. 

## Objective

The goal of this project is to develop a web application for random password generation by keyword input. The passwords generated would have high usability without compromising the password strength. The NLG techniques would be applied to generate catchy text according to the keyword input, which could assist users to memorize the passwords. The goal is also to learn and apply real-world development processes and machine learning techniques for NLG.

## About Password Strength

Traditionally, passwords are recommended to be created with fully random letters, numbers and special l, such as “!T7m@C:#”. While the password is strong, it is almost impossible to memorize. When forgetting passwords and rejected by online services, users often feel frustrated and choose very simplified and predictable passwords instead, resulting in more vulnerable passwords. The drawback for such rule outweighs its benefits. To address this issue, the National Institute of Standards and Technology (NIST) advocates memorable passwords in the new guideline (SP 800-63B). It recommends less complex but still lengthy and random passwords to increase password usability while maintaining strength. One way to achieve this is by the combination of more than 4 random vocabularies. It could be easier to memorize while preserving the length and randomness of the passwords. The rule is illustrated as webcomics by [XKCD](https://xkcd.com/936/) in the following figure.

![Correct horse battery staple comics by XKCA](https://imgs.xkcd.com/comics/password_strength.png)

Other information could be referred to as the following links:

- [BBC News - Password guru regrets past advice](https://www.bbc.com/news/technology-40875534)
- [Correct horse battery staple: Exploring the usability of system-assigned passphrases](http://cups.cs.cmu.edu/rshay/pubs/shay2012correct.pdf)
- [NIST Special Publication 800-63B: Appendix A—Strength of Memorized Secrets](https://pages.nist.gov/800-63-3/sp800-63b.html#appA)

## System Design

##### System Architecture

The web application is designed as n-tier architecture that consists of multiple stand-alone and containerized applications as illustrated below. The architecture not only increases the scalability and flexibility of the whole system and each component but also facilitates development and deployment. All components are managed by Kubernetes, the container-orchestration system, to achieve high flexibility and portability. The system could be horizontally scaled out and deployed in any cloud infrastructure effortlessly.

![system architecture](https://github.com/wdrbdev/CatchyPass/blob/master/doc/img/system_architecture.png?raw=true)

##### Technologies

- Frontend framework: React
- CSS framework: Bulma
- Backend framework: Node.js & Express
- Database: MongoDB
- Message system: Redis Pub/Sub
- Worker application for NLG: Python with GPT-2
- CI platform: Google Cloud Build
- Deployment: Google Cloud Platform (GCP)

##### Sequence Diagram for NLG process

NLG is performed in the worker application. When receiving keyword input from the frontend server, the backend server would dispatch the keywords to the worker through message queuing. The worker would then generate a limerick by applying the pre-trained text generation model. The result would be dispatch to the backend server and generate a password accordingly. The interaction and operation between components are illustrated as sequence diagram below.
![sequence diagram](https://github.com/wdrbdev/CatchyPass/blob/master/doc/img/sequence_diagram.png?raw=true)

## CI/CD Workflow

The CI/CD workflow is applied to facilitate development and deployment as well as to simulate real-world development procedures. When introducing new features, build and test are automatically triggered and executed on the serverless CI/CD platform of Cloud Build on Google Cloud Platform (GCP). After a successful build and passing all tests and quality assurance, the new version would be deployed on the production environment. Therefore, bugs and errors would be minimized and product feature velocity would be increased. 

After a new feature is developed in the local development environment, it would go through three environments, including test, staging and production, before it becomes available for end users. All configurations of CI/CD are set in the “cloudbuild” directory for all three environments. The CI/CD workflow applied in this project is illustrated below.

![ci/cd workflow](https://github.com/wdrbdev/CatchyPass/blob/master/doc/img/cicd_workflow.png?raw=true)

## User Flow

The user flow is presented below to demonstrate how users could utilize CatchyPass. It contains a sequence of steps which users take to generate passwords or explore different pages. After navigating to the homepage on catchypass.me, the user could see a navigation bar as the header containing links to each page and a form for password generation as shown in the screenshot section. The user could generate passwords on the homepage. Otherwise, if users would like to know more about CatchyPass, they could navigate to the tutorial page to understand how to utilize CatchyPass or to the about page to see more information about CatchyPass by clicking links in the navigation bar. 
(link: https://github.com/wdrbdev/CatchyPass/blob/master/doc/img/user_flow.png )
![user flow](https://github.com/wdrbdev/CatchyPass/blob/master/doc/img/user_flow.png?raw=true) 

## Screenshot

To generate passwords, users could utilize the form on the homepage. It contains one input field for keyword input and two buttons, which are the “submit” button and “use random keywords” button. After entering the keywords, users could click the “submit” button to generate passwords according to the input. For example, if users enter “flower” as keyword input, the result containing both a limerick and password. Otherwise, if the users choose not to enter any keyword, they could click the “use random keyword” button. The system would fill random keywords into the input field and generate passwords accordingly.

- Home page: Users can enter keywords to generate both limerick and password.

![homepage](https://github.com/wdrbdev/CatchyPass/blob/master/doc/img/screenshot_homepage.png?raw=true)

- Password result from NLG after entering keyword "flower" and clicking the submit button.

![password result](https://github.com/wdrbdev/CatchyPass/blob/master/doc/img/screenshot_result.png?raw=true)

