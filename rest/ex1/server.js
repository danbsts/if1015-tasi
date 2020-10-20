var express = require('express')
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());

const tasks = [];

let curId = 1;

app.get('/tasks', (req, res) => {
  const day = req.query.day;
  if (day) {
    res.send({ tasks: tasks.filter(task => task.day == day) });
  } else {
    res.send({
      segunda: tasks.filter(task => task.day == 'segunda'),
      terca: tasks.filter(task => task.day == 'terca'),
      quarta: tasks.filter(task => task.day == 'quarta'),
      quinta: tasks.filter(task => task.day == 'quinta'),
      sexta: tasks.filter(task => task.day == 'sexta'),
      sabado: tasks.filter(task => task.day == 'sabado'),
      domingo: tasks.filter(task => task.day == 'domingo'),
    });
  }
});

app.get('/tasks/:id', (req, res) => {
  const id = +req.params.id;
  const task = tasks.find(task => task.id === id)
  res.send({
    ...task,
    links: {
      href: `tasks?day=${task.day}`,
      rel: "tasks",
      type : "GET"
    },
  });
});

app.post('/tasks', (req, res) => {
  const task = { id: curId++, ...req.body };
  tasks.push(task);
  res.status(201);
  res.send({ id: task.id });
})

app.delete('/tasks/:id', (req, res) => {
  const id = +req.params.id;
  tasks.splice(tasks.findIndex(task => task.id === id), 1);
  res.send();
})

app.put('/tasks', (req, res) => {
  const newTask = req.body;
  console.log(newTask)
  const task = tasks.find(task => task.id === newTask.id);
  task.description = newTask.description;
  task.day = newTask.day;
  task.done = newTask.done;
  res.send();
})

app.listen(3000, () => {
  console.log('stoy ouvindo.');
})