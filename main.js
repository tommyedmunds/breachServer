const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const cookieController = require('./cookieTester');
const jqueryController = require('./jqueryXSS');
const javascriptController = require('./javascriptXSS');
const links = require('./srcSweeper');
const loop = require('./puppeteerLoop');
const cors = require('cors');

//app.use(express.static(path.join(__dirname, './cookieTester')));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/cookieTester', cookieController.cookieTester, (req, res) => {
  console.log(req.body);
  res.status(200).json(res.locals.cookieResult);
});

app.post('/jqueryXSS', jqueryController.jqueryTester, (req, res) => {
  console.log(req.body);
  res.status(200).json(res.locals.jqueryResult);
});

app.post('/javascriptXSS', javascriptController.javascriptTester, (req, res) => {
  console.log(req.body);
  res.status(200).json(res.locals.javascriptResult);
});

app.post('/innerHTML', links.getLinks, loop.getHTMLcount, (req, res) => {
  console.log(req.body);
  res.status(200).json(res.locals.innerHTMLcount);
});

app.use((err, req, res, next) => {
  const defaultError = {
    log: 'Express server caught an error!',
    status: 400,
    message: { err: 'an error occured' },
  };

  const errorObj = { ...defaultError, ...err };
  console.log(errorObj);

  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening at http://localhost:5000`);
});
