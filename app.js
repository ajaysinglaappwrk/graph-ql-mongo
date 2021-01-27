const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema')
var cors = require('cors')
var ObjectId = require('mongodb').ObjectID;

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
  //Create a collection name "customers":
  // dbo.createCollection("HomePage", function (err, res) {
  //   if (err) throw err;
  //   console.log("Collection created!");
  //   db.close();
  // });

  // var myobj = { name: "APPWRK IT SOLUTIONS PVT LTD.", address: "Chandigarh, India", contact:"9416269166" };
  // dbo.collection("customers").insertOne(myobj, function(err, res) {
  //   if (err) throw err;
  //   console.log("1 document inserted");
  //   db.close();
  // });
});

app.use("/getCollection", async function (req, res) {
  let data = await dbo.collection("Pages").find({}).toArray();
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
    var update = { $set: {} };
    update.$set[element.fieldName] = element.fieldValue;

    await dbo.collection("HomePage").updateOne(
      { _id: ObjectId(req.params.id) }, update);

    // dataToSave[element.fieldName] = element.fieldValue;
    // dataToSave["page"] = element.page;
  });

  res.send("Done");

});

app.use("/getPageData", async function (req, res) {
  var data = await dbo.collection("HomePage").findOne({ page: 'Home' });
  res.send(data);

});

app.use("/disableField", async function (req, res) {
  let data = req.body;
  await dbo.collection("Pages").updateOne(
    { _id: ObjectId(data.id) },
    { $set: { "disabled": data.disable } });
  res.send("Done")

});

app.use("/createCollection", function (req, res) {

  // dbo.createCollection("Pages", function (err, res) {
  //   if (err) throw err;
  //   console.log("Collection created!");
  //   db.close();
  // });

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
    res.send("Done");
  });

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


app.listen(3000, () => {
  console.log('Listening on port 3000');
}); 