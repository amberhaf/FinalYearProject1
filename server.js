const axios = require('axios');
const chalk = require('chalk');
const config = require('./config');
{/*use express module*/}
const express = require('express');
const path = require('path');
{/*use morgan module*/}
const morgan = require('morgan');
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

require('dotenv').config()

const fileUpload = require('express-fileupload');
// middle ware
// ... other app.use middleware 
if(process.env.NODE_ENV=== 'production')
{
  app.use(express.static(path.join( "client", "build")))
}
else
{
  app.use(express.static('public'));
}
app.use(fileUpload());
// file upload api
app.post('/server/upload', (req, res) => {
  console.log("arrived at server")
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 3001; // Step 1
app.listen(PORT, console.log(`Server is starting at ${PORT}`));