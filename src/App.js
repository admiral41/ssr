import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Homepage';
import BlogPage from './BlogPost';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog/:slug" element={<BlogPage />} />
    </Routes>
  );
}

export default App;
