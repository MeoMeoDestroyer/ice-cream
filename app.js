import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config(); // ← FIX 1: was missing entirely

const app = express(); // ← FIX 2: must be declared BEFORE any app.use/get/post

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
}).promise();

const PORT = 3006;
let orders = [];

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

// FIX 3: removed duplicate app.get('/'), kept the redirect
app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/admin', (req, res) => {
  res.render('admin', { orders });
});

app.get('/confirm', (req, res) => {
  res.render('confirm');
});

app.post('/confirm', async (req, res)=>{
  try{
    const order = req.body;

    console.log('New order submitted:', order);

    order.toppings = Array.isArray(order.toppings) ? order.toppings.join(", ") : "";

    const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings) VALUES(?, ?, ?, ?, ?);`;

    const params=[
      order.customer,
      order.email,
      order.flavor,
      order.cone,
      order.toppings
    ];

    const result = await pool.execute(sql,params);
    console.log('Order saved with ID:', result[0].insertId);

    res.render('confirmation', {order});
  }catch (err){
    console.error('Error saving order:', err);
    res.status(500).send('Sorry, there was an error processing your order. Please try again.');
  }
});

// FIX 4: moved app.get('/db-test') OUTSIDE of app.post('/orders')
app.get('/db-test', async (req, res) => {
  try {
    const orders = await pool.query('SELECT * FROM orders');
    res.send(orders[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Database error: ' + err.message);
  }
});

app.post('/orders', (req, res) => {
  const { name, email, flavor, cone, comments } = req.body;

  let toppings = req.body['toppings[]'] || [];

  const order = {
    name,
    email,
    flavors: Array.isArray(flavor) ? flavor : [flavor],
    cone,
    toppings: Array.isArray(toppings) ? toppings : [toppings],
    comment: comments,
    timestamp: new Date()
  };

  orders.push(order);
  res.render('confirm', { order });
});

//display all order
app.get('/admin', async (req, res) =>{
  try {
    //fetch all order from database
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');
      // render

      res.render('admin', {orders});
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Error loading orders: ' + err.message);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});