const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('sequelize')
const apiRoute = require('./routes/index')
const bodyParser = require('body-parser')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp);


app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRoute)
//app.get('/', (req, res) => res.send('Notes App'));

app.listen(port, () => console.log(`notes-app listening on port ${port}!`));
module.exports = app
