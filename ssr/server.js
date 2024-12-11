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
const { StaticRouter } = require('react-router-dom/server');

const app = express();
const PORT = 3000;
const buildPath = path.join(__dirname, '../build');

app.use(express.static(buildPath));

app.get('*', async (req, res) => {
  try {
    const slugMatch = req.url.match(/^\/blog\/([^/]+)$/);
    let blog = null;

    // If the route matches a blog slug, fetch blog data
    if (slugMatch) {
      const slug = slugMatch[1];
      const response = await axios.get(`https://kao-nepal-backend.onrender.com/blog/${slug}`);
      blog = response.data.data;
    }

    let html = fs.readFileSync(path.join(buildPath, 'index.html'), 'utf8');

    // Default values if blog is not found
    let title = 'Myunicampus';
    let description = 'this is my unicampus static';
    let image = 'https://myunicampus.com/assets/images/unicampus_logo.svg';
    let url = 'https://ssr-wheat.vercel.app';

    // If the route is a blog, replace with dynamic values
    if (blog) {
      title = blog.blogTitle;
      description = blog.shortDescription;
      image = `https://kao-nepal-backend.onrender.com/${blog.blogImage}`;
      url = `https://ssr-wheat.vercel.app/blog/${blog.blogSlug}`;
    }

    // Replace placeholders with dynamic content
    html = html.replace('__OG_TITLE__', title);
    html = html.replace('__OG_DESCRIPTION__', description);
    html = html.replace('__OG_IMAGE__', image);
    html = html.replace('__OG_URL__', url);

    const context = {};
    const appMarkup = ReactDOMServer.renderToString(
      React.createElement(
        StaticRouter,
        { location: req.url, context },
        React.createElement(App)
      )
    );

    html = html.replace('<div id="root"></div>', `<div id="root">${appMarkup}</div>`);

    res.send(html);
  } catch (error) {
    console.error('Error during SSR rendering:', error);
    res.status(500).send('Error rendering page');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
