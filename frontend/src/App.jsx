import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css'; // Importiere die CSS-Datei

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ name: '', author: '', image_url: '' });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books', error);
      }
    };

    fetchBooks();
  }, []);

  const addBook = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/books', newBook);
      setBooks([...books, response.data]);
      setNewBook({ name: '', author: '', image_url: '' });
    } catch (error) {
      console.error('Error adding book', error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      console.error('Error deleting book', error);
    }
  };

  return (
    <div className="container">
      <h1>Books</h1>
      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className="book-item">
            <h2>{book.name}</h2>
            <p>{book.author}</p>
            <img src={book.image_url} alt={book.name} />
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Add a New Book</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Name"
          value={newBook.name}
          onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newBook.image_url}
          onChange={(e) => setNewBook({ ...newBook, image_url: e.target.value })}
        />
        <button onClick={addBook}>Add Book</button>
      </div>
    </div>
  );
};

export default App;
