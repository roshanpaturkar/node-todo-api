const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

//Todo.findeOneAndRemove
//Todo.findByIdAndRemove

Todo.findeOneAndRemove({_id: '5b0e95c8ebb0601e97399d3d'}).then((doc) => {
  console.log(doc);
});

Todo.findByIdAndRemove('5b0e95c8ebb0601e97399d3d').then((doc) => {
  console.log(doc);
});
