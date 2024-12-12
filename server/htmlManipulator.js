// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');

// const internal = {};

// internal.createHtml = (res, data) => {
//   const { imagepath, description, title, url } = data;
//   let html = fs.readFileSync(path.join(__dirname, '../build', 'index.html'), 'utf8');
//   html = html.replace('<title>React App</title>', `<title>${title}</title>`)
//              .replace('__META_DESCRIPTION__', description)
//              .replace('__META_OG_IMAGE__', imagepath)
//              .replace('__META_OG_URL__', url);
//   return res.send(html);
// };

// internal.BlogDetailsPage = async (req, res, next) => {
//   try {
//     const { slug } = req.params;
//     const baseUrl = 'https://kao-nepal-backend.onrender.com/';
//     const result = await axios.get(`${baseUrl}/blog/${slug}`);

//     if (result.data && result.data.success && result.data.data && result.data.data.blogTitle) {
//       const blogData = result.data.data;
//       const { blogTitle, shortDescription, blogContent, category } = blogData;
//       const imagepath = blogData.blogImage || '/default.jpg';  
//       const keywords = category; 
//       const pageUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

//       return internal.createHtml(res, { imagepath, description: shortDescription, title: blogTitle, url: pageUrl, keywords }, next);
//     } else {
//       console.error('Blog data not found in API response');
//       return internal.createHtml(res, {
//         imagepath: '/default.jpg',
//         description: 'Blog not found',
//         title: '404 - Blog not available',
//         url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
//       }, next);
//     }
//   } catch (err) {
//     console.error('Error fetching blog details:', err.message);
//     next(err);
//   }
// };

// module.exports = internal;
