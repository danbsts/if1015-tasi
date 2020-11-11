var axios = require('axios').default;
var format = require('xml-formatter');

const options = {
  host: 'localhost',
  port: '3000',
  path: process.argv[2],
  method: process.argv[3],
  body: process.argv[4],
  accepts: process.argv[5]
};

console.log(options)

axios.defaults.headers.common['accept'] = options.accepts;

let promise;
switch(options.method) {
  case 'POST':
    promise = axios.post(`http://localhost:3000${options.path}`, options.body);
    break;
  case 'GET':
    promise = axios.get(`http://localhost:3000${options.path}`);
    break;
  case 'PUT':
    promise = axios.put(`http://localhost:3000${options.path}`, options.body);
    break;
  case 'DELETE':
    promise = axios.delete(`http://localhost:3000${options.path}`);
    break;
}

promise
  .then((response) => {
    if(options.accepts === 'application/xml') {
      console.log(response.data)
      console.log(format(response.data));
    } else {
      console.log(JSON.stringify(response.data, null, 2));
    }
  })
  .catch((error) => {
    console.log(error.response);
  });