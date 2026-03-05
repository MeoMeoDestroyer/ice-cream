import mysql2 from 'mysql2';
import dotenv from 'dotenv';

// Import the express module

import express from 'express';

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
}).promise();

// Define the port number where our server will listen

const PORT = 3006;
let orders = []; //empty array


// Define a default "route" ('/')
 app.use(express.static('public'));
 app.set('view engine', 'ejs');
app.set('views', './views'); // folder where your .ejs files live
 app.use(express.urlencoded({extended:true}));



app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/', (req, res) => {

  res.render('home');
});

app.get('/admin', (req, res) => {
  res.render('admin',{orders});
});

app.get('/confirm', (req, res) => {
  res.render('confirm');
});

app.post('/orders', (req, res) => {
const {
  name,
  email,
  flavor,
  cone, 
  comments
} = req.body;

app.get('/db-test', async(req,res)=>{
  try{
    const orders = await pool.query('SELECT * FROM orders');
    res.send(orders[0]);
  }catch (err){
    console.error('Database error:', err);
    res.status(500).send('Database error: ' + err.message);
  }
});


let toppings = req.body['toppings[]'] || []; //topping as an array

  const order = {
    name,
    email,
    flavors: Array.isArray(flavor) ? flavor : [flavor],
    cone,
    toppings: Array.isArray(toppings) ? toppings : [toppings],
    comment: comments,
    timestamp: new Date()
  }
  orders.push(order);
  res.render('confirm', {order});
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);

});

