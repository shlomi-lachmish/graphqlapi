const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  login: ({ email, password }) => {
    return User.findOne({ email: email })
      .then(user => {
        if (!user) {
          throw new Error("User doesn't exists");
        }
        return bcrypt
          .compare(password, user.password)
          .then(isEquel => {
            if (!isEquel) {
              throw new Error("Password doesn't match");
            }
            //let's create a jwt
            const token = jwt.sign(
              { userId: user.id, email: user.email },
              "******",
              {
                expiresIn: "1h"
              }
            );
            return { userId: user.id, token: token, tokenExpieration: 1 };
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  },
  bookings: () => {
    return Booking.find()
      .then(bookings => {
        return bookings.map(booking => {
          const created_at = new Date(booking._doc.createdAt).toISOString();
          return User.findById(booking._doc.user)
            .then(user => {
              return Event.findById(booking._doc.event)
                .then(event => {
                  return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user,
                    event: event,
                    createdAt: created_at
                  };
                })
                .catch(err => {
                  throw `find Booking err: ${err}`;
                });
            })
            .catch(err => {
              throw `find Booking err: ${err}`;
            });
        });
      })
      .catch(err => {
        throw `find Booking err: ${err}`;
      });
  },
  events: () => {
    return Event.find()
      .then(data => {
        return data.map(doc => {
          //console.log(doc._doc);
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
  createEvent: (args, req) => {
    if (!req.isAuth) {
      console.log(`No auth! ${req.isAuth}`);
      throw new Error("No Auth");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId
    });
    let createdEvent;
    return event
      .save()
      .then(data => {
        createdEvent = { ...data._doc, _id: data._doc._id.toString() };
        return User.findById(req.userId).then(user => {
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
              //   console.log(data);
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
  },

  cancelBooking: args => {
    return Booking.findById(args.bookingId)
      .then(booking => {
        return Event.findOne({ _id: booking.event }).then(event => {
          Booking.deleteOne({ _id: args.bookingId }).catch(err => {
            throw err;
          });
          return event;
        });
      })
      .catch(err => {
        throw err;
      });
  },
  bookEvent: args => {
    return Event.findOne({ _id: args.eventId })
      .then(event => {
        const booking = new Booking({
          user: req.userId,
          event: { ...event._doc, _id: event.id }
        });
        console.log(booking._doc);
        return booking
          .save()
          .then(savedBooking => {
            return { ...savedBooking._doc };
          })
          .catch(err => {
            throw `save booking err: ${err}`;
          });
      })
      .catch(err => {
        throw `find booking err: ${err}`;
      });
  }
};
