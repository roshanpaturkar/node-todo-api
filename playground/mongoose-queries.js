const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5b0d5ecb5991fb22ba40cd51';

// if (!ObjectID.isValid(id)) {
//   console.log('ID is not valid!');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos :', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo :', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found!');
//   }
//
//   console.log('Todo by ID :', todo);
// }).catch((error) => console.log(error));

if (!ObjectID.isValid(id)) {
  console.log('User ID is not valid!');
}

User.findById(id).then((user) => {
  if (!user) {
    return console.log('User ID not found!');
  }

  console.log('Todo by ID :',JSON.stringify(user, undefined, 2));
}).catch((error) => console.log(error));
