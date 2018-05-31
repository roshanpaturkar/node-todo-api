const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var token = jwt.sign(data, 'a1b2c3');
console.log(token);

var decoded = jwt.verify(token, 'a1b2c3');
console.log('Decoded', decoded);

// var message = 'hello world';
// var hash = SHA256(message).toString();
//
// console.log(`message : ${message}`);
// console.log(`Hash : ${hash}`);

// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not change.');
// } else {
//   console.log('Data was change. Do not trust');
// }
