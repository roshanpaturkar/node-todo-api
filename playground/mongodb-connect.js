// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj.getTimestamp());

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {    //these will not working with latest beta versions
// MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, db) => {
  if (error) {
    return console.log('Unable to connect mongodb server.', error);
  }
  console.log('Connected to mongodb server.');

  // db.collection('Todos').insertOne({
  //   text: 'Hello World!',
  //   completed: false
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert todo', error);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  //
  db.collection('Users').insertOne({
    name: 'Roshan',
    age: 22,
    location: 'Nagpur'
  }, (error, result) => {
    if (error) {
      return console.log('Unable to insert user', error);
    }

    console.log(result.ops[0]._id.getTimestamp());
  });

  db.close();
});
