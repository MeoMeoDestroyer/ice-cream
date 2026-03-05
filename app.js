// Import the express module

import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
// Create an instance of an Express application

const app = express();
dotenv.config();

//create database connection pool
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}).promise();

//database test route
app.get('/db-test', async (req, res) => {
  try {
    const orders = await pool.query('SELECT * FROM orders');
    res.send(orders[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Database error: ' + err.message);
  }
});


// Define the port number where our server will listen

const PORT = 3006;


// Define a default "route" ('/')
 app.use(express.static('public'));
 app.set('view engine', 'ejs');
app.set('views', './views'); // folder where your .ejs files live
 app.use(express.urlencoded({extended:true}));

// req: contains information about the incoming request

// res: allows us to send back a response to the client

app.get('/', (req, res) => {

  res.render('home');
});
app.get('/admin', (req, res) => {

  res.render('admin',{order});
});
app.get('/confirm', (req, res) => {
  res.render('confirm');
});
const orders = [];
app.post('/order', (req, res) => {

  const order = req.body;

  orders.push(order);
  res.render('confirm', {order});
});
// Start the server and listen on the specified port

app.listen(PORT, () => {

    console.log(`Server is running at http://localhost:${PORT}`);

});

