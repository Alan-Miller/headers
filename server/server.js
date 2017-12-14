require('dotenv').config();
const { server_port, STRING } = process.env;
// const server_port = 3101;

const express = require('express')
    , massive = require('massive')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , app = express();

const people = [
    {
        name: 'Eleven',
        skill: 'telekinesis'
    },
    {
        name: 'Steve',
        skill: 'spiky bat'
    },
    {
        name: 'Joyce',
        skill: 'grit'
    },
    {
        name: 'Mr. Clark',
        skill: 'science'
    }
]

massive(STRING).then(db => app.set('db', db));

// app.use(cors());

app.use((req, res, next) => {
    console.log(req.method, req.url, req.headers.origin);
    next();
});

app.use((req, res, next) => {
    reqOrigin = req.headers.origin;
    if (['http://localhost:3100', 'http://localhost:3010'].find(origin => origin === reqOrigin)) {
        res.setHeader('Access-Control-Allow-Origin', reqOrigin);
    }

    res.set({
        'Content-Type': 'application/json',
        //   'Access-Control-Allow-Origin': '*', // see JS logic above for how to whitelist multiples origins
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE, HEAD',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Expose-Headers': 'Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Expose-Headers, Content-Length, Content-Security-Policy, Content-Type, Date, ETag, Vary, X-Frame-Options, X-Powered-By, X-XSS-Protection',
        'Access-Control-Allow-Credentials': true,
        'X-XSS-Protection': '1; mode=block',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': "default-src 'self'"
    });
    next();
});

app.use(bodyParser.json());

app.get('/people', (req, res) => {
    people.push(req.headers);
    res.status(200).send(people);
});

app.get('/students', (req, res) => {
    req.app.get('db').get_students().then(students => { students.push(req.headers); res.status(200).send(students); });
});

app.delete('/student/:name', (req, res) => {
    req.app.get('db').delete_amy([req.params.name]).then(students => { students.push(req.headers); res.status(200).send(students); });
});

app.post('/student', (req, res) => {
    console.log('req.is', req.is('application/json'));
    req.app.get('db').add_amy([req.body.name]).then(students => { students.push(req.headers); res.status(200).send(students); });
});

app.listen(server_port, () => { console.log(`Listening on ${server_port}.`); });