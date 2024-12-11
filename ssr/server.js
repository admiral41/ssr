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

// Dynamic rendering for all routes, including blog pages
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

    const context = {};
    const appMarkup = ReactDOMServer.renderToString(
      React.createElement(
        StaticRouter,
        { location: req.url, context },
        React.createElement(App)
      )
    );

    const helmet = Helmet.renderStatic();

    // Inject Open Graph meta tags dynamically if blog data exists
    html = html.replace(
      '<head>',
      `<head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${
          blog
            ? `
            <meta property="og:title" content="${blog.blogTitle}" />
            <meta property="og:description" content="${blog.shortDescription}" />
            <meta property="og:image" content="https://kao-nepal-backend.onrender.com/${blog.blogImage}" />
            <meta property="og:url" content="https://ssr-wheat.vercel.app/blog/${blog.blogSlug}" />

            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="${blog.blogTitle}">
            <meta name="twitter:description" content="${blog.shortDescription}">
            <meta name="twitter:image" content="https://kao-nepal-backend.onrender.com/${blog.blogImage}">
            <meta name="twitter:url" content="https://ssr-wheat.vercel.app/blog/${blog.blogSlug}">
        `
            : `
            <meta property="og:title" content="My Unicampus" />
            <meta property="og:description" content="Welcom to my unicampus" />
            <meta property="og:image" content="https://myunicampus.com/assets/images/unicampus_logo.svg" />
            <meta property="og:url" content="https://ssr-wheat.vercel.app" />
            `
        }
      `
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
