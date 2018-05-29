const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Unable to connect mongodb server.', error);
  }
  console.log('Connected to mongodb server.');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: ObjectID('5b0c65fb43c6c56ad0661976')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // })

  db.collection('Users').findOneAndUpdate({
    _id: ObjectID('5b0c54a71cecc624859e1efa')
  }, {
    $set: {
      name: 'Roshan'
    },
    $inc: {
       age: 1
     }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  })

  // db.close();
});
