const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {testTodos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((result) => {
        expect(result.body.text).toBe(text);
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => done(error));
      });
  });

  it('should not create todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(4);
          done();
        }).catch((error) => done(error));
      });
    });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((result) => {
        expect(result.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${testTodos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect((result) => {
        expect(result.body.todo.text).toBe(testTodos[0].text);
      })
      .end(done);
  });

  it('should NOT return todo doc created by other users', (done) => {
    request(app)
      .get(`/todos/${testTodos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should be return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/a1b2c3d4')
      .expect(401)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove todo by id', (done) => {
    var hexId = testTodos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((error, result) => {
        if (error) {
          return done(error);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((error) => done(error));
      });
  });

  it('should remove todo by id', (done) => {
    var hexId = testTodos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .end((error, result) => {
        if (error) {
          return done(error);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((error) => done(error));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('shoul return 404 if ObjectID is not valid', (done) => {
    request(app)
      .delete('/todos/a1b2c3d4')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = testTodos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed : true,
        text
      })
      .expect(200)
      .expect((result) => {
        expect(result.body.todo.text).toBe(text);
        expect(result.body.todo.completed).toBe(true);
        expect(typeof result.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should not update the todo created by other user', (done) => {
    var hexId = testTodos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed : true,
        text
      })
      .expect(200)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = testTodos[0]._id.toHexString();
    var text = 'This should be the new text!!!';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed : false,
        text
      })
      .expect(200)
      .expect((result) => {
        expect(result.body.todo.text).toBe(text);
        expect(result.body.todo.completed).toBe(false);
        expect(result.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((result) => {
        expect(result.body._id).toBe(users[0]._id.toHexString());
        expect(result.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((result) => {
        expect(result.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'paturkarr@gmail.com';
    var password = '1234567';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((result) => {
        expect(result.headers['x-auth']).toBeTruthy();
        expect(result.body._id).toBeTruthy();
        expect(result.body.email).toBe(email);
      })
      .end((error) => {
        if (error) {
          return done(error);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(!password);
          done();
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((result) => {
        expect(result.headers['x-auth']).toBeTruthy();
      })
      .end((error, result) => {
        if (error) {
          return done(error);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: result.headers['x-auth']
          });
          done();
        }).catch((error) => done(error));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((result) => {
        expect(result.headers['x-auth']).toBeFalsy();
      })
      .end((error, result) => {
        if (error) {
          return done(error);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((error) => done(error));
      });
  });
});


describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((error, result) => {
        if (error) {
          return done(error);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((error) => done(error));
      });
  });
});
