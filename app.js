const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema')
var cors = require('cors')

const app = express();
app.use(cors())
// const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://ajay_singla:H1PJ64EK1hEB4Eya@cluster0.iimcq.mongodb.net/spincv?retryWrites=true&w=majority')

// mongoose.connection.once('open', () => {
//     console.log('conneted to database');
// });

var MongoClient = require('mongodb').MongoClient;
const url =
  "mongodb+srv://ajay_singla:H1PJ64EK1hEB4Eya@cluster0.iimcq.mongodb.net/spincv?retryWrites=true&w=majority";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("spincv");
  //Create a collection name "customers":
  // dbo.createCollection("HomePage", function (err, res) {
  //   if (err) throw err;
  //   console.log("Collection created!");
  //   db.close();
  // });

  var myobj = { name: "APPWRK IT SOLUTIONS PVT LTD.", address: "Chandigarh, India", contact:"9416269166" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});

app.use("/create", function (req, res) {
    console.log("Create update schema");

     var Schema = mongoose.Schema;
    var thingSchema = new Schema({}, { strict: false, collection: 'mycollection' });

    //strict, if true then values passed to our model constructor that were not specified in our schema do not get saved to the db.
   //collection, for prevent from auto append 's'.
   
   var Thing = mongoose.model('mycollection', thingSchema);
   var obj={
       name:"ajay singla"
   }
   var thing = new Thing(obj);
   thing.save();

  

    // var SomeModelSchema = new Schema({
    //     a_string: String,
    // });

    // // Compile model from schema
    //  var SomeModel =    mongoose.model('SomeModel', SomeModelSchema, "SomeModel");

    // let modelToSave = new SomeModel({
    //     a_string: "ajay singla",
    // })
    // modelToSave.save()

    res.send("API is running")

})



// //This route will be used as an endpoint to interact with Graphql, 
// //All queries will go through this route. 
// app.use('/graphql', graphqlHTTP({
//     //directing express-graphql to use this schema to map out the graph 
//     schema,
//     //directing express-graphql to use graphiql when goto '/graphql' address in the browser
//     //which provides an interface to make GraphQl queries
//     graphiql: true
// }));


app.listen(3000, () => {
    console.log('Listening on port 3000');
}); 