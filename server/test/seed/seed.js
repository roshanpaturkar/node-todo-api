const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneID = new ObjectID;
const userTwoID = new ObjectID;
const userThreeID = new ObjectID;
const userFourID = new ObjectID;
const users = [{
  _id: userOneID,
  email: 'apple@me.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneID, access: 'auth'}, process.env.JWT_SECRET)
  }]
}, {
  _id: userTwoID,
  email: 'google@me.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneID, access: 'auth'}, process.env.JWT_SECRET)
  }]
}];

const testTodos = [{
  _id: new ObjectID(),
  text: "First test todo",
  _creator: userOneID
},{
  _id: new ObjectID(),
  text: "Second test todo",
  completed: true,
  completedAt: 333,
  _creator: userTwoID
}, {
  _id: new ObjectID(),
  text: "Third test todo",
  completed: true,
  completedAt: 333,
  _creator: userThreeID
}, {
  _id: new ObjectID(),
  text: "Forth test todo",
  completed: true,
  completedAt: 4444,
  _creator:userFourID
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(testTodos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {testTodos, populateTodos, users, populateUsers};
