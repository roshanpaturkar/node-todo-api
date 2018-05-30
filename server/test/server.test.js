const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const testTodos = [{
  _id: new ObjectID(),
  text: "First test todo"
},{
  _id: new ObjectID(),
  text: "Second test todo"
}, {
  _id: new ObjectID(),
  text: "Third test todo",
  completed: true,
  completedAt: 333
}, {
  _id: new ObjectID(),
  text: "Forth test todo",
  completed: true,
  completedAt: 4444
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(testTodos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((result) => {
        expect(result.body.todos.length).toBe(4);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${testTodos[0]._id.toHexString()}`)
      .expect((result) => {
        expect(result.body.todo.text).toBe(testTodos[0].text);
      })
      .end(done);
  });

  it('should be return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/a1b2c3d4')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove todo by id', (done) => {
    var hexId = testTodos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((result) => {
        expect(result.body.todo._id).toBe(hexId);
      })
      .end((error, result) => {
        if (error) {
          return done(error);
        }

        Todo.findById(hexId).then((todo) => {
          expect(null).toBe(todo);
          // expect(todo).toNotExist();
          done();
        }).catch((error) => done(error));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('shoul return 404 if ObjectID is not valid', (done) => {
    request(app)
      .delete('/todos/a1b2c3d4')
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
      .send({
        completed : true,
        text
      })
      .expect(200)
      .expect((result) => {
        expect(result.body.todo.text).toBe(text);
        expect(result.body.todo.completed).toBe(true);
        // expect(result.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = testTodos[3]._id.toHexString();
    var text = 'This should be the new text!!!';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed : false,
        text
      })
      .expect(200)
      .expect((result) => {
        expect(result.body.todo.text).toBe(text);
        expect(result.body.todo.completed).toBe(false);
        expect(result.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});
