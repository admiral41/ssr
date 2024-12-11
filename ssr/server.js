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

const app = express();
const PORT = 3000;
const buildPath = path.join(__dirname, '../build');

app.use(express.static(buildPath));

app.get('https://kao-nepal-backend.onrender.com/blog/:slug', async (req, res) => {
  const slug = req.params.slug;

  try {
    const response = await axios.get(`https://kao-nepal-backend.onrender.com/blog/${slug}`);
    const blog = response.data.data;

    console.log('Blog data:', blog);
    let html = fs.readFileSync(path.join(buildPath, 'index.html'), 'utf8');

    const context = {};
    const appMarkup = ReactDOMServer.renderToString(
      React.createElement(
        StaticRouter,
        { location: req.url, context },
        React.createElement(App, { blog })
      )
    );

    const helmet = Helmet.renderStatic();
    html = html.replace(
      '<head>',
      `<head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        <meta property="og:title" content="${blog.blogTitle}" />
        <meta property="og:description" content="${blog.shortDescription}" />
        <meta property="og:image" content="https://kao-nepal-backend.onrender.com/${blog.blogImage}" />
        <meta property="og:url" content="https://kao-nepal-backend.onrender.com/blog/${slug}" />
      `
    );

    html = html.replace('<div id="root"></div>', `<div id="root">${appMarkup}</div>`);

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching blog data');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
