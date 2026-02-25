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

// req: contains information about the incoming request

// res: allows us to send back a response to the client

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/admin', (req, res) => {
  res.render('admin',{order});
});

app.get('/confirm', (req, res) => {
  res.render('confirm');
});

app.post('/order', (req, res) => {
const {
  name,
  email,
  size,
  cone, 
  comments
} = req.body;

  const order = {
    name,
    email,
    flavors: [size],
    cone,
    toppings: req.body.toppings,
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

