const axios = require('axios');
const chalk = require('chalk');
require('dotenv').config();
const config = require('./config');

{/*use express module*/}
const express = require('express');
{/*use morgan module*/}
const morgan = require('morgan');
const path = require('path');
const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
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

function getTotalSalary(tot, obj) {
  //add the min and max salary returned in result
  return tot + obj.salary_min + obj.salary_max;
} 

const fileUpload = require('express-fileupload');
// middle ware
// ... other app.use middleware 

app.use(fileUpload());
// way to process files uploaded
app.post('/server/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    var response = req.files.myFile.data.toString();
      res.writeHead(200, headers);
      res.end(response);
    });
//recieves results that match search term from adzunna api
app.post('/server/getSalary', function (req, res) {
  console.log(req.body.search+","+req.body.location+","+req.body.country)
  const targetURL = `${config.BASE_URL}/${req.body.country.toLowerCase()}/${config.BASE_PARAMS}&app_id=${config.APP_ID}&app_key=${config.API_KEY}&what=${req.body.search}&where=${req.body.location}`;
    console.log(chalk.green(`Proxy GET request to : ${targetURL}`));
    axios.get(targetURL)
      .then(response => {
        //sum everything and divide by twice the length as both min and max are returned
        return response.data.results
      })
      .then(results => {
        //sum everything and divide by twice the length as both min and max are returned
        return (results.reduce(getTotalSalary, 0.0))/ (results.length * 2);;
      })
      .then( sum => {
        //round and convert from pounds to euros
        return avg = (Math.round(sum * 119)) / 100;
      })
      .then(data => {
        res.writeHead(200, headers);
        res.end(JSON.stringify(data));
      })
      .catch(response => {
        console.log(chalk.red(response));
        res.writeHead(500, headers);
        res.end(JSON.stringify(response));
      });
});

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
const PORT = process.env.PORT || 5000; // Step 1
app.listen(PORT, console.log(`Server is starting at ${PORT}`));