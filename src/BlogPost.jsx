import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

function BlogPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.get(`https://kao-nepal-backend.onrender.com/blog/${slug}`).then((res) => setBlog(res.data.data));
  }, [slug]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div>
      <Helmet>
        <title>{blog.blogTitle}</title>
        <meta name="description" content={blog.shortDescription} />
        <meta property="og:title" content={blog.blogTitle} />
        <meta property="og:description" content={blog.shortDescription} />
        <meta property="og:image" content={`https://kao-nepal-backend.onrender.com/${blog.blogImage}`} />
        <meta property="og:url" content={`https://ssr-wheat.vercel.app/blog/${slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.blogTitle} />
        <meta name="twitter:description" content={blog.shortDescription} />
        <meta name="twitter:image" content={`https://kao-nepal-backend.onrender.com/${blog.blogImage}`} />
        <meta name="twitter:url" content={`https://ssr-wheat.vercel.app/blog/${slug}`} />
      </Helmet>

      <h1>{blog.blogTitle}</h1>
      <img src={`https://kao-nepal-backend.onrender.com/${blog.blogImage}`} alt={blog.blogTitle} />
      <p>{blog.blogContent}</p>
    </div>
  );
}

export default BlogPage;
