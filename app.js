const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const mongoose = require("mongoose");
const isAuth = require("./middleware/isAuth");

const app = new express();

app.use(isAuth);
app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose.Promise = global.Promise;
mongoose
  .connect(
    `mongodb://localhost:27017/${process.env.MONGO_DB}`,
    {
      useMongoClient: true
    }
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("NodeJS and DB started");
    });
  })
  .catch(err => {
    console.log(err);
  });
