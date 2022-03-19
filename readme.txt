Hosted at: http://careerpathmapper.herokuapp.com/
(a) Installation and Setup: 

Background:
Outer folder FinalYearProject1 contains back end. FinalYearProject1/server.js contains the endpoints to estimate salary and process a JSON file upload. 
Inner folder FinalYearProject1/client contains the front end written in React.
FinalYearProject1/client/App.js outlines the public and private routes accessible depending on whether the user is authenticated. 
Each page is contained in FinalYearProject1/client/pages folder and make use of components from FinalYearProject1/client/components folder. 
Database is configured in FinalYearProject1/services/firebase.js and login functionality is helped by FinalYearProject1/helper/auth. 
Every page uses the navbar component at FinalYearProject1/client/components/Header.js provides the navbar to every page. 
FinalYearProject1/client/components/setupProxy.js prevents requests between front end and back end 

Prerequisites:
NodeJS version: 16.13.2
Checkout the project from Github to a local folder

$ git clone https://github.com/amberhaf/FinalYearProject1

Install module dependencies:
Using your command prompt. Navigate to FinalYearProject1

$ npm install

This will install the following dependencies specified in the FinalYearProject1/package.json file.
 
Navigate to FinalYearProject1/client/

$ npm install

This will install the following dependencies specified in the FinalYearProject1/client/package.json file.
 
Steps to Run:

Navigate to FinalYearProject1/

Install the following dependencies to simultaneously run the client and the server and auto restart the server as you make changes.

$ npm install nodemon
$ npm install concurrently

Start both the client and server with one command.

$ npm run dev.
 
