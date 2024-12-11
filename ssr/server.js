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

    // Fetch blog data if the route matches a blog slug
    if (slugMatch) {
      const slug = slugMatch[1];
      const response = await axios.get(`https://kao-nepal-backend.onrender.com/blog/${slug}`);
      blog = response.data.data;
    }

    // Read index.html
    let html = fs.readFileSync(path.join(buildPath, 'index.html'), 'utf8');

    // Render App to a string
    const context = {};
    const appMarkup = ReactDOMServer.renderToString(
      React.createElement(
        StaticRouter,
        { location: req.url, context },
        React.createElement(App)
      )
    );

    // Inject dynamic meta tags into placeholders
    html = html
      .replace(/__TITLE__/g, blog ? blog.blogTitle : 'My Unicampus')
      .replace(/__DESCRIPTION__/g, blog ? blog.shortDescription : 'This is My Unicampus')
      .replace(/__OG_TITLE__/g, blog ? blog.blogTitle : 'My Unicampus')
      .replace(/__OG_DESCRIPTION__/g, blog ? blog.shortDescription : 'This is My Unicampus')
      .replace(/__OG_IMAGE__/g, blog ? `https://kao-nepal-backend.onrender.com/${blog.blogImage}` : 'https://myunicampus.com/assets/images/unicampus_logo.svg')
      .replace(/__OG_URL__/g, blog ? `https://ssr-wheat.vercel.app/blog/${blog.blogSlug}` : 'https://ssr-wheat.vercel.app')
      .replace(/__TWITTER_TITLE__/g, blog ? blog.blogTitle : 'My Unicampus')
      .replace(/__TWITTER_DESCRIPTION__/g, blog ? blog.shortDescription : 'This is My Unicampus')
      .replace(/__TWITTER_IMAGE__/g, blog ? `https://kao-nepal-backend.onrender.com/${blog.blogImage}` : 'https://myunicampus.com/assets/images/unicampus_logo.svg')
      .replace(/__TWITTER_URL__/g, blog ? `https://ssr-wheat.vercel.app/blog/${blog.blogSlug}` : 'https://ssr-wheat.vercel.app');

    // Inject SSR rendered markup into the root
    html = html.replace('<div id="root"></div>', `<div id="root">${appMarkup}</div>`);
    console.log(html);

    res.send(html);
  } catch (error) {
    console.error('Error during SSR rendering:', error);
    res.status(500).send('Error rendering page');
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
