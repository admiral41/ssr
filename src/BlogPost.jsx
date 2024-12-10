import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

function BlogPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8888/blog/${slug}`).then((res) => setBlog(res.data.data));
  }, [slug]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div>
      <Helmet>
        <title>{blog.blogTitle}</title>
        <meta name="description" content={blog.shortDescription} />
        <meta property="og:title" content={blog.blogTitle} />
        <meta property="og:description" content={blog.shortDescription} />
        <meta property="og:image" content={`http://localhost:8888/${blog.blogImage}`} />
        <meta property="og:url" content={`http://localhost:3000/blog/${slug}`} />
      </Helmet>

      <h1>{blog.blogTitle}</h1>
      <img src={`http://localhost:8888/${blog.blogImage}`} alt={blog.blogTitle} />
      <p>{blog.blogContent}</p>
    </div>
  );
}

export default BlogPage;
