'use strict';

const Hapi = require('hapi');
const henkan = require('./lib/henkan');
const PORT = 3005;
const server = new Hapi.Server();

server.connection({host: 'localhost',port: PORT });
server.route({
    method: 'GET',
    path:'/',
    handler: (request, reply) => {
      henkan(request.query.url, (res) => {
        console.log(res);
        reply(res);
      });
    }
});
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});