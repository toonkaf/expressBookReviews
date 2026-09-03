const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password are required"});
  }

  if (!isValid(username)) { 
    users.push({"username": username, "password": password});
    return res.status(300).json({message: "User successfully registered. Now you can login"});
  } else {
    return res.status(404).json({message: "User already exists!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(300).send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let result = [];
  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  });
  if (result.length > 0) {
    return res.status(300).send(JSON.stringify(result, null, 4));
  } else {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result = [];
  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      result.push(books[key]);
    }
  });
  if (result.length > 0) {
    return res.status(300).send(JSON.stringify(result, null, 4));
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(300).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(JSON.stringify(response.data, null, 4));
  } catch (error) {
    console.error(error.message);
  }
}


async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(JSON.stringify(response.data, null, 4));
  } catch (error) {
    console.error(error.message);
  }
}


async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(JSON.stringify(response.data, null, 4));
  } catch (error) {
    console.error(error.message);
  }
}


async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(JSON.stringify(response.data, null, 4));
  } catch (error) {
    console.error(error.message);
  }
}


module.exports.general = public_users;
