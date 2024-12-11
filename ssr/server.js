require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('../src/App').default;
const { Helmet } = require('react-helmet');
const { StaticRouter } = require('react-router-dom');
const htmlManipulator = require('../htmlManipulator');

const app = express();
const PORT = 3000;
const buildPath = path.join(__dirname, '../build');

app.use(express.static(buildPath));

// Route for dynamic meta tags
app.use('/', require('./route'));

app.get('/*', (req, res) => {
  const context = {};
  const appMarkup = ReactDOMServer.renderToString(
    React.createElement(
      StaticRouter,
      { location: req.url, context },
      React.createElement(App)
    )
  );

  const helmet = Helmet.renderStatic();

  fs.readFile(path.join(buildPath, 'index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (context.url) {
      return res.redirect(301, context.url);
    }

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${appMarkup}</div>${helmet.title.toString()}${helmet.meta.toString()}`
      )
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
