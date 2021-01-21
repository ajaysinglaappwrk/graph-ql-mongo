const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema')
var cors = require('cors')

const app = express();
 app.use(cors())
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ajay_singla:H1PJ64EK1hEB4Eya@cluster0.iimcq.mongodb.net/spincv?retryWrites=true&w=majority')

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.use("/",function(req, res){
    console.log("Create update schema");
    res.send("API is running")
    
})

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