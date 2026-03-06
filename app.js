import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import express from 'express';

// PLEASE READ: the web is 64.23.137.40:3006 - alr submit with your name, no need to submit

dotenv.config();

const app = express();
const PORT = 3006;

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
}).promise();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.redirect('/home'));

app.get('/home', (req, res) => res.render('home'));

// Order form
app.get('/order', (req, res) => res.render('order'));

// Submit order → save to DB → show confirmation
app.post('/confirm', async (req, res) => {
  try {
    const order = req.body;
    order.toppings = Array.isArray(order.toppings)
      ? order.toppings.join(', ')
      : order.toppings || '';

    const sql = `INSERT INTO orders (customer, email, flavor, cone, toppings) VALUES (?, ?, ?, ?, ?)`;
    const params = [order.customer, order.email, order.flavor, order.cone, order.toppings];
    const result = await pool.execute(sql, params);

    console.log('Order saved with ID:', result[0].insertId);
    res.render('confirm', { order });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).send('Sorry, there was an error processing your order. Please try again.');
  }
});

// Admin — fetch all orders from DB
app.get('/admin', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');
    res.render('admin', { orders });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Error loading orders: ' + err.message);
  }
});

// DB connectivity test
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders');
    res.send(rows);
  } catch (err) {
    res.status(500).send('Database error: ' + err.message);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});