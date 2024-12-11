import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('https://kao-nepal-backend.onrender.com/blog').then((res) => setBlogs(res.data.data.blogs));
  }, []);

  return (
    <div>
      <h1>Blog List</h1>
      {blogs.map((blog) => (
        <div key={blog.blogSlug}>
          <h2>{blog.blogTitle}</h2>
          <Link to={`/blog/${blog.blogSlug}`}>Read More</Link>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
