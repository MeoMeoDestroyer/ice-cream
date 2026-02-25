// Import the express module

import express from 'express';


// Create an instance of an Express application

const app = express();


// Define the port number where our server will listen

const PORT = 3006;
let orders = []; //empty array


// Define a default "route" ('/')
 app.use(express.static('public'));
 app.use(express.json());
 app.set('view engine','ejs');
 app.use(express.urlencoded({extended:true}));



app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
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
// Start the server and listen on the specified port

app.listen(PORT, () => {

    console.log(`Server is running at http://localhost:${PORT}`);

});

