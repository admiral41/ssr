const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, '..', 'build'), { maxAge: '30d' }));

const indexPath = path.resolve(__dirname, '..', 'build', 'index.html');

app.get('/blog/:slug', async (req, res) => {
    const { slug } = req.params;
    const baseUrl = 'https://kao-nepal-backend.onrender.com';

    try {
        const response = await axios.get(`${baseUrl}/blog/${slug}`);
        const blog = response.data.data;

        if (!blog) {
            console.error(`Blog not found for slug: ${slug}`);
            return res.status(404).send('Blog not found');
        }

        const htmlData = fs.readFileSync(indexPath, 'utf8');

        const updatedHtml = htmlData
            .replace('<title>React App</title>', `<title>${blog.blogTitle}</title>`)
            .replace('__META_DESCRIPTION__', blog.shortDescription)
            .replace('__META_OG_TITLE__', blog.blogTitle)
            .replace('__META_OG_DESCRIPTION__', blog.shortDescription)
            .replace('__META_OG_IMAGE__', `https://kao-nepal-backend.onrender.com/${blog.blogImage}`)
            .replace('__META_OG_URL__', `http://localhost:3000/blog/${slug}`);

        res.send(updatedHtml);
    } catch (error) {
        console.error('Error fetching blog details:', error.message);
        console.error('Full error:', error);

        if (error.response && error.response.status === 404) {
            res.status(404).send('Blog not found'); 
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});


app.get('/*', (req, res) => {
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
