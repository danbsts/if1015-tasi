var express = require('express')
var bodyParser = require("body-parser");
var convert = require('xml-js')
var cors = require('cors')
var tags = require('./response')

var app = express();
app.use(bodyParser.json());
app.use(cors())


const tasks = [];

let curId = 1;

const formatBody = (req, res) => {
  if (req.accepts('xml') && !req.accepts('json')) {
    return convert.json2xml({tasks: res}, { compact: true });
  } else {
    return res;
  }
}

const parseReqJson = (req) => {
  if (req.headers['content-type'] === 'application/xml') {
    return convert.xml2json(req.body, { compact: true });
  } else {
    return req.body;
  }
}

const getContentType = (req) => {
  if (req.headers.accept === 'application/xml') {
    return 'application/xml';
  }
  return 'application/json';
}

app.get('/tasks', (req, res) => {
  const day = req.query.day;
  const address = req.query.address;
  let tasksResponse = tasks;
  if (day) {
    tasksResponse = tasks.filter(task => task.day == day);
  } 
  if (address) {
    tasksResponse = tasksResponse.filter(task => task.address === address);
  }
  res.setHeader('content-type', getContentType(req));
  if (day || address) {
    const response = { 
      tasks: tasksResponse.map(({ id, description }) => ({ id, description })),
      links: tasksResponse.map(task => ({
        href: `/tasks/${task.id}`,
        rel: "task",
        type : "GET"
      }))
    }
    res.send(formatBody(req, response));
  } else {
    const response = {
      tasks: {
        segunda: tasksResponse
          .filter(task => task.day == 'segunda')
          .map(({ id, description }) => ({ id, description })),
        terca: tasksResponse
          .filter(task => task.day == 'terca')
          .map(({ id, description }) => ({ id, description })),
        quarta: tasksResponse
          .filter(task => task.day == 'quarta')
          .map(({ id, description }) => ({ id, description })),
        quinta: tasksResponse
          .filter(task => task.day == 'quinta')
          .map(({ id, description }) => ({ id, description })),
        sexta: tasksResponse
          .filter(task => task.day == 'sexta')
          .map(({ id, description }) => ({ id, description })),
        sabado: tasksResponse
          .filter(task => task.day == 'sabado')
          .map(({ id, description }) => ({ id, description })),
        domingo: tasksResponse
          .filter(task => task.day == 'domingo')
          .map(({ id, description }) => ({ id, description })),
      },
      links: tasksResponse.map(task => ({
        href: `/tasks/${task.id}`,
        rel: "task",
        type : "GET"
      }))
    };
    res.send(formatBody(req, response));
  }
});

app.get('/tasks/:id', (req, res) => {
  const id = +req.params.id;
  const task = tasks.find(task => task.id === id)
  const response = {
    ...task,
    links: [
      {
        href: `/tasks?day=${task.day}`,
        rel: "tasks",
        type : "GET"
      },
      {
        href: `/tasks?address=${task.address.replace(/ /g, '%20')}`,
        rel: "tasks",
        type : "GET"
      },
    ]
  };
  res.setHeader('content-type', getContentType(req));
  res.send(formatBody(req, response));
});

app.post('/tasks', (req, res) => {
  const task = { id: curId++, ...parseReqJson(req) };
  tasks.push(task);
  res.status(201);
  res.setHeader('content-type', getContentType(req));
  res.send(formatBody(req, { id: task.id }));
})

app.delete('/tasks/:id', (req, res) => {
  const id = +req.params.id;
  tasks.splice(tasks.findIndex(task => task.id === id), 1);
  res.send();
})

app.put('/tasks', (req, res) => {
  const newTask = parseReqJson(req);
  const task = tasks.find(task => task.id === newTask.id);
  task.description = newTask.description;
  task.day = newTask.day;
  task.done = newTask.done;
  task.address = newTask.address;
  res.send();
})

app.get('/tags/:id', (req, res) => {
  const id = req.params.id;
  const {tags: data} = tags;
  res.send(data.find(tag => tag.id === id));
})

app.get('/tags', (_, res) => {
  const {tags: data} = tags;
  res.send(data);
})

app.post('/tags', (req, res) => {
  console.log(req.body);
})

app.listen(5000, () => {
  console.log('stoy ouvindo.');
})