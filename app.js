const express = require('express');
var request = require('request');
const fs = require('fs')
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema');

// Simple-git without promise 
const simpleGit = require('simple-git')();
// Shelljs package for running shell tasks optional
const shellJs = require('shelljs');
// Simple Git with Promise for handling success and failure
const simpleGitPromise = require('simple-git/promise')();

const createMessage = require('./message')
var cors = require('cors')
var ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT || '3000';
const app = express();
// middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cors())
// const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://ajay_singla:H1PJ64EK1hEB4Eya@cluster0.iimcq.mongodb.net/spincv?retryWrites=true&w=majority')

// mongoose.connection.once('open', () => {
//     console.log('conneted to database');
// });
var dbo;
var MongoClient = require('mongodb').MongoClient;
const url =
  "mongodb+srv://ajay_singla:H1PJ64EK1hEB4Eya@cluster0.iimcq.mongodb.net/spincv?retryWrites=true&w=majority";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  dbo = db.db("spincv");
});

app.use("/getCollection/:page", async function (req, res) {
  let data = await dbo.collection("Pages").find({ page: req.params.page }).toArray();
  res.json(data);

});

app.use("/getAllMediaImages", async function (req, res) {
  let data = await dbo.collection("mediacontent").find({}).toArray();
  res.json(data);

});

app.use("/saveField", async function (req, res) {
  let data = req.body;

  let dataToSave = {};
  data.forEach(element => {
    dataToSave[element.fieldName] = element.fieldValue;
    dataToSave["page"] = element.page;
  });

  dbo.collection("HomePage").insertOne(dataToSave, function (err) {
    if (err) throw err;
    console.log("1 document inserted");
    res.send("Done");
  });

});

app.use("/updateFields/:id", async function (req, res) {
  let data = req.body;

  data.forEach(async (element) => {
    let update = { $set: {} };
    update.$set[element.fieldName] = element.fieldValue;

    await dbo.collection("HomePage").updateOne(
      { _id: ObjectId(req.params.id) }, update);
  });

  res.send("Done");

});



app.use("/getPageData/:page", async function (req, res) {
  let data = await dbo.collection("HomePage").findOne({ page: req.params.page });
  res.json(data);

});

app.use("/disableField", async function (req, res) {
  let data = req.body;
  await dbo.collection("Pages").updateOne(
    { _id: ObjectId(data.id) },
    { $set: { "disabled": data.disable } });
  res.send("Done")

});

app.use("/getAnalyticsSummary", async function (req, res) {
  var options = {
    'method': 'GET',
    'url': 'https://arc-cluster-spincvalpha-ne22bm.searchbase.io/_analytics/jobs/summary',
    'headers': {
      'Authorization': 'Basic ZGQ4M2FlMzQwZDI5OjFjNGYwYTJlLTA2MDktNDU1MS04NDkxLTc5NmU1YTk2NDgzMw=='
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.json(JSON.parse(response.body));
  });

});

app.use("/createCollection", async function (req, res) {
  let data = await dbo.collection("Pages").findOne({ fieldName: req.body.fieldName });

  if (data) {
    res.json(false);
    return false;
  }

  let myObj = {
    fieldName: req.body.fieldName,
    fieldType: req.body.fieldType,
    fieldLabel: req.body.fieldLabel,
    required: req.body.required,
    page: req.body.page
  }
  dbo.collection("Pages").insertOne(myObj, function (err) {
    if (err) throw err;
    console.log("1 document inserted");
    res.json(true);
  });

});

app.use("/createSchema", async function (req, res) {
  let data = await dbo.collection("schemas").findOne({ name: req.body.page.toLowerCase() });
  if (data) {
    res.json(false);
    return false;
  }

  let myObj = {
    name: req.body.page
  }

  dbo.collection("schemas").insertOne(myObj, function (err) {
    if (err) throw err;
    console.log("1 document inserted");
    res.json(true);
  });

});

app.use("/getAllSchema", async function (req, res) {
  let data = await dbo.collection("schemas").find({}).toArray();;
  res.json(data);

});

//This route will be used as an endpoint to interact with Graphql, 
//All queries will go through this route. 
app.use('/graphql', graphqlHTTP({
  //directing express-graphql to use this schema to map out the graph 
  schema,
  //directing express-graphql to use graphiql when goto '/graphql' address in the browser
  //which provides an interface to make GraphQl queries
  graphiql: true
}));

app.use("/createMessage", async function (req, res) {

  shellJs.cd("F:\dataocms\git-testing");
  const repo = 'sample-next-app'; 
  const userName = 'ajaysinglaappwrk';
  const password = 'Appwrk@123';
  // Set up GitHub url like this so no manual entry of user pass needed
  const gitHubUrl = `https://${userName}:${password}@github.com/${userName}/${repo}`;
  // add local git config like username and email
  simpleGit.addConfig('user.email','ajay.singla@appwrk.com');
  simpleGit.addConfig('user.name','Appwrk@123');

  // Add remore repo url as origin to repo
  simpleGitPromise.addRemote('origin', gitHubUrl);
  // Add all files for commit
    simpleGitPromise.add('.')
      .then(
         (addSuccess) => {
            console.log(addSuccess);
         }, (failedAdd) => {
            console.log('adding files failed');
      });
  // Commit files as Initial Commit
   simpleGitPromise.commit('Intial commit by simplegit')
     .then(
        (successCommit) => {
          console.log(successCommit);
       }, (failed) => {
          console.log('failed commmit');
   });
  // Finally push to online repository
   simpleGitPromise.push('origin','master')
      .then((success) => {
         console.log('repo successfully pushed');
      },(failed)=> {
         console.log('repo push failed');
   });
  // fs.writeFile('ftp://waws-prod-yq1-001.ftp.azurewebsites.windows.net/site/wwwroot/ExportedJSX.js', 'My Test content will go here', (err) => {
  //   var aa = err;
  //   res.json(true);

  // })
  // createMessage('myqueue', JSON.stringify(req.body.data));

});
app.use("/", async function (req, res) {
  res.send("API is Running");

});



app.listen(port, () => {
  console.log('Listening on port ' + port);
}); 