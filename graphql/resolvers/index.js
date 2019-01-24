const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const events = evenIds => {
  return Event.find({ _id: { $in: evenIds } })
    .then(events => {
      return events.map(event => {
        return { ...event._doc, creator: user.bind(this, event._doc.creator) };
      });
    })
    .catch(err => {
      throw err;
    });
};

const user = userId => {
  return User.findById(userId)
    .then(userObj => {
      return {
        ...userObj._doc,
        createdEvents: events.bind(this, userObj._doc.createdEvents)
      };
    })
    .catch(err => {
      throw err;
    });
};
module.exports = {
  events: () => {
    return Event.find()
      .then(data => {
        return data.map(doc => {
          console.log(doc._doc);
          return {
            ...doc._doc,
            _id: doc._doc._id.toString(),
            date: new Date(doc._doc.date).toISOString(),
            creator: user(doc._doc.creator)
          };
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
          user.createdEvents.push(data._doc._id);
          return user.save().then(res => {
            return createdEvent;
          });
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
};
