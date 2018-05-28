const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Unable to connect mongodb server.', error);
  }
  console.log('Connected to mongodb server.');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5b0c52539d433523c89a1961')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // },(error) => {
  //   console.log('Unable to find todos', error);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos Count : ${count}`);
  // },(error) => {
  //   console.log('Unable to find todos', error);
  // });

  db.collection('Users').find({name: 'Roshan'}).toArray().then((docs) => {
    console.log('Users : ');
    console.log(JSON.stringify(docs, undefined, 2));
  },(error) => {
    console.log('Unable to find todos', error);
  });

  db.collection('Users').find({name: 'Roshan'}).count().then((count) => {
    console.log(`Users Count : ${count}`);
  },(error) => {
    console.log('Unable to find todos', error);
  });

  // db.close();
});
