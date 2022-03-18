Prerequisites:
NodeJS version: 16.13.2
Checkout the project from Github to a local folder
$ git clone https://github.com/amberhaf/FinalYearProject1
Optional:  
Alter .env files to include your own credentials for a Firebase Console and Adzuna API.
Install module dependencies:
Using your command prompt. Navigate to the folder where you checked out the project. 
$ npm install
This will install the following dependencies specified in the servers package.json file.
 
Navigate to FinalYearProject1/client/
$ npm install
This will install the following dependencies specified in the clients package.json file.
 
Steps to Run:
Navigate to the outer project folder. 
Install the following dependencies to simultaneously run the client and the server and auto restart the server as you make changes.
$ npm install nodemon
$ npm install concurrently
Start both the client and server with one command.
$ npm run dev.
 
