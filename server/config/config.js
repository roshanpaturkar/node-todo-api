var env = 'mongodb://todo_user:todoapp@123@ds217131.mlab.com:17131/my_todo_nodeapp' || 'developement';

if (env === 'developement' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
