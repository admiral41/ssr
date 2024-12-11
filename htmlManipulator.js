const fs = require('fs');
const path = require('path');
const htmlToText = require('html-to-text');
const axios = require('axios');

const internal = {};

internal.createHtml = (res, data, next) => {
  try {
    const { imagepath, description, title, url, keywords } = data;
    const text = htmlToText.convert(description, { wordwrap: 130 });
    const siteUrl = `${res.req.protocol}://${res.req.get('host')}`;
    const buildPath = path.join(__dirname, '../build');

    let html = fs.readFileSync(path.join(buildPath, 'index.html'), 'utf8');

    const metaTags = `
      <title>${title}</title>
      <meta name="description" content="${text}" />
      <meta name="keywords" content="${keywords}" />
      <meta name="author" content="Your Company Name" />
      <meta property="og:image" content="${siteUrl}${imagepath}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${text}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="MyUnicampus" />
      <meta property="og:locale" content="en_US" />
    `;

    html = html.replace('<head>', `<head>${metaTags}`);
    return res.send(html);
  } catch (err) {
    console.error('Error injecting meta tags:', err.message);
    return next(err);
  }
};

internal.BlogDetailsPage = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const baseUrl = process.env.VITE_APP_BASE_URI || 'https://kao-nepal-backend.onrender.com/';
    const result = await axios.get(`${baseUrl}/blog/${slug}`);

    if (result.data && result.data.success && result.data.data && result.data.data.blogTitle) {
      const blogData = result.data.data;
      const { blogTitle, shortDescription, blogContent, category } = blogData;
      const imagepath = blogData.blogImage || '/default.jpg';  // Using actual image path if exists
      const keywords = category;  // Or any other relevant field for keywords
      const pageUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

      return internal.createHtml(res, { imagepath, description: shortDescription, title: blogTitle, url: pageUrl, keywords }, next);
    } else {
      console.error('Blog data not found in API response');
      return internal.createHtml(res, {
        imagepath: '/default.jpg',
        description: 'Blog not found',
        title: '404 - Blog not available',
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      }, next);
    }
  } catch (err) {
    console.error('Error fetching blog details:', err.message);
    next(err);
  }
};

module.exports = internal;
