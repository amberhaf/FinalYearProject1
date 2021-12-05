const url = require('url');
var fs = require('fs'),
    obj
const axios = require('axios');
const chalk = require('chalk');
const config = require('./config');
const multer = require("multer");
const uploadLocation = multer({ dest: "uploads/" });
{/*use express module*/}
const express = require('express');
{/*use morgan module*/}
const morgan = require('morgan');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(morgan('tiny'));
{/*enable cors*/}
var cors = require('cors')
app.use(cors())

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
};

const request = require('superagent');
require('dotenv').config()

/* Handle LinkedIn OAuth callback and return user profile. */
app.get('/server/linkedIn', function(req, res, next) {
  requestAccessToken(req.query.code,req.query.state)
  .then((response) => {
    console.log("ACCESS TOKEN WOOO"+response.body.access_token)
    requestProfile(response.body.access_token)
    .then(response => {
      console.log(response.body)
      //res.render('callback', { profile: response.body});
    })
  })
  .catch((error) => {
    res.status(500).send(`${error}`)
    console.error(error)
  })
});

function requestAccessToken(code,state) {
  return request.post('https://www.linkedin.com/oauth/v2/accessToken')
    .send('grant_type=client_credentials')
    .send(`client_id=${process.env.EXPRESS_APP_CLIENT_ID}`)
    .send(`client_secret=${process.env.EXPRESS_APP_CLIENT_SECRET}`)
}

function requestProfile(token) {
  console.log("got to request Profile")
  return request.get('https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))')
  .set('Authorization', `Bearer ${token}`)
}

const fileUpload = require('express-fileupload');
// middle ware
app.use(express.static('public')); //to access the files in public folder
app.use(fileUpload());
// file upload api
app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    var response = req.files.myFile.data.toString();
    console.log(response)
      res.writeHead(200, headers);
      res.end(response);
    });
//recieves playlist request using express
app.post('/server/choosePlaylist', function (req, res) {
  console.log(req.body.search+","+req.body.location+","+req.body.country)
  const targetURL = `${config.BASE_URL}/${req.body.country.toLowerCase()}/${config.BASE_PARAMS}&app_id=${config.APP_ID}&app_key=${config.API_KEY}&what=${req.body.search}&where=${req.body.location}`;
    console.log(chalk.green(`Proxy GET request to : ${targetURL}`));
    axios.get(targetURL)
      .then(response => {
        res.writeHead(200, headers);
        res.end(JSON.stringify(response.data));
      })
      .catch(response => {
        console.log(chalk.red(response));
        res.writeHead(500, headers);
        res.end(JSON.stringify(response));
      });
});

const PORT = process.env.PORT || 3001; // Step 1
app.listen(PORT, console.log(`Server is starting at ${PORT}`));