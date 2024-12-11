const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const app = express();

app.get("/",(req,res)=>{
  const filePath = path.resolve(__dirname, '../build', 'index.html');
 fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/__TITLE__/g, 'Home Page')
    .replace(/__DESCRIPTION__/g, 'This is the Home Page')
    res.send(data);
  });
})

app.get("/blog/:slug",(req,res)=>{
  const filePath = path.resolve(__dirname, '../build', 'index.html');
 fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/__TITLE__/g, 'Blog Page')
    .replace(/__DESCRIPTION__/g, 'This is the Blog Page')
    res.send(data);
  });
}
)

app.use(express.static(path.resolve(__dirname, '../build')));

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
} ) 