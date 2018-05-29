const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(client.service('mongodb', 'mongodb-atlas').db('todo-apis') || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
