const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if (error) {
    return console.log('Unable to connect mongodb server.', error);
  }
  console.log('Connected to mongodb server.');

  //deleteMany
  // db.collection('Todos').deleteMany({text: "go to sleep"}).then((result) => {
  //   console.log(result);
  // });
  // db.collection('Users').deleteMany({name: "Roshan"}).then((result) => {
  //   console.log(result);
  // });


  //deleteOne
  // db.collection('Todos').deleteOne({text: "go to sleep"}).then((result) => {
  //   console.log(result);
  // });
  // db.collection('Users').deleteOne({_id: new ObjectID('5b0c569eb8f60f251ba8bd66')}).then((result) => {
  //   console.log(result);
  // });




  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });
  db.collection('Users').findOneAndDelete({name: 'Lutika'}).then((result) => {
    console.log(result);
  });

  db.close();
});
