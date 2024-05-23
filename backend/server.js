import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: true,
  },
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Connection error', error.stack);
  }
};

connectDB();

app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database query error' });
  }
});

app.post('/api/books', async (req, res) => {
  const { name, author, image_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO books (name, author, image_url) VALUES ($1, $2, $3) RETURNING *',
      [name, author, image_url]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database insert error' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database delete error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
