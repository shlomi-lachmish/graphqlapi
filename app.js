const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const app = new express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type User{
            _id: ID!
            email: String!
            password: String
        }
        input UserInput {
            email: String!
            password: String!
        }

        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: String!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: String!
        }

        type RootQuery {
            events: [Event!]!
            users: [User!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        schema{
            query: RootQuery,
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(data => {
            return data.map(doc => {
              console.log(doc._doc);
              return { ...doc._doc, _id: doc._doc._id.toString() };
            });
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "5c48053dfb34d53b075598df"
        });
        console.log(event);
        let createdEvent;
        return event
          .save()
          .then(data => {
            createdEvent = { ...data._doc, _id: data._doc._id.toString() };
            console.log(`createdEvent is:  ${JSON.stringify(createdEvent)}`);
            return User.findById("5c48053dfb34d53b075598df").then(user => {
              //console.log(`find the user ${JSON.stringify(user)} and here is ${newObjectId}`);
              user.createdEvents.push(data._doc._id);
              return user.save().then(res => {
                return createdEvent;
              });
              //user._doc.createdEvents.push(createdEvent._id);
            });
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createUser: args => {
        return User.findOne({ email: args.userInput.email }).then(user => {
          if (user) {
            throw "user already exists";
          } else {
            return bcrypt
              .hash(args.userInput.password, 12)
              .then(hashedPass => {
                const user = new User({
                  email: args.userInput.email,
                  password: hashedPass
                });
                return user.save().then(data => {
                  console.log(data);
                  return {
                    ...data._doc,
                    password: null,
                    _id: data._doc._id.toString()
                  };
                });
              })
              .catch(err => {
                throw err;
              });
          }
        });
      }
    },
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
