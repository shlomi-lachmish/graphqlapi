const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
const app = new express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        schema{
            query: RootQuery,
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () =>{
            return Event.find()
            .then(data =>{
                return(data.map(doc=>{
                    console.log(doc._doc);
                    return{...doc._doc, _id: doc._doc._id.toString()};
                }));
            })
            .catch(err=>{
                console.log(err);
                throw err;
            });
        },
        createEvent: (args) =>{
            const event = new Event({
                title : args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date)
            }) 
            console.log(event)
            return event.save().then(data=>{
                console.log(data);
                return {...data._doc, _id: data._doc._id.toString()};

            }).catch(err=>{
                console.log(err);
                throw err;
            });
        } 
    },
    graphiql:true 

}));

console.log(`mongodb://localhost:27017/${process.env.MONGO_DB}`)
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`, {
    useMongoClient: true,
  })
.then(()=>{
    app.listen(3000, ()=>{
        console.log('NodeJS started');
    });
})
.catch(err=>{
    console.log(err);
});